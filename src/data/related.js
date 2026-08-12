import { articles, getArticlePath } from './articles.js';

/** Lightweight keyword maps so related links stay useful without a full search index. */
const TOPIC_TOOLS = {
  purchase: [
    { href: '/articles/app-store-price-check-before-buying', label: 'Price check guide', labelZh: '价格核对指南' },
    { href: '/articles/when-paid-app-beats-subscription', label: 'Paid vs subscription', labelZh: '买断 vs 订阅' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  subscription: [
    { href: '/articles/manage-apple-subscriptions-after-trial', label: 'After-trial management', labelZh: '试用后管理' },
    { href: '/articles/free-trial-trap-checklist', label: 'Trial trap checklist', labelZh: '试用陷阱清单' },
    { href: '/articles/spot-subscription-fatigue-apps', label: 'Subscription fatigue', labelZh: '订阅疲劳' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  privacy: [
    { href: '/articles/privacy-labels-and-permissions', label: 'Privacy labels guide', labelZh: '隐私标签指南' },
    { href: '/articles/ios-permission-prompts-decision-guide', label: 'Permission prompts', labelZh: '权限弹窗指南' },
    { href: '/articles/hide-my-email-and-app-signups', label: 'Hide My Email', labelZh: '隐藏邮件' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  family: [
    { href: '/articles/family-sharing-purchase-safety', label: 'Family purchase safety', labelZh: '家庭购买安全' },
    { href: '/articles/screen-time-purchase-controls', label: 'Screen Time controls', labelZh: '屏幕使用时间控制' },
    { href: '/articles/child-device-app-install-rules', label: 'Child install rules', labelZh: '儿童安装规则' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
  ],
  security: [
    { href: '/articles/ios-vpn-profile-and-certificate-risks', label: 'VPN & profile risks', labelZh: 'VPN 与描述文件风险' },
    { href: '/articles/spot-low-quality-app-store-listings', label: 'Low-quality listings', labelZh: '低质上架识别' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
  ],
  region: [
    { href: '/articles/safe-region-switching', label: 'Safe region switching', labelZh: '安全切区' },
    { href: '/articles/compare-app-store-regions-safely', label: 'Compare regions', labelZh: '比较地区' },
    { href: '/articles/app-store-gift-cards-and-balance-safety', label: 'Gift card safety', labelZh: '礼品卡安全' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
  ],
  support: [
    { href: '/articles/app-store-refund-request-checklist', label: 'Refund checklist', labelZh: '退款清单' },
    { href: '/articles/when-to-use-report-a-problem', label: 'Report a Problem', labelZh: 'Report a Problem' },
    { href: '/articles', label: 'All articles', labelZh: '全部文章' },
  ],
  default: [
    { href: '/articles/app-store-research-workflow', label: 'Research workflow', labelZh: '研究流程' },
    { href: '/articles/understand-in-app-purchases', label: 'IAP guide', labelZh: '内购指南' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    { href: '/articles/family-sharing-purchase-safety', label: 'Family safety', labelZh: '家庭安全' },
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
  const series = getArticleSeries(article);
  const seriesSlugs = new Set((series?.items || []).map((item) => item.slug));

  const scored = articles
    .filter((item) => item.slug !== article.slug)
    .map((item) => {
      let score = 0;
      if (seriesSlugs.has(item.slug)) score += 8;
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
    { href: '/series', label: 'Reading series', labelZh: '阅读系列' },
    { href: '/guides', label: 'Guides', labelZh: '指南' },
    { href: '/knowledge', label: 'Knowledge base', labelZh: '知识库' },
    { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    { href: '/glossary', label: 'Glossary', labelZh: '术语表' },
    { href: '/editorial', label: 'Editorial policy', labelZh: '编辑政策' },
    { href: '/about', label: 'About', labelZh: '关于' },
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
    audience: 'Anyone starting a free trial, stacking subscriptions, or needing refund evidence.',
    audienceZh: '准备开试用、订阅堆叠，或需要退款证据的人。',
    whenToUse: 'Before you tap Start Trial, after a quiet renewal, or when a charge looks wrong.',
    whenToUseZh: '点“开始试用”前、静默续费后，或扣费看起来不对时。',
    exitCriteria: [
      'Trial end date and cancel path written down',
      'Subscriptions list screenshot saved',
      'Refund evidence packet ready only if needed',
    ],
    exitCriteriaZh: [
      '已记下试用结束日与取消路径',
      '已保存订阅列表截图',
      '仅在需要时准备好退款证据包',
    ],
    relatedTools: [
      { href: '/articles/manage-apple-subscriptions-after-trial', label: 'After-trial management', labelZh: '试用后管理' },
      { href: '/articles/app-subscription-cancel-from-web', label: 'Cancel from web', labelZh: '从网页取消' },
      { href: '/articles/free-trial-trap-checklist', label: 'Trial trap checklist', labelZh: '试用陷阱清单' },
      { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    ],
    slugs: [
      'free-trial-trap-checklist',
      'free-trial-to-paid-conversion-defense-playbook',
      'manage-apple-subscriptions-after-trial',
      'cancel-apple-subscription-step-by-step',
      'app-subscription-cancel-from-web',
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
    audience: 'People comparing storefronts, gift cards, or multi-region Apple ID workflows.',
    audienceZh: '需要对比商店、礼品卡，或多区 Apple ID 流程的人。',
    whenToUse: 'Before switching region, buying a gift card for another storefront, or opening a second Apple ID.',
    whenToUseZh: '切区前、为其他商店买礼品卡前，或新开第二个 Apple ID 前。',
    exitCriteria: [
      'Payment method and balance risks listed',
      'Official region-change screens captured',
      'Fallback plan if the switch fails mid-way',
    ],
    exitCriteriaZh: [
      '已列出支付方式与余额风险',
      '已截取官方切区界面',
      '中途失败有回退方案',
    ],
    relatedTools: [
      { href: '/price', label: 'Price compare', labelZh: '价格对比' },
      { href: '/guides', label: 'Guides', labelZh: '指南' },
      { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    ],
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
    audience: 'Users who want fewer tracking prompts and cleaner app signups.',
    audienceZh: '想减少跟踪提示、保持注册卫生的用户。',
    whenToUse: 'Before first launch, during permission prompts, or when reviewing an installed app.',
    whenToUseZh: '首次启动前、权限弹窗时，或复盘已装应用时。',
    exitCriteria: [
      'Privacy label notes captured',
      'Default refuse list for high-risk prompts',
      'Signup email strategy chosen (Hide My Email or dedicated alias)',
    ],
    exitCriteriaZh: [
      '已记录隐私标签要点',
      '高风险权限有默认拒绝清单',
      '注册邮箱策略已定（隐藏邮件或专用别名）',
    ],
    relatedTools: [
      { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
      { href: '/knowledge', label: 'Knowledge base', labelZh: '知识库' },
      { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    ],
    slugs: [
      'privacy-labels-and-permissions',
      'ios-tracking-transparency-opt-out-guide',
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
    audience: 'Parents, organizers, or anyone sharing a payment method in Family Sharing.',
    audienceZh: '家长、家庭组织者，或共用付款方式的人。',
    whenToUse: 'Before adding a child device, after a surprise charge, or when setting household rules.',
    whenToUseZh: '添加儿童设备前、出现意外扣费后，或制定家庭规则时。',
    exitCriteria: [
      'Ask to Buy / Screen Time purchase locks verified',
      'Shared-payment ownership written down',
      'Dispute path agreed before the next charge',
    ],
    exitCriteriaZh: [
      '已核验购买前询问 / 屏幕使用时间购买限制',
      '共用支付归属已写明',
      '下次扣费前已约定争议路径',
    ],
    relatedTools: [
      { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
      { href: '/risk', label: 'App risk assessor', labelZh: '风险评估' },
      { href: '/guides', label: 'Guides', labelZh: '指南' },
    ],
    slugs: [
      'family-sharing-purchase-safety',
      'app-store-age-ratings-and-parental-controls',
      'case-study-family-sharing-charge-dispute-resolved',
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
    audience: 'Anyone installing free apps, VPN clients, TestFlight builds, or configuration profiles.',
    audienceZh: '安装免费应用、VPN、TestFlight 构建或配置描述文件的人。',
    whenToUse: 'Before installing a free app, accepting a profile, or following sideload instructions.',
    whenToUseZh: '安装免费应用、接受配置描述文件，或跟随旁加载说明前。',
    exitCriteria: [
      'Listing red flags reviewed',
      'Profile / certificate install refused by default',
      'Only official install paths remain',
    ],
    exitCriteriaZh: [
      '已检查上架红旗',
      '配置描述文件 / 证书默认拒绝安装',
      '只保留官方安装路径',
    ],
    relatedTools: [
      { href: '/articles/spot-low-quality-app-store-listings', label: 'Low-quality listings guide', labelZh: '低质上架指南' },
      { href: '/articles/app-store-scam-pattern-recognition', label: 'Scam pattern recognition', labelZh: '诈骗模式识别' },
      { href: '/guides', label: 'Guides', labelZh: '指南' },
    ],
    slugs: [
      'spot-low-quality-app-store-listings',
      'app-store-scam-pattern-recognition',
      'when-not-to-install-free-apps',
      'app-store-search-ads-and-fake-popular-apps',
      'ios-vpn-profile-and-certificate-risks',
      'ios-configuration-profile-vpn-certificate-danger-guide',
      'testflight-sideload-and-unofficial-install-risks',
      'apple-id-security-checklist',
      'eu-dma-third-party-app-stores-safety-implications',
      'used-iphone-apple-id-purchase-history-check-before-buying',
      'cross-device-purchase-sync-ipad-mac-appletv-risks',
    ],
  },
  {
    id: 'purchase-research',
    title: 'Before-you-pay research',
    titleZh: '付款前研究流程',
    description: 'Compare prices, IAP, paid vs subscription, and a full research workflow.',
    descriptionZh: '价格对比、内购、买断 vs 订阅，以及完整研究流程。',
    audience: 'Buyers who want a short research loop before paid apps or subscriptions.',
    audienceZh: '付款前想先走完短研究流程的购买者。',
    whenToUse: 'Before checkout, when choosing paid vs subscription, or auditing purchase history.',
    whenToUseZh: '结算前、在买断与订阅之间选择时，或审计购买记录时。',
    exitCriteria: [
      'Price and IAP notes captured',
      'Paid vs subscription decision written',
      'Official checkout screen confirmed last',
    ],
    exitCriteriaZh: [
      '已记录价格与内购要点',
      '买断 vs 订阅决策已写下',
      '最后以官方结算页确认',
    ],
    relatedTools: [
      { href: '/articles/app-store-price-check-before-buying', label: 'Price check guide', labelZh: '价格核对指南' },
      { href: '/articles/manage-apple-subscriptions-after-trial', label: 'Sub management', labelZh: '订阅管理' },
      { href: '/articles/understand-in-app-purchases', label: 'IAP guide', labelZh: '内购指南' },
      { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    ],
    slugs: [
      'app-store-research-workflow',
      'app-store-price-check-before-buying',
      'understand-in-app-purchases',
      'spot-subscription-fatigue-apps',
      'when-paid-app-beats-subscription',
      'apple-id-purchase-history-audit',
    ],
  },
  {
    id: 'disputes-and-escalation',
    title: 'Disputes & escalation',
    titleZh: '争议与申诉升级',
    description: 'Chargebacks, Apple refund appeals, support escalation, and consumer rights paths.',
    descriptionZh: '银行拒付、Apple 退款申诉、客服升级与消费者权益路径。',
    audience: 'Users whose refunds have been denied or who are considering a chargeback.',
    audienceZh: '退款被拒或考虑拒付的用户。',
    whenToUse: 'When automated refunds fail and you need to escalate or choose between chargeback and refund.',
    whenToUseZh: '当自动退款失败且需要升级或在拒付与退款之间选择时。',
    exitCriteria: ['Clear decision on refund vs chargeback', 'Documented escalation path', 'Evidence package assembled'],
    exitCriteriaZh: ['对退款或拒付有明确决策', '有据可查的升级路径', '证据包已组装'],
    relatedTools: [
      { href: '/articles/app-store-refund-request-checklist', label: 'Refund checklist', labelZh: '退款清单' },
      { href: '/articles/when-to-use-report-a-problem', label: 'Report a Problem', labelZh: 'Report a Problem' },
      { href: '/checklists', label: 'Decision checklists', labelZh: '决策清单' },
    ],
    slugs: [
      'apple-support-escalation-when-appeal-fails',
      'chargeback-vs-apple-refund-which-to-choose',
      'app-store-bank-dispute-chargeback-consequences',
      'case-study-refund-denied-then-approved-on-appeal',
      'google-play-vs-app-store-refund-protection-compared',
      'switching-from-android-to-ios-purchase-history-migration',
      'app-store-refund-request-checklist',
      'when-to-use-report-a-problem',
      'report-a-problem-refund-evidence-and-timing',
    ],
    when: 'When a refund is denied or you are considering a chargeback',
    whenZh: '当退款被拒或考虑拒付时',
  },
];

function articleBySlug(slug) {
  return articles.find((item) => item.slug === slug) || null;
}

export function getSeriesPath(seriesOrId) {
  const id = typeof seriesOrId === 'string' ? seriesOrId : seriesOrId?.id;
  return id ? `/series/${id}` : '/articles';
}

function hydrateSeries(series) {
  const items = series.slugs
    .map((slug) => articleBySlug(slug))
    .filter(Boolean)
    .map((item, index) => ({
      slug: item.slug,
      href: getArticlePath(item),
      title: item.title,
      titleZh: item.titleZh || item.title,
      description: item.description,
      descriptionZh: item.descriptionZh || item.description,
      category: item.category,
      readTime: item.readTime,
      updatedAt: item.updatedAt || item.publishedAt,
      position: index + 1,
    }));

  const latestUpdated = items
    .map((item) => item.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;

  return {
    id: series.id,
    title: series.title,
    titleZh: series.titleZh,
    description: series.description,
    descriptionZh: series.descriptionZh,
    audience: series.audience || '',
    audienceZh: series.audienceZh || '',
    whenToUse: series.whenToUse || '',
    whenToUseZh: series.whenToUseZh || '',
    exitCriteria: series.exitCriteria || [],
    exitCriteriaZh: series.exitCriteriaZh || [],
    relatedTools: series.relatedTools || [],
    href: getSeriesPath(series),
    items,
    count: items.length,
    startHref: items[0]?.href || '/articles',
    latestUpdated,
  };
}

export function getArticleSeries(article) {
  if (!article?.slug) return null;
  for (const series of ARTICLE_SERIES) {
    const index = series.slugs.indexOf(article.slug);
    if (index === -1) continue;

    const hydrated = hydrateSeries(series);
    const currentIndex = hydrated.items.findIndex((item) => item.slug === article.slug);
    if (currentIndex === -1) return null;

    return {
      ...hydrated,
      position: currentIndex + 1,
      total: hydrated.items.length,
      prev: currentIndex > 0 ? hydrated.items[currentIndex - 1] : null,
      next: currentIndex < hydrated.items.length - 1 ? hydrated.items[currentIndex + 1] : null,
    };
  }
  return null;
}

export function getSeriesById(id) {
  const series = ARTICLE_SERIES.find((item) => item.id === id);
  if (!series) return null;
  const hydrated = hydrateSeries(series);
  return hydrated.items.length ? hydrated : null;
}

export function getAllSeriesForIndex() {
  return ARTICLE_SERIES.map(hydrateSeries).filter((series) => series.items.length > 0);
}
