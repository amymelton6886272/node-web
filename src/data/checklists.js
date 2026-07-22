export const checklistContent = {
  en: {
    page: {
      heroTitle: 'App Store Decision Checklists',
      heroSub: 'Practical checklists for paid apps, subscriptions, privacy, and region switching before you act.',
      title: 'Why checklists add value beyond tool results',
      intro: 'Many App Store risks cannot be found with a single search. Subscription terms, privacy permissions, region limits, and support conditions are spread across multiple pages. These checklists collect the steps users should verify before paying, installing, or switching regions.',
      items: [
        { heading: 'Help users make decisions', text: 'Tools provide data, while checklists provide a decision path. Users can verify price, subscriptions, permissions, and regional constraints step by step instead of relying on one result.' },
        { heading: 'Useful even without a query', text: 'The page remains helpful before any keyword is entered and does not depend on a third-party API response, reducing the chance of becoming an empty or low-value screen.' },
        { heading: 'Easy to expand later', text: 'The checklist format can later support PDF export, saved progress, or device-specific filters while remaining lightweight and readable today.' },
      ],
      linksLabel: 'Related reading',
      links: [
        { href: '/price', label: 'Price Compare' },
        { href: '/iap', label: 'IAP Lookup' },
        { href: '/appfree', label: 'Free Apps' },
        { href: '/price', label: 'Price Compare' },
        { href: '/privacy', label: 'Privacy Policy' },
      ],
      toolbarTitle: 'Choose a scenario',
      toolbarText: 'Filter checklists by your current task. Checked items stay only in the current page state and are not uploaded.',
      minutes: 'min',
      completed: 'completed',
      pitfalls: 'Common pitfalls',
      reset: 'Reset',
    },
    categories: [
      { id: 'all', label: 'All' },
      { id: 'purchase', label: 'Purchase' },
      { id: 'subscription', label: 'Subscription' },
      { id: 'privacy', label: 'Privacy' },
      { id: 'region', label: 'Region' },
    ],
    checklists: [
      {
        id: 'before-paid-app', icon: 'DollarSign', category: 'purchase', minutes: 5,
        title: 'Before buying a paid app', summary: 'Confirm price, region, in-app purchases, maintenance, and refund risk before paying.',
        items: ['Confirm App Store price, currency, and the storefront region of the signed-in Apple ID.', 'Check whether the app contains in-app purchases or subscriptions, especially auto-renewing trials.', 'Review the latest update date; apps that have not been maintained may have compatibility risks.', 'Read low-rating reviews and look for crashes, account bans, refund problems, or support issues.', 'Confirm Family Sharing, device compatibility, language support, and privacy labels.', 'For expensive apps, search the developer site or announcements to see whether discounts are cyclical.'],
        pitfalls: ['Looking only at the average rating can hide recent version problems.', 'Cross-region purchases can affect updates, payment methods, and support.', 'A subscription app may not include core features in the app’s base price.'],
        related: ['price', 'iap', 'guides']
      },
      {
        id: 'subscription-safety', icon: 'Shield', category: 'subscription', minutes: 4,
        title: 'Subscription and free-trial safety', summary: 'Identify auto-renewal, trial dates, cancellation paths, and family-device purchase controls.',
        items: ['Confirm the trial end date and set a reminder one day earlier.', 'Check whether billing is weekly, monthly, yearly, or a one-time unlock.', 'Open iOS Settings > Apple ID > Subscriptions and confirm the subscription can be managed or cancelled.', 'Save screenshots of the price page, trial wording, and developer promises.', 'Enable Ask to Buy or Screen Time restrictions on family devices.', 'If unsure, test with monthly billing first instead of committing to an annual plan.'],
        pitfalls: ['Deleting the app does not cancel the subscription.', 'Some trials must be cancelled at least 24 hours before renewal.', 'Prices shown in ads may differ from the App Store checkout page.'],
        related: ['iap', 'price', 'privacy']
      },
      {
        id: 'privacy-review', icon: 'Lock', category: 'privacy', minutes: 6,
        title: 'Privacy review before installing a new app', summary: 'Judge trust from permissions, accounts, data collection, and network environment.',
        items: ['Review App Store privacy labels, especially location, contacts, photos, and tracking data.', 'Grant only permissions needed for core features during first launch.', 'Avoid using your primary email for unfamiliar apps; use Hide My Email or an alias if possible.', 'Check that the developer website, privacy policy, and support channel are reachable.', 'Avoid signing into sensitive accounts over untrusted public Wi‑Fi.', 'After use, revisit Settings to disable unnecessary permissions, background refresh, and notifications.'],
        pitfalls: ['Free apps may monetize through data collection or ad tracking.', 'Similar names and icons can be used to mislead downloads.', 'Configuration profiles, certificates, and VPN permissions require extra caution.'],
        related: ['icon', 'ip', 'privacy']
      },
      {
        id: 'region-switch', icon: 'Globe', category: 'region', minutes: 7,
        title: 'Before switching App Store region', summary: 'Check balance, subscriptions, payment methods, availability, and long-term maintenance cost.',
        items: ['Confirm Apple ID balance is cleared; remaining balance can block region switching.', 'Cancel or resolve active subscriptions, preorders, and rentals.', 'Confirm supported payment methods and billing-address requirements for the target region.', 'Record whether key apps are available in the target storefront.', 'Back up important data, especially apps relying on iCloud or local authorization.', 'Evaluate whether switching back later may affect purchased items and updates.'],
        pitfalls: ['Some apps may not be downloadable or updateable after region changes.', 'Region changes can affect Family Sharing, gift cards, and subscription prices.', 'Do not frequently switch your main account region just to download one app.'],
        related: ['price', 'appfree', 'guides']
      },
      {
        id: 'subscription-cost-review', icon: 'DollarSign', category: 'subscription', minutes: 6,
        title: 'Monthly subscription cost review', summary: 'Annualize every plan, cut low-value renewals, and keep a cancel path for each active trial.',
        items: ['List every active subscription with price and billing cycle.', 'Convert weekly and monthly plans into yearly cost before comparing value.', 'Mark which plans are used weekly, monthly, or almost never.', 'Cancel unused trials and set calendar reminders one day before renewal.', 'Check Family Sharing or shared payment ownership for each charge.', 'Export or screenshot the list after cleanup for next month’s review.'],
        pitfalls: ['Comparing weekly prices to yearly unlocks without annualization.', 'Deleting an app instead of cancelling the subscription.', 'Ignoring tax and storefront differences when estimating spend.'],
        related: ['subcost', 'price', 'guides']
      },
      {
        id: 'profile-certificate-safety', icon: 'Shield', category: 'privacy', minutes: 5,
        title: 'Before installing a VPN, profile, or certificate', summary: 'Separate App Store VPN apps from configuration profiles and root certificates, and refuse vague install paths.',
        items: ['Confirm the source is an organization you already trust for device management.', 'Prefer App Store apps with clear policies over profile-based “unlock” websites.', 'Refuse certificates you cannot explain or reverse.', 'Check whether basic features truly require a profile install.', 'After any mistaken install, remove unknown profiles/certificates in Settings immediately.', 'Re-check Screen Time and purchase controls if the device is shared.'],
        pitfalls: ['Treating profiles and certificates as normal app permissions.', 'Installing tools for vague battery, streaming, or free-premium promises.', 'Leaving unknown trust settings after testing a network tool.'],
        related: ['risk', 'knowledge', 'guides']
      }
    ]
  },
  zh: {
    page: {
      heroTitle: 'App Store 决策清单',
      heroSub: '购买、订阅、隐私和跨区操作前的实用检查表，帮助你把风险确认清楚再行动。',
      title: '为什么清单比单纯工具结果更有价值？',
      intro: '很多 App Store 风险不是搜索一次就能发现的：订阅条款、隐私权限、跨区限制和售后条件往往分散在不同页面。清单把购买前、安装前和切换地区前需要核对的步骤集中起来，适合在购买前反复对照使用。',
      items: [
        { heading: '帮助用户做决策', text: '工具页提供数据，清单页提供判断路径。用户可以按步骤确认价格、订阅、权限和地区限制，避免只看一个结果就做决定。' },
        { heading: '覆盖无搜索场景', text: '即使用户没有输入关键词，清单页也能提供完整内容，不依赖第三方接口返回结果，因此更不容易被视为空页面或低价值聚合页。' },
        { heading: '适合后续扩展', text: '后续可以把清单扩展成下载 PDF、保存进度或按设备类型筛选，但当前版本保持轻量，先满足内容价值和实用性。' },
      ],
      linksLabel: '相关阅读',
      links: [
        { href: '/price', label: '价格对比' },
        { href: '/iap', label: '内购查询' },
        { href: '/appfree', label: '限免应用' },
        { href: '/price', label: '价格对比' },
        { href: '/privacy', label: '隐私政策' },
      ],
      toolbarTitle: '选择检查场景', toolbarText: '按你的当前任务筛选清单。勾选状态只保存在当前页面，不会上传服务器。', minutes: '分钟', completed: '已完成', pitfalls: '常见误区', reset: '重置'
    },
    categories: [
      { id: 'all', label: '全部' }, { id: 'purchase', label: '购买' }, { id: 'subscription', label: '订阅' }, { id: 'privacy', label: '隐私' }, { id: 'region', label: '地区' }
    ],
    checklists: [
      { id: 'before-paid-app', icon: 'DollarSign', category: 'purchase', minutes: 5, title: '购买付费 App 前检查清单', summary: '帮助你在付款前快速确认价格、地区、内购、更新维护和退款风险。', items: ['确认 App Store 价格、币种和当前登录的商店地区。','查看是否存在内购或订阅，尤其是免费试用后的自动续费。','检查最近一次更新时间；长期未更新的应用可能存在兼容性风险。','阅读低分评论，重点关注崩溃、账号封禁、退款和客服问题。','确认家庭共享、设备兼容性、语言支持和隐私标签。','如果价格较高，先搜索官网或开发者公告确认是否有折扣周期。'], pitfalls: ['只看星级不看最近评论，容易忽略新版故障。','跨区购买可能影响更新、支付方式和售后支持。','订阅型应用的核心功能可能不包含在应用本体价格中。'], related: ['price','iap','guides'] },
      { id: 'subscription-safety', icon: 'Shield', category: 'subscription', minutes: 4, title: '订阅与免费试用避坑清单', summary: '识别自动续费、试用期、取消路径和家庭设备购买限制。', items: ['确认试用期结束日期，并在日历中提前一天设置提醒。','查看订阅周期是周、月、年还是一次性解锁。','进入 iOS 设置 > Apple ID > 订阅，确认可以管理或取消。','截图保存价格页面、试用说明和开发者承诺。','家庭设备开启“购买前询问”或屏幕使用时间限制。','不确定是否需要时，优先选择月付测试，不要直接年付。'], pitfalls: ['删除 App 不等于取消订阅。','部分试用需要在到期前至少 24 小时取消。','第三方广告页展示的价格可能与 App Store 结算页不同。'], related: ['iap','price','privacy'] },
      { id: 'privacy-review', icon: 'Lock', category: 'privacy', minutes: 6, title: '安装新 App 前隐私检查清单', summary: '从权限、账号、数据收集和网络环境四个角度判断应用是否值得信任。', items: ['查看 App Store 隐私标签，关注位置、通讯录、照片和追踪数据。','首次启动时只授权必要权限，拒绝与核心功能无关的权限。','不要用主邮箱注册不熟悉的应用，可使用 Hide My Email 或别名邮箱。','检查开发者官网、隐私政策和客服渠道是否真实可访问。','避免在公共 Wi‑Fi 下登录新应用中的敏感账号。','使用后在设置中复查权限，关闭后台刷新和不必要通知。'], pitfalls: ['“免费”应用可能依赖数据收集或广告追踪变现。','相似名称和相似图标可能用于误导下载。','配置描述文件、证书和 VPN 权限要格外谨慎。'], related: ['icon','ip','privacy'] },
      { id: 'region-switch', icon: 'Globe', category: 'region', minutes: 7, title: '切换 App Store 地区前检查清单', summary: '在切换地区前确认余额、订阅、支付方式、可下载性和后续维护成本。', items: ['确认 Apple ID 余额是否清零，未用完余额可能阻止切换地区。','取消或处理仍在生效的订阅、预购和租赁项目。','确认目标地区可用的支付方式和账单地址要求。','提前记录关键 App 是否在目标地区上架。','备份重要数据，尤其是依赖 iCloud 或本地授权的 App。','评估切回原地区是否会影响已购买项目和更新。'], pitfalls: ['部分 App 跨区后无法重新下载或更新。','地区切换可能影响家庭共享、礼品卡和订阅价格。','不要为了短期下载频繁切换主账号地区。'], related: ['price','appfree','guides'] },
      { id: 'subscription-cost-review', icon: 'DollarSign', category: 'subscription', minutes: 6, title: '每月订阅成本复审清单', summary: '把每个方案年化，砍掉低价值续费，并为每个生效试用保留取消路径。', items: ['列出全部生效订阅及其价格与计费周期。','比较价值前，先把周付和月付换算成年成本。','标记每周用、每月用或几乎不用的方案。','取消不用的试用，并在续费前一天设置日历提醒。','检查每笔扣费的家庭共享或共用付款归属。','清理后导出或截图列表，供下月复审。'], pitfalls: ['不经年化就拿周价格和年付解锁比较。','删除应用却没有取消订阅。','估算支出时忽略税费和商店地区差异。'], related: ['subcost','price','guides'] },
      { id: 'profile-certificate-safety', icon: 'Shield', category: 'privacy', minutes: 5, title: '安装 VPN、描述文件或证书前检查清单', summary: '把 App Store VPN 与配置描述文件、根证书分开看待，拒绝含糊安装路径。', items: ['确认来源是你已信任的设备管理组织。','优先选择政策清楚的 App Store 应用，而不是靠描述文件“解锁”的网站。','拒绝自己解释不清或无法回滚的证书。','检查基础功能是否真的需要安装描述文件。','如有误装，立刻在设置中删除未知描述文件/证书。','若设备共用，复查屏幕使用时间和购买控制。'], pitfalls: ['把描述文件和证书当成普通应用权限。','为含糊的耗电、串流或免费高级功能承诺而安装。','测试网络工具后仍留下未知信任设置。'], related: ['risk','knowledge','guides'] }
    ]
  }
};

export const checklists = checklistContent.zh.checklists;
export const checklistCategories = checklistContent.zh.categories;
