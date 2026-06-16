export const articles = [
  {
    slug: 'app-store-price-check-before-buying',
    title: 'How to Check App Store Prices Before Buying',
    titleZh: '购买前如何检查 App Store 价格',
    description: 'A practical checklist for comparing App Store prices across regions without mistaking converted prices for final checkout costs.',
    descriptionZh: '一份实用清单，帮助你比较不同地区的 App Store 价格，并避免把简单换算价格误认为最终付款成本。',
    category: 'Purchasing',
    tags: ['App Store', 'Pricing', 'Subscriptions'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '5 min read',
    sections: [
      { heading: 'Start with the official price', headingZh: '从官方价格开始', text: 'Use Wolffy as a research helper, but always treat the App Store checkout screen as the final source. Regional price tables can show useful differences, yet taxes, account region, payment method, trials, and subscription terms may change the final amount.', textZh: '可以把 Wolffy 当作研究辅助工具，但最终价格应以 App Store 结算页面为准。跨区价格表能显示有价值的差异，但税费、账户地区、付款方式、试用和订阅条款都可能改变最终金额。' },
      { heading: 'Compare the same product', headingZh: '确认比较的是同一个产品', text: 'Make sure you are comparing the same app, same developer, same subscription tier, and same billing period. Some apps have regional versions or different bundles, so a lower price may not represent the exact same product.', textZh: '比较时要确认应用、开发者、订阅档位和计费周期都一致。有些应用存在地区版本或不同套装，因此更低价格不一定代表完全相同的产品。' },
      { heading: 'Watch subscription terms', headingZh: '特别注意订阅条款', text: 'A monthly plan can look cheaper than an annual plan during the first month, while annual plans can hide renewal surprises. Check trial length, renewal date, cancellation path, family sharing support, and whether the offer is for new users only.', textZh: '月付方案在首月看起来可能更便宜，年付方案也可能隐藏续费惊喜。请检查试用时长、续费日期、取消路径、家庭共享支持，以及优惠是否仅限新用户。' },
      { heading: 'Keep evidence before paying', headingZh: '付款前保留证据', text: 'For expensive apps or long subscriptions, save screenshots of the App Store page, trial terms, and checkout screen. If you later need support or a refund request, exact dates and visible terms are easier to explain.', textZh: '对于高价应用或长期订阅，建议保存 App Store 页面、试用条款和结算页面截图。如果之后需要客服支持或申请退款，准确日期和可见条款更容易说明情况。' },
    ],
  },
  {
    slug: 'understand-in-app-purchases',
    title: 'Understanding In-App Purchases Before Installing',
    titleZh: '安装前理解应用内购买',
    description: 'How to interpret IAP signals, subscriptions, trials, consumables, and paywall behavior before committing to an app.',
    descriptionZh: '在安装应用前，了解内购标记、订阅、试用、消耗型项目和付费墙行为。',
    category: 'Safety',
    tags: ['IAP', 'Subscriptions', 'Paywalls'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '6 min read',
    sections: [
      { heading: 'Not all free apps are free to use', headingZh: '免费下载不等于免费使用', text: 'Many apps are free to download but require payment for core features. Before installing, look for in-app purchase markers, subscription language, trial prompts, and user reviews mentioning paywalls.', textZh: '很多应用可以免费下载，但核心功能需要付费。安装前应查看内购标记、订阅措辞、试用提示，以及用户评论中是否提到付费墙。' },
      { heading: 'Know the purchase type', headingZh: '理解购买类型', text: 'Consumables, one-time unlocks, auto-renewing subscriptions, and trials behave differently. A consumable may disappear after use, while a subscription renews until canceled. This difference matters more than the initial download price.', textZh: '消耗型项目、一次性解锁、自动续订订阅和试用的规则不同。消耗型项目用完可能消失，订阅则会持续续费直到取消。这比初始下载价格更重要。' },
      { heading: 'Pay attention to first-run screens', headingZh: '注意首次启动页面', text: 'If an app shows a trial or annual subscription before meaningful functionality, slow down. Look for a close button, read the period and renewal terms, and confirm cancellation steps in Apple account settings.', textZh: '如果应用在展示实际功能前先弹出试用或年费订阅，请放慢操作。寻找关闭按钮，阅读周期和续费条款，并确认在 Apple 账户设置中如何取消。' },
      { heading: 'Use risk signals together', headingZh: '组合判断风险信号', text: 'IAP alone is not bad. The risk increases when aggressive paywalls combine with unclear developers, vague descriptions, poor support links, excessive permissions, or external payment requests.', textZh: '内购本身并不等于风险。真正需要警惕的是强势付费墙与不清晰开发者、模糊描述、无效支持链接、过度权限或外部付款请求同时出现。' },
    ],
  },
  {
    slug: 'privacy-labels-and-permissions',
    title: 'Reading App Privacy Labels and Permissions',
    titleZh: '如何阅读应用隐私标签和权限',
    description: 'A plain-language guide to reviewing privacy labels, permission prompts, developer claims, and practical warning signs.',
    descriptionZh: '用通俗方式理解隐私标签、权限弹窗、开发者声明和常见风险信号。',
    category: 'Privacy',
    tags: ['Privacy', 'Permissions', 'Safety'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '7 min read',
    sections: [
      { heading: 'Privacy labels are a starting point', headingZh: '隐私标签只是起点', text: 'App privacy labels summarize developer disclosures, but they are not a full audit. Treat them as a map of what to inspect next: identifiers, usage data, location, contacts, diagnostics, and whether data may be linked to you.', textZh: 'App 隐私标签是开发者披露信息的摘要，但不是完整审计。你可以把它当作下一步检查地图：标识符、使用数据、位置、联系人、诊断信息，以及数据是否会与你关联。' },
      { heading: 'Match permissions to purpose', headingZh: '权限应匹配功能目的', text: 'A camera app needs camera access; a calculator usually does not need contacts or precise location. Permission requests should match the feature you are using at that moment, not appear as a blanket demand on first launch.', textZh: '相机应用需要相机权限，计算器通常不需要通讯录或精确位置。权限请求应与当前正在使用的功能匹配，而不是首次启动就一次性索要全部权限。' },
      { heading: 'Review linked data', headingZh: '重点查看关联到你的数据', text: 'Data linked to you can be more sensitive than anonymous diagnostics. If an app collects identifiers, purchase history, location, or contact info, check whether the feature genuinely requires that data.', textZh: '与个人关联的数据通常比匿名诊断更敏感。如果应用收集标识符、购买历史、位置或联系人信息，请判断该功能是否真的需要这些数据。' },
      { heading: 'Revisit settings later', headingZh: '安装后也要回看设置', text: 'Permissions can be changed after installation. Review iOS Settings for location, photos, microphone, camera, tracking, notifications, and background refresh after you understand what the app actually does.', textZh: '权限可以在安装后调整。了解应用真实用途后，建议回到 iOS 设置中检查位置、照片、麦克风、相机、跟踪、通知和后台刷新。' },
    ],
  },
  {
    slug: 'safe-region-switching',
    title: 'What to Check Before Switching App Store Regions',
    titleZh: '切换 App Store 地区前要检查什么',
    description: 'A cautious guide to account region changes, subscriptions, store credit, availability, billing addresses, and family sharing.',
    descriptionZh: '关于账号地区、订阅、余额、可用性、账单地址和家庭共享的谨慎检查指南。',
    category: 'Account',
    tags: ['Region', 'Apple ID', 'Billing'],
    publishedAt: '2026-06-16',
    updatedAt: '2026-06-16',
    readTime: '6 min read',
    sections: [
      { heading: 'Region changes affect more than prices', headingZh: '地区变化影响的不只是价格', text: 'Changing an App Store region can affect app availability, payment methods, subscriptions, family sharing, store credit, and previously downloaded apps. Do not treat it as a simple currency switch.', textZh: '切换 App Store 地区会影响应用可用性、付款方式、订阅、家庭共享、账户余额和已下载应用。不要把它当成简单的货币切换。' },
      { heading: 'Check active commitments first', headingZh: '先检查正在进行的项目', text: 'Before switching, review active subscriptions, pending refunds, pre-orders, rentals, family sharing status, and remaining Apple Account balance. Some items may block or complicate a region change.', textZh: '切换前请查看有效订阅、待处理退款、预购、租赁、家庭共享状态和 Apple 账户余额。某些项目可能阻止或复杂化地区切换。' },
      { heading: 'Use valid billing information', headingZh: '使用有效账单信息', text: 'Apple may require a payment method and billing address appropriate for the target region. Generated addresses should never be used for identity, billing, delivery, fraud, or platform verification.', textZh: 'Apple 可能要求目标地区适用的付款方式和账单地址。生成地址不应被用于身份、账单、配送、欺诈或平台验证用途。' },
      { heading: 'Document important state', headingZh: '记录关键状态', text: 'Take screenshots of subscriptions, purchases, and account settings before major account changes. If something becomes unavailable later, the record helps you understand what changed.', textZh: '在进行重要账号变更前，建议截图保存订阅、购买记录和账户设置。如果之后某些内容不可用，这些记录能帮助你理解发生了什么。' },
    ],
  },
];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlePath(article) {
  return `/articles/${article.slug}`;
}
