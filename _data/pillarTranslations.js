const slugs = [
  "deepseek-chat-web-basics",
  "deepseek-multi-turn-memory",
  "deepseek-mobile-app-chat",
  "deepseek-chat-scenario-library",
  "deepseek-chat-export-share"
];

function postUrl(locale, slug) {
  if (locale === "zh-CN") return `/posts/${slug}/`;
  return `/${locale}/posts/${slug}/`;
}

const map = {};
for (const slug of slugs) {
  map[slug] = {
    "zh-CN": postUrl("zh-CN", slug),
    "zh-Hant": postUrl("zh-Hant", slug),
    en: postUrl("en", slug),
    ms: postUrl("ms", slug),
    ja: postUrl("ja", slug)
  };
}

module.exports = map;
