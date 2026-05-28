export const knowledgeContent = {
  en: {
    page: {
      heroTitle: 'Apple Safety Knowledge Base',
      heroSub: 'Permissions, subscription refunds, App Store region differences, privacy scoring, and parental-control guides.',
      title: 'Apple / iOS safety knowledge base',
      intro: 'This hub collects durable guidance about permissions, subscriptions, refunds, region differences, and family-device safety. It is not a simple repost or link list; it turns common questions before installation, purchase, region switching, and family device management into readable and actionable articles.',
      items: [
        { heading: 'Adds context to tools', text: 'Price, IAP, risk, and checklist tools solve specific tasks, but users still need to understand the rules behind them. The knowledge base explains permissions, cancellation, refunds, and region limits.' },
        { heading: 'Valuable before searching', text: 'Every article has a summary, structured sections, full text, and actionable checklist items. The page does not depend on search results or API responses.' },
        { heading: 'Built for ongoing updates', text: 'Future topics can include App Store review policy, TestFlight, Family Sharing, privacy labels, and common billing cases.' },
      ],
      linksLabel: 'Related reading',
      links: [
        { href: '#risk', label: 'Risk Assessor' },
        { href: '#checklists', label: 'Checklists' },
        { href: '#iap', label: 'IAP Lookup' },
      ],
      chooseTitle: 'Choose a topic', chooseText: 'Keep these pages accessible before AdSense review. They are stable, readable publisher content.', toc: 'Sections', checklist: 'Action checklist', fallbackCategory: 'Guide'
    },
    categories: [
      { id: 'all', label: 'All' }, { id: 'privacy', label: 'Permissions' }, { id: 'billing', label: 'Subscriptions & refunds' }, { id: 'region', label: 'Regions' }, { id: 'family', label: 'Parental controls' }
    ],
    articles: [
      { id: 'permission-library', category: 'privacy', title: 'App permission library: which permissions deserve caution?', summary: 'Understand location, photos, camera, microphone, contacts, Bluetooth, notifications, VPN, and configuration-profile permissions.', readTime: '8 min', sections: [
        { heading: 'Location permission', text: 'Location permission can be limited to “while using” or expanded to “always allow.” Maps, weather, and ride-hailing apps often need location, but wallpaper, calculator, scanner, or filter apps requesting continuous location deserve caution. Prefer “while using” and disable precise location when possible.' },
        { heading: 'Photos and camera', text: 'iOS can grant access only to selected photos. Editing or scanning apps can often work with limited access instead of the entire library. Camera permission is usually necessary only for capture, scanning, and video calls.' },
        { heading: 'Microphone and speech recognition', text: 'Recording, meetings, and voice input require the microphone, but ordinary utilities requesting microphone access in the background should be reviewed. Speech recognition may involve audio processing, so read the privacy policy.' },
        { heading: 'Contacts and calendar', text: 'Contacts contain names, phone numbers, email addresses, and social relationships. Outside communication, CRM, or scheduling apps, a normal app should not request contacts by default.' },
        { heading: 'Bluetooth, local network, and tracking', text: 'Bluetooth and local-network permissions can discover nearby devices and may help identify environments. Tracking permission affects cross-app advertising attribution; deny it when not necessary.' },
        { heading: 'VPN, certificates, and profiles', text: 'VPN, root certificates, and device-management profiles are high-privilege settings that may affect traffic, certificate trust, or device policy. Install only from trusted developers and confirm the removal path.' }
      ], checklist: ['Grant only permissions needed for core functions.', 'Prefer “only once” or “while using” when available.', 'Review permissions in iOS Settings after installation.', 'Verify developer identity before granting high-privilege settings.'] },
      { id: 'refund-cancel-guide', category: 'billing', title: 'Subscription cancellation and Apple refund guide', summary: 'How to cancel subscriptions, request Apple refunds, save evidence, and understand why deleting an app is not enough.', readTime: '7 min', sections: [
        { heading: 'How to cancel a subscription', text: 'On iPhone, open Settings, tap your Apple ID name, open Subscriptions, select the app, and cancel. After cancellation, access usually remains until the current billing period ends. Deleting the app does not cancel the subscription.' },
        { heading: 'How to request a refund', text: 'Visit reportaproblem.apple.com, sign in with the Apple ID used for purchase, select the item, and submit a refund reason. Approval depends on purchase timing, usage, and Apple review.' },
        { heading: 'Evidence worth saving', text: 'Save screenshots of subscription prices, trial end dates, in-app promises, incorrect charges, support conversations, and App Store receipt emails.' },
        { heading: 'Free-trial risk', text: 'Many trials automatically become monthly or annual subscriptions. Some must be cancelled at least 24 hours before renewal. Set a reminder immediately after starting a trial.' },
        { heading: 'Prevent child-device charges', text: 'In Family Sharing, enable Ask to Buy and use Screen Time to restrict in-app purchases. Avoid saving unnecessary payment methods on children’s devices.' }
      ], checklist: ['Confirm subscription status in Settings.', 'Save screenshots of trial and price terms.', 'Set a cancellation reminder one day early.', 'Use Apple’s official refund page.'] },
      { id: 'store-region-knowledge', category: 'region', title: 'App Store region differences', summary: 'Learn how prices, taxes, gift cards, payment methods, availability, and region-switching limits differ.', readTime: '9 min', sections: [
        { heading: 'Why prices differ by region', text: 'Developers choose Apple price tiers, and each country or region can also involve taxes, exchange-rate changes, and local market strategy. The lowest converted price is not always the best purchase region.' },
        { heading: 'Payment method and billing address', text: 'Changing regions usually requires a payment method and billing address supported in the target region. Gift cards are typically region-bound and cannot be used across storefronts.' },
        { heading: 'Purchased items and updates', text: 'After switching regions, some apps may not be downloadable or updateable. Some developers release different versions for different storefronts.' },
        { heading: 'Subscription price changes', text: 'Region switching can affect subscription prices, renewal currency, and service availability. Resolve active subscriptions, preorders, and balance before switching.' },
        { heading: 'When not to switch', text: 'If your main account is tied to Family Sharing, important subscriptions, balance, long purchase history, or work devices, avoid switching regions just for one app.' }
      ], checklist: ['Clear or resolve Apple ID balance.', 'Check subscriptions and preorders.', 'Verify payment method requirements.', 'Record whether important apps remain available.'] },
      { id: 'privacy-score-guide', category: 'privacy', title: 'Privacy permission scoring: how to evaluate an app', summary: 'A simple method for judging whether an app collects too much data.', readTime: '6 min', sections: [
        { heading: 'Start with functional necessity', text: 'Ask whether a permission supports the core feature. Navigation needs location, scanning needs camera, budgeting usually does not need contacts, and wallpaper apps usually do not need precise location.' },
        { heading: 'Identify personal data', text: 'Contacts, precise location, photos, health data, purchase history, and browsing history can directly or indirectly identify a person. More collected data means more risk.' },
        { heading: 'Check tracking use', text: 'If the privacy label says data is used for third-party advertising, cross-app tracking, or data brokers, and that use is unrelated to the function, raise the risk level.' },
        { heading: 'Compare alternatives', text: 'If similar apps collect less data, have transparent pricing, and come from a more credible developer, choose the lower-privacy-burden option.' }
      ], checklist: ['List every permission requested by the app.', 'Mark permissions unrelated to the core feature.', 'Check whether privacy labels mention tracking.', 'Compare similar alternatives.'] },
      { id: 'family-safety-guide', category: 'family', title: 'Parental controls and children’s device safety', summary: 'Set purchase restrictions, content limits, Screen Time, and child privacy protections.', readTime: '7 min', sections: [
        { heading: 'Enable Ask to Buy', text: 'Family Sharing can require parental approval before children download paid apps, make in-app purchases, or start subscriptions. This helps prevent accidental charges.' },
        { heading: 'Restrict in-app purchases', text: 'In Screen Time, open Content & Privacy Restrictions and disable or limit in-app purchases. This matters especially for games, education, video, and chat apps.' },
        { heading: 'Set content ratings', text: 'Limit apps, web content, music, movies, and books by age rating. Do not judge child suitability from the app name alone.' },
        { heading: 'Protect children’s privacy', text: 'Children’s devices should limit location sharing, ad tracking, contact uploads, and public personal information. Chat and user-generated-content apps require extra review.' },
        { heading: 'Review regularly', text: 'Every month, review installed apps, subscriptions, Screen Time reports, and permission lists. Ease restrictions gradually as children mature.' }
      ], checklist: ['Enable Ask to Buy.', 'Disable or limit in-app purchases.', 'Set age-based content ratings.', 'Review subscriptions and permissions monthly.'] }
    ]
  }
};

