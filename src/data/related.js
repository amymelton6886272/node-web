import { articles, getArticlePath } from './articles.js';

/** Lightweight keyword maps so related links stay useful without a full search index. */
const TOPIC_TOOLS = {
  purchase: [
    { href: '/price', label: 'Price compare', labelZh: '价格对比' },
    { href: '/subcost', label: 'Sub cost calculator', labelZh: '订阅成本' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  subscription: [
    { href: '/subcost', label: 'Sub cost calculator', labelZh: '订阅成本' },
    { href: '/trial', label: 'Trial reminder', labelZh: '试用提醒' },
    { href: '/price', label: 'Price compare', labelZh: '价格对比' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  privacy: [
    { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
    { href: '/knowledge', label: 'Knowledge base', labelZh: '知识库' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  family: [
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
  ],
  security: [
    { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
    { href: '/knowledge', label: 'Knowledge base', labelZh: '知识库' },
    { href: '/ip', label: 'IP check', labelZh: 'IP 检测' },
  ],
  region: [
    { href: '/price', label: 'Price compare', labelZh: '价格对比' },
    { href: '/appfree', label: 'Free apps', labelZh: '限免应用' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
  ],
  support: [
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
    { href: '/articles', label: 'All articles', labelZh: '全部文章' },
  ],
  default: [
    { href: '/price', label: 'Price compare', labelZh: '价格对比' },
    { href: '/subcost', label: 'Sub cost calculator', labelZh: '订阅成本' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
  ],
};

function topicKey(article) {
  const hay = [
    article.category,
    ...(article.tags || []),
    article.slug,
    article.title,
  ]
    .join(' ')
    .toLowerCase();

  if (/refund|report|support|problem/.test(hay)) return 'support';
  if (/family|child|screen time|ask to buy|shared payment/.test(hay)) return 'family';
  if (/vpn|certificate|profile|security|permission|privacy|hide my email/.test(hay)) return 'privacy';
  if (/region|storefront|gift card|balance/.test(hay)) return 'region';
  if (/subscription|trial|paid app|cost|iap|purchase/.test(hay)) return 'subscription';
  if (/security/.test(hay)) return 'security';
  return 'default';
}

export function getRelatedTools(article, limit = 4) {
  const key = topicKey(article);
  const list = TOPIC_TOOLS[key] || TOPIC_TOOLS.default;
  return list.slice(0, limit);
}

export function getRelatedArticles(article, limit = 4) {
  const tags = new Set((article.tags || []).map((t) => String(t).toLowerCase()));
  const category = String(article.category || '').toLowerCase();

  const scored = articles
    .filter((item) => item.slug !== article.slug)
    .map((item) => {
      let score = 0;
      if (String(item.category || '').toLowerCase() === category) score += 3;
      for (const tag of item.tags || []) {
        if (tags.has(String(tag).toLowerCase())) score += 2;
      }
      // mild recency boost
      if (item.updatedAt) score += 0.001 * Date.parse(item.updatedAt || item.publishedAt || 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score || String(b.item.updatedAt).localeCompare(String(a.item.updatedAt)));

  return scored.slice(0, limit).map(({ item }) => ({
    href: getArticlePath(item),
    title: item.title,
    titleZh: item.titleZh || item.title,
    description: item.description,
    descriptionZh: item.descriptionZh || item.description,
  }));
}
