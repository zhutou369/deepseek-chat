const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

async function runAutoBot() {
    // 1. 检查环境变量中是否存在密钥
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn("⚠️ [环境提示] 未检测到 GEMINI_API_KEY 环境密钥。打包阶段跳过生成。");
        return; 
    }

    // 从命令行参数中获取需要生成的文章篇数（例如 node autobot.js 5）
    const args = process.argv.slice(2);
    let maxPosts = parseInt(args[0], 10) || 1;
    console.log(`🤖 收到发文指令，本次任务尝试批量生成: ${maxPosts} 篇文章`);

    // 2. 初始化 Gemini 客户端
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 🌟 维持你原本的路径设计，绝对不加 src/
    const jsonPath = path.join(__dirname, 'keywords.json');   
    const imagesPath = path.join(__dirname, 'images.txt'); 
    
    // 3. 检查并读取 JSON 关键词文本
    if (!fs.existsSync(jsonPath)) {
        console.warn("⚠️ 未找到 keywords.json 词库文件，跳过本次生成。");
        return;
    }
    
    let keywords = [];
    try {
        keywords = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch (e) {
        console.error("⚠️ 读取或解析 keywords.json 失败，请检查JSON语法:", e.message);
        return;
    }
    
    if (!Array.isArray(keywords) || keywords.length === 0) {
        console.warn("⚠️ 关键词库为空或格式非数组，请及时补充新选题！");
        return;
    }

    // 调整生成数量：如果输入的数量大于词库剩余词量，以词库剩余数量为准
    if (maxPosts > keywords.length) {
        console.log(`💡 提示：输入的数量 ${maxPosts} 大于词库剩余词量 ${keywords.length}，将生成现存的全部文章。`);
        maxPosts = keywords.length;
    }

    // 将文章生成的“核心步骤”打包塞入 for 循环，实现批量生成
    for (let currentLoop = 0; currentLoop < maxPosts; currentLoop++) {
        console.log(`\n------------------ 正在处理第 ${currentLoop + 1} / ${maxPosts} 篇 ------------------`);

        // 4. 提取并准备随机图片链接
        let selectedImages = [];
        if (fs.existsSync(imagesPath)) {
            try {
                const allImages = fs.readFileSync(imagesPath, 'utf-8')
                    .split(/\r?\n/)
                    .map(line => line.trim().replace(/^\s*/i, '')) 
                    .filter(line => line.length > 0 && line.startsWith('http'));

                if (allImages.length >= 2) {
                    const shuffled = allImages.sort(() => 0.5 - Math.random());
                    selectedImages = shuffled.slice(0, 2);
                    console.log(`图片配给成功: 1. ${selectedImages[0]} | 2. ${selectedImages[1]}`);
                } else if (allImages.length === 1) {
                    selectedImages = [allImages[0], allImages[0]];
                }
            } catch (e) {
                console.error("⚠️ 读取 images.txt 失败，本篇生成将不带插图:", e.message);
            }
        }

        // 5. 弹出并消费第一个关键词
        const currentTopic = keywords.shift();
        console.log(`当前推文选题确定: [ ${currentTopic} ]`);

        const todayStr = new Date().toISOString().split('T')[0];
        const randomId = Math.floor(100 + Math.random() * 900); 

        // 6. 构造图片指导 Prompt
        let imagePromptInstruction = '';
        if (selectedImages.length === 2) {
            imagePromptInstruction = `
    4. 【插图嵌入要求】：
       请在撰写文章正文时，将以下两个图片链接【严格、自然地】嵌入到不同的二级标题（##）或段落之间，提升排版丰富度。
       必须使用标准的 Markdown 图片格式，且必须补充具有 SEO 价值的 alt 描述（严禁包含中文百分号或特殊字符）。
       
       图片链接 1：${selectedImages[0]}
       图片链接 2：${selectedImages[1]}
       
       例如嵌入格式：![FinalShell 核心功能界面演示](${selectedImages[0]})
            `;
        }

        // 7. 构造终极 SEO Prompt 模板（已完全适配新版 11ty 模板布局与标签）
        const prompt = `
    你是一个精通技术SEO和前沿网络技术的专家博主。请针对主题 "${currentTopic}" 撰写一篇深入、对用户有极高价值的原创文章。
    
    【重要核心要求】：
    1. 请将本次的主题 "${currentTopic}" 翻译为一个干净、地道、用连字符隔开的【纯英文短语】，作为 URL 的别名（Slug）。
    2. 字数严格控制在 1200 - 2000 字之间，多用结构化列表、二级标题（##）、三级标题（###）。
    3. 严格按以下 Markdown 格式输出头部元数据，禁止在最外层包含 \`\`\`markdown 包裹外壳，必须直接以 --- 开头：

    ---
    title: "${currentTopic}"
    description: "针对${currentTopic}的专业技术解析与实操指南。"
    date: ${todayStr}
    tags: ["posts"]
    layout: "post.njk"
    permalink: "/posts/${todayStr}-你的纯英文短语-${randomId}/index.html"
    ---

    【注意】：请务必将上面 permalink 里面的 "你的纯英文短语" 替换为你真正翻译出来的英文 Slug。不要保留 any 多余的引号或括号。
    ${imagePromptInstruction}

    这里开始写文章正文。请多用二级标题（##）、三级标题（###）对内容进行多层级切分，保证极佳的SEO可读性与结构性。
        `;

        // ==========================================
        // 🌟 核心增设：智能防拥堵自动重试机制（防御 503 与 429 错误）
        // ==========================================
        let response;
        let retryCount = 0;
        const maxRetries = 3;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        while (retryCount < maxRetries) {
            try {
                console.log(`正在连接 Gemini API 生产高质量内容... (尝试第 ${retryCount + 1} 次)`);
                
                response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                if (response && response.text) {
                    console.log("🎉 Gemini API 响应成功！已顺利拿到正文内容。");
                    break; 
                } else {
                    throw new Error("Gemini 返回内容为空");
                }
            } catch (error) {
                retryCount++;
                const errMsg = error.message.toLowerCase();
                
                if (errMsg.includes('503') || errMsg.includes('unavailable') || errMsg.includes('429')) {
                    if (retryCount < maxRetries) {
                        console.warn(`⚠️ Google 伺服器忙碌或限流 (503/429)。原地静刻等待 5 秒后自动重试...`);
                        await delay(5000); 
                    }
                } else {
                    throw error;
                }
            }
        }

        if (!response || !response.text) {
            console.error(`❌ 连续尝试 ${maxRetries} 次后 Gemini API 依然拥堵，本次将选题塞回词库，跳过本篇。`);
            keywords.unshift(currentTopic);
            continue; 
        }

        // ==========================================

        try {
            let articleContent = response.text;

            articleContent = articleContent.replace(/permalink:\s*["']?\/posts\/([^"'\n]+)["']?/g, 'permalink: "/posts/$1"');

            const fileName = `${todayStr}-post-${randomId}-${currentLoop}.md`;
            
            const outputDir = path.join(__dirname, 'posts'); 
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            // 🌟 物理補齊先前被截斷的所有閉合區塊
            fs.writeFileSync(path.join(outputDir, fileName), articleContent, 'utf-8');
            console.log(`✅ 第 ${currentLoop + 1} 篇文章已成功写入本地磁盘: posts/${fileName}`);

        } catch (error) {
            console.error(`❌ 第 ${currentLoop + 1} 篇文章生成遭遇错误:`, error.message);
            keywords.unshift(currentTopic);
        }
    }

    // 🌟 物理補齊：當所有的迴圈執行完畢後，再一次性回寫更新後的 JSON 陣列詞庫
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(keywords, null, 2), 'utf-8');
        console.log(`\n📉 词库整体更新完毕！剩余可用关键词数: ${keywords.length}`);
    } catch (e) {
        console.error("❌ 回写 keywords.json 失败:", e.message);
    }
}

runAutoBot();