knowledgeContent.zh = {
  page: {
    heroTitle: 'Apple 安全知识库', heroSub: '权限、订阅退款、App Store 地区差异、隐私评分和家长控制指南。', title: 'Apple / iOS 安全知识库', intro: '这里集中整理权限、订阅、退款、地区差异和家长控制等长期有效的内容。它不是简单转载或外链列表，而是把用户在安装、购买、切区和管理家庭设备时最常遇到的问题整理成可阅读、可执行的指南。',
    items: [{ heading: '补足工具页的上下文', text: '价格、内购、风险评估和清单工具能解决具体问题，但用户还需要理解背后的规则。知识库负责解释权限含义、订阅取消、退款路径和地区限制。' }, { heading: '提升默认页面内容价值', text: '所有文章在用户点击前就有摘要和结构化章节，展开后有完整正文和检查项，不依赖搜索结果或接口返回。' }, { heading: '适合持续更新', text: '后续可以继续加入 App Store 审核政策、TestFlight、家庭共享、隐私标签解读、常见扣费案例等专题。' }],
    linksLabel: '相关阅读', links: [{ href: '#risk', label: '风险评估器' }, { href: '#checklists', label: '决策清单' }, { href: '#iap', label: '内购查询' }], chooseTitle: '选择主题', chooseText: '建议复审前保持这些内容页面可访问。它们属于稳定、可阅读的发布商内容。', toc: '本文章节', checklist: '可执行检查项', fallbackCategory: '指南'
  },
  categories: [{ id: 'all', label: '全部' }, { id: 'privacy', label: '隐私权限' }, { id: 'billing', label: '订阅退款' }, { id: 'region', label: '地区差异' }, { id: 'family', label: '家长控制' }],
  articles: [
    { id: 'permission-library', category: 'privacy', title: 'App 权限解释库：哪些权限最值得警惕？', summary: '解释定位、照片、相机、麦克风、通讯录、蓝牙、通知、VPN 和描述文件等权限的真实含义。', readTime: '8 分钟', sections: [{ heading: '定位权限', text: '定位权限分为“使用期间”和“始终允许”。地图、天气、打车类应用通常需要定位，但壁纸、计算器、扫码、滤镜类应用如果要求持续定位，就需要谨慎。建议优先选择“使用 App 期间允许”，并关闭精确位置。' }, { heading: '照片与相机', text: 'iOS 支持只授权选中的照片。图片编辑或扫描类应用可以使用有限照片权限，不一定要开放全部相册。相机权限通常只在拍摄、扫码、视频会议场景必要。' }, { heading: '麦克风与语音识别', text: '录音、会议、语音输入需要麦克风，但普通工具类 App 若在后台请求麦克风，应立即检查设置。语音识别可能涉及音频上传，建议阅读隐私政策。' }, { heading: '通讯录与日历', text: '通讯录包含姓名、电话、邮箱和关系网络，是高敏感数据。除通讯、CRM、日程协作类应用外，普通 App 不应默认请求通讯录。' }, { heading: '蓝牙、本地网络与追踪', text: '蓝牙和本地网络可用于设备发现，也可能被用于识别周边设备。请求跟踪权限会影响跨 App 广告归因，非必要建议拒绝。' }, { heading: 'VPN、证书和描述文件', text: 'VPN、根证书、设备管理描述文件属于高权限配置，可能影响网络流量、证书信任或设备策略。只从可信开发者获取，并确认删除路径。' }], checklist: ['只授权核心功能需要的权限', '优先选择“仅本次”或“使用期间”', '安装后到 iOS 设置中复查权限', '高权限配置先核对开发者身份'] },
    { id: 'refund-cancel-guide', category: 'billing', title: '订阅取消与 Apple 退款教程', summary: '说明如何取消订阅、申请退款、保存证据，以及为什么删除 App 不等于取消订阅。', readTime: '7 分钟', sections: [{ heading: '如何取消订阅', text: '在 iPhone 上打开“设置”，点击 Apple ID 名称，进入“订阅”，选择对应 App 后点击取消。取消后通常可以使用到当前计费周期结束。删除 App 不会自动取消订阅。' }, { heading: '如何申请退款', text: '访问 Apple 的 reportaproblem.apple.com，登录购买使用的 Apple ID，选择对应项目并提交退款原因。退款是否通过取决于购买时间、使用情况和 Apple 审核。' }, { heading: '需要保存哪些证据', text: '建议截图保存订阅价格、试用期结束日期、App 内承诺、错误扣费信息、客服沟通记录和 App Store 收据邮件。证据越完整，越容易说明情况。' }, { heading: '免费试用的关键风险', text: '很多试用会在到期后自动转为年付或月付。部分订阅需要在续费前至少 24 小时取消。开启试用时应立刻在日历里设置提醒。' }, { heading: '儿童设备防误扣费', text: '家庭共享中建议开启“购买前询问”，并使用屏幕使用时间限制 App 内购买。儿童设备不要保存不必要的支付方式。' }], checklist: ['进入设置确认订阅状态', '截图保存试用和价格信息', '提前一天设置取消提醒', '通过 Apple 官方页面申请退款'] },
    { id: 'store-region-knowledge', category: 'region', title: 'App Store 地区差异知识库', summary: '解释不同区的价格、税费、礼品卡、支付方式、上架范围和切换地区限制。', readTime: '9 分钟', sections: [{ heading: '为什么不同地区价格不同', text: '开发者会选择 Apple 的价格等级，不同国家和地区还会受到税费、汇率、价格调整和本地市场策略影响。因此最低价格不一定等于最适合购买的地区。' }, { heading: '支付方式与账单地址', text: '切换地区通常需要目标地区支持的支付方式和账单地址。礼品卡也通常有地区限制，不能跨区通用。' }, { heading: '已购项目与更新', text: '跨区后，部分 App 可能无法重新下载或更新。某些应用只在特定地区上架，开发者也可能为不同地区发布不同版本。' }, { heading: '订阅价格变化', text: '地区切换可能影响订阅价格、续费币种和可用服务。切换前应先处理进行中的订阅、预购和余额。' }, { heading: '什么时候不建议切区', text: '如果主账号绑定家庭共享、重要订阅、余额、长期购买记录或工作设备，不建议为了单个 App 频繁切换地区。' }], checklist: ['清空或处理 Apple ID 余额', '确认订阅和预购状态', '核对目标地区支付方式', '记录重要 App 是否仍可下载更新'] },
    { id: 'privacy-score-guide', category: 'privacy', title: '隐私权限评分表：如何给一个 App 打分？', summary: '给出简单的隐私评分方法，帮助用户判断一个 App 是否过度收集数据。', readTime: '6 分钟', sections: [{ heading: '从功能必要性开始', text: '判断权限是否合理，首先看它是否服务于核心功能。导航需要定位，扫码需要相机，记账通常不需要通讯录，壁纸通常不需要精确位置。' }, { heading: '看数据是否可识别个人', text: '通讯录、精确位置、照片、健康数据、购买记录和浏览历史都可能直接或间接识别个人。收集越多，风险越高。' }, { heading: '看是否用于追踪', text: '如果隐私标签显示用于第三方广告、跨 App 追踪或数据经纪，且与功能关系不大，应提高风险等级。' }, { heading: '看是否有替代方案', text: '同类 App 中如果存在数据收集更少、价格透明、开发者可信的替代品，优先选择隐私负担更低的一项。' }], checklist: ['列出应用请求的所有权限', '标记与核心功能无关的权限', '查看隐私标签是否用于追踪', '比较同类替代应用'] },
    { id: 'family-safety-guide', category: 'family', title: '家长控制与儿童设备安全指南', summary: '帮助家长设置购买限制、内容限制、屏幕使用时间和儿童隐私保护。', readTime: '7 分钟', sections: [{ heading: '开启购买前询问', text: '家庭共享中可以为儿童账号开启“购买前询问”。这样下载付费 App、内购或订阅前需要家长批准，能有效减少误扣费。' }, { heading: '限制 App 内购买', text: '在屏幕使用时间中进入内容和隐私访问限制，关闭或限制 App 内购买。对游戏、教育、视频和聊天类 App 尤其重要。' }, { heading: '设置内容分级', text: '根据年龄限制 App、网页内容、音乐、影片和图书分级。不要只依赖 App 名称判断是否适合儿童。' }, { heading: '保护儿童隐私', text: '儿童设备应限制定位共享、广告追踪、联系人上传和公开个人信息。聊天和 UGC 应用要重点检查陌生人互动风险。' }, { heading: '定期复查', text: '每月查看已安装 App、订阅记录、屏幕时间报告和权限列表。孩子长大后可以逐步放开限制，但不要一次性全部解除。' }], checklist: ['开启购买前询问', '关闭或限制 App 内购买', '设置内容年龄分级', '每月复查订阅和权限'] }
  ]
};

export const knowledgeArticles = knowledgeContent.zh.articles;
export const knowledgeCategories = knowledgeContent.zh.categories;
