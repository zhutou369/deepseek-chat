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
    5. 【插图嵌入要求】：
       请在撰写文章正文时，将以下两个图片链接【严格、自然地】嵌入到不同的二级标题（##）或段落之间，提升排版丰富度。
       必须使用标准的 Markdown 图片格式，且必须补充具有 SEO 价值的 alt 描述（严禁包含中文百分号或特殊字符）。
       
       图片链接 1：${selectedImages[0]}
       图片链接 2：${selectedImages[1]}
       
       例如嵌入格式：![FinalShell 核心功能界面演示](${selectedImages[0]})
            `;
        }

        // 7. 构造 SEO Prompt 模板（降低 AI 痕迹）
        const prompt = `
    你是熟悉 DeepSeek 与 API 开发的技术写作者。请针对主题 "${currentTopic}" 撰写一篇【简体中文】实用教程，字数 900-1500 字。
    
    【输出格式】：
    1. 将主题 "${currentTopic}" 翻译为简短英文 slug（小写、连字符分隔），用于 URL。
    2. 严格按以下 Markdown 头部输出，直接以 --- 开头，不要包裹 \`\`\`markdown：

    ---
    title: "${currentTopic}"
    description: "用一句话概括本文解决的具体问题与适用场景，40-80 字，禁止套用模板句。"
    date: ${todayStr}
    generated: true
    tags: ["posts"]
    layout: "post.njk"
    permalink: "/posts/${todayStr}-你的英文slug-${randomId}/index.html"
    ---

    【正文要求】：
    - 禁止以「作为一名」「今日我们将深入探讨」等自介开头；直接进入问题或步骤。
    - 禁止虚构「官方」「权威入口」「站群」「SEO 霸屏」等表述；DeepSeek 相关入口请写 chat.deepseek.com 或平台公开名称。
    - 禁止在正文第一行使用 # 一级标题；从 ## 二级标题或短引言开始。
    - 多用步骤清单、表格、代码示例；每个 ## 段落要有可执行信息，避免空泛形容。
    - description 必须针对本文独立撰写，不得包含「深度专业技术解析」或「的专业技术解析与实操指南」字样。
    ${imagePromptInstruction}
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

    // 🌟 物理補齊：當所有的迴圈執行完畢後，再一次性回寫更新後的 JSON 陣列词库
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(keywords, null, 2), 'utf-8');
        console.log(`\n📉 词库整体更新完毕！剩余可用关键词数: ${keywords.length}`);
    } catch (e) {
        console.error("❌ 回写 keywords.json 失败:", e.message);
    }
}

runAutoBot();

runAutoBot();
