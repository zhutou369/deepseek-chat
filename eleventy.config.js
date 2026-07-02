function isPostIndexable(data) {
  if (data.noindex === true || data.generated === true) return false;
  if (data.featured === true) return true;

  const desc = data.description || "";
  const title = data.title || "";

  if (desc.includes("深度专业技术解析") || desc.includes("的专业技术解析与实操指南")) {
    return false;
  }
  if (/官方|SEO长尾霸屏|站群|爆款文案|免翻墙|权威入口/.test(title)) {
    return false;
  }

  return true;
}

function assetVersion() {
  try {
    return require("./_data/site.js").assetVersion || "1";
  } catch {
    return "1";
  }
}

function cacheBustStaticUrl(url) {
  const path = String(url || "").trim();
  if (!path.startsWith("/static/")) return path;
  if (/[?&]v=/.test(path)) return path;
  return `${path}?v=${assetVersion()}`;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("static");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy({ "_headers": "_headers" });
  eleventyConfig.addPassthroughCopy({ "_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy("images.txt");
  eleventyConfig.addPassthroughCopy("ai1");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy({ "*.txt": "/" });

  eleventyConfig.addFilter("assetUrl", cacheBustStaticUrl);

  eleventyConfig.addFilter("localePath", function (localeId, localesList) {
    const item = (localesList || []).find((l) => l.id === localeId);
    return item ? item.path : "/";
  });

  eleventyConfig.addFilter("postPath", function (localeId, slug) {
    const locale = localeId || "zh-CN";
    if (!slug) return locale === "zh-CN" ? "/posts/" : `/${locale}/posts/`;
    return locale === "zh-CN" ? `/posts/${slug}/` : `/${locale}/posts/${slug}/`;
  });

  eleventyConfig.addFilter("forLocale", function (arr, locale) {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => (item.data.locale || "zh-CN") === locale);
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    locale: (data) => data.locale || "zh-CN",
    noindex: (data) => {
      if (data.noindex === true) return true;
      const inputPath = data.page?.inputPath || "";
      if (!inputPath.includes("posts")) return false;
      return !isPostIndexable(data);
    }
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((item) => {
        if (!item.date) return true;
        const now = new Date();
        return item.date.getTime() <= now.getTime() + 24 * 60 * 60 * 1000;
      })
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("indexablePosts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((item) => {
        if (!item.date) return isPostIndexable(item.data);
        const now = new Date();
        if (item.date.getTime() > now.getTime() + 24 * 60 * 60 * 1000) return false;
        return isPostIndexable(item.data);
      })
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("pillarPosts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/**/*.md")
      .filter((item) => item.data.translationKey && item.data.featured === true)
      .sort((a, b) => {
        const order = [
          "deepseek-chat-web-basics",
          "deepseek-multi-turn-memory",
          "deepseek-mobile-app-chat",
          "deepseek-chat-scenario-library",
          "deepseek-chat-export-share"
        ];
        return order.indexOf(a.data.translationKey) - order.indexOf(b.data.translationKey);
      });
  });

  eleventyConfig.addCollection("homepagePosts", function (collectionApi) {
    const posts = collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((item) => {
        if (!item.date) return isPostIndexable(item.data);
        const now = new Date();
        if (item.date.getTime() > now.getTime() + 24 * 60 * 60 * 1000) return false;
        return isPostIndexable(item.data);
      });
    const featured = posts
      .filter((item) => item.data.featured === true)
      .sort((a, b) => a.inputPath.localeCompare(b.inputPath, "zh-CN"));
    const rest = posts
      .filter((item) => item.data.featured !== true)
      .sort((a, b) => b.date - a.date);
    return [...featured, ...rest];
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, limit);
  });

  eleventyConfig.addFilter("dateFilter", function (dateValue) {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  eleventyConfig.addFilter("htmlDate", function (dateValue) {
    if (!dateValue) return "";
    return new Date(dateValue).toISOString().slice(0, 10);
  });

  eleventyConfig.addFilter("rfc822", function (dateValue) {
    if (!dateValue) return "";
    return new Date(dateValue).toUTCString();
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk"
  };
};
