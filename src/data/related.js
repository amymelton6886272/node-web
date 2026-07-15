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

export function getRelatedArticles(article, limit = 6) {
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

/** Stable hub links for article footers / index side panels. */
export function getHubLinks() {
  return [
    { href: '/articles', label: 'All articles', labelZh: '全部文章' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
    { href: '/knowledge', label: 'Knowledge base', labelZh: '知识库' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    { href: '/glossary', label: 'Glossary', labelZh: '术语表' },
    { href: '/price', label: 'Price compare', labelZh: '价格对比' },
    { href: '/subcost', label: 'Sub cost calculator', labelZh: '订阅成本' },
    { href: '/trial', label: 'Trial reminder', labelZh: '试用提醒' },
    { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
    { href: '/privacy', label: 'Privacy policy', labelZh: '隐私政策' },
  ];
}

/**
 * Ordered reading series for deep guides.
 * Each series is a hard internal-link path for crawl discovery + reader flow.
 */
export const ARTICLE_SERIES = [
  {
    id: 'trial-to-refund',
    title: 'Free trials → cancel → refund',
    titleZh: '试用 → 取消 → 退款',
    description: 'Start with trial traps, set a cancel path, then prepare refund evidence if needed.',
    descriptionZh: '从试用陷阱开始，规划取消路径，必要时准备退款证据。',
    slugs: [
      'free-trial-trap-checklist',
      'free-trial-to-paid-conversion-defense-playbook',
      'manage-apple-subscriptions-after-trial',
      'cancel-apple-subscription-step-by-step',
      'ios-subscription-stack-audit-and-cancel-order',
      'when-to-use-report-a-problem',
      'report-a-problem-refund-evidence-and-timing',
      'app-store-refund-request-checklist',
    ],
  },
  {
    id: 'region-account',
    title: 'Region & Apple ID research',
    titleZh: '地区与 Apple ID 研究',
    description: 'Research storefront moves and payment pitfalls before changing account region.',
    descriptionZh: '在切换账号地区前，先研究商店与支付风险。',
    slugs: [
      'safe-region-switching',
      'compare-app-store-regions-safely',
      'us-apple-id-registration-and-payment-research-2026',
      'cross-region-apple-id-switching-risk-matrix-2026',
      'app-store-gift-cards-and-balance-safety',
      'apple-gift-card-balance-safety-and-scam-patterns',
    ],
  },
  {
    id: 'privacy-permissions',
    title: 'Privacy labels & permissions',
    titleZh: '隐私标签与权限',
    description: 'Read privacy labels, refuse risky prompts, and keep signup hygiene tight.',
    descriptionZh: '读懂隐私标签，拒绝高风险权限，并保持注册卫生。',
    slugs: [
      'privacy-labels-and-permissions',
      'app-store-privacy-labels-how-to-read-like-an-auditor',
      'ios-permission-prompts-decision-guide',
      'ios-permission-prompt-decision-tree-for-daily-apps',
      'ios-subscription-traps-and-five-permissions-to-refuse',
      'hide-my-email-and-app-signups',
      'hide-my-email-signups-and-app-account-hygiene',
    ],
  },
  {
    id: 'family-charges',
    title: 'Family Sharing & surprise charges',
    titleZh: '家庭共享与意外扣费',
    description: 'Control shared purchases, Ask to Buy, Screen Time, and dispute paths.',
    descriptionZh: '管控共享购买、购买前询问、屏幕使用时间与争议路径。',
    slugs: [
      'family-sharing-purchase-safety',
      'child-device-app-install-rules',
      'screen-time-purchase-controls',
      'family-sharing-ask-to-buy-and-unexpected-charges',
      'shared-payment-method-family-disputes',
    ],
  },
  {
    id: 'security-installs',
    title: 'Install safety & profiles',
    titleZh: '安装安全与配置描述文件',
    description: 'Spot low-quality listings, profile/VPN risks, and unofficial install narratives.',
    descriptionZh: '识别低质上架、配置描述文件/VPN 风险与非官方安装话术。',
    slugs: [
      'spot-low-quality-app-store-listings',
      'when-not-to-install-free-apps',
      'app-store-search-ads-and-fake-popular-apps',
      'ios-vpn-profile-and-certificate-risks',
      'ios-configuration-profile-vpn-certificate-danger-guide',
      'testflight-sideload-and-unofficial-install-risks',
    ],
  },
  {
    id: 'purchase-research',
    title: 'Before-you-pay research',
    titleZh: '付款前研究流程',
    description: 'Compare prices, IAP, paid vs subscription, and a full research workflow.',
    descriptionZh: '价格对比、内购、买断 vs 订阅，以及完整研究流程。',
    slugs: [
      'app-store-research-workflow',
      'app-store-price-check-before-buying',
      'understand-in-app-purchases',
      'spot-subscription-fatigue-apps',
      'when-paid-app-beats-subscription',
      'apple-id-purchase-history-audit',
    ],
  },
];

function articleBySlug(slug) {
  return articles.find((item) => item.slug === slug) || null;
}

export function getArticleSeries(article) {
  if (!article?.slug) return null;
  for (const series of ARTICLE_SERIES) {
    const index = series.slugs.indexOf(article.slug);
    if (index === -1) continue;

    const items = series.slugs
      .map((slug) => articleBySlug(slug))
      .filter(Boolean)
      .map((item) => ({
        slug: item.slug,
        href: getArticlePath(item),
        title: item.title,
        titleZh: item.titleZh || item.title,
      }));

    const currentIndex = items.findIndex((item) => item.slug === article.slug);
    if (currentIndex === -1) return null;

    return {
      id: series.id,
      title: series.title,
      titleZh: series.titleZh,
      description: series.description,
      descriptionZh: series.descriptionZh,
      position: currentIndex + 1,
      total: items.length,
      items,
      prev: currentIndex > 0 ? items[currentIndex - 1] : null,
      next: currentIndex < items.length - 1 ? items[currentIndex + 1] : null,
    };
  }
  return null;
}

export function getAllSeriesForIndex() {
  return ARTICLE_SERIES.map((series) => {
    const items = series.slugs
      .map((slug) => articleBySlug(slug))
      .filter(Boolean)
      .map((item) => ({
        slug: item.slug,
        href: getArticlePath(item),
        title: item.title,
        titleZh: item.titleZh || item.title,
      }));
    return {
      id: series.id,
      title: series.title,
      titleZh: series.titleZh,
      description: series.description,
      descriptionZh: series.descriptionZh,
      items,
      startHref: items[0]?.href || '/articles',
    };
  }).filter((series) => series.items.length > 0);
}
