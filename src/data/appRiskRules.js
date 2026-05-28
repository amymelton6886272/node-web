export const riskContent = {
  en: {
    page: {
      heroTitle: 'App Risk Assessor',
      heroSub: 'Quickly assess an app before installing or paying by reviewing permissions, subscriptions, developer trust, reviews, and device-management signals.',
      title: 'What problem does the App Risk Assessor solve?',
      intro: 'Many users download after seeing ratings, screenshots, or rankings, but the real risks often hide in permissions, subscriptions, developer credibility, and recent reviews. This tool turns common warning signs into selectable questions and produces a practical risk summary.',
      items: [
        { heading: 'No third-party API required', text: 'The page provides a full assessment framework, explanations, and advice by default. Users can learn and self-check even without entering an app name.' },
        { heading: 'More guidance than search alone', text: 'Search tells you whether an app exists; risk assessment tells you what evidence to inspect: permission fit, subscription transparency, developer trust, and review patterns.' },
        { heading: 'Content-first and AdSense friendly', text: 'This is original explanatory content combined with an interactive tool, not a link list, empty-result page, or ad carrier. Ads, if enabled, should appear after the explanation or results.' },
      ],
      linksLabel: 'Related reading',
      links: [
        { href: '#checklists', label: 'Checklists' },
        { href: '#iap', label: 'IAP Lookup' },
        { href: '#privacy', label: 'Privacy Policy' },
      ],
      startTitle: 'Start assessment', startText: 'Enter an app name for your own reference, or simply select the warning signs you observed. All scoring happens locally in your browser.', placeholder: 'Example: a VPN, wallpaper, scanner, budgeting, or AI app', currentApp: 'Current app', resultTitle: 'Result and next steps', resultText: 'Prioritize the categories with the highest scores based on the signals you selected.', noSignals: 'No warning signs selected yet. Check the App Store page, permission prompts, subscription wording, and recent reviews one by one.', focus: 'Focus first', openChecklists: 'Open checklists', checkIap: 'Check IAP', readGuides: 'Read guides', reset: 'Reset', scoreOf: '/ 100'
    },
    categories: { trust: 'Trust', privacy: 'Privacy', billing: 'Billing', quality: 'Quality', security: 'Security', family: 'Family' },
    levels: { high: { label: 'High risk', summary: 'Pause installation or payment until you complete more checks.' }, medium: { label: 'Medium risk', summary: 'Continue reviewing, but do not grant sensitive permissions or start a subscription immediately.' }, low: { label: 'Low risk', summary: 'No obvious high-risk signal yet, but keep the principle of minimum necessary permissions.' } },
    questions: [
      { id: 'unknownDeveloper', category: 'trust', weight: 14, title: 'Developer identity is unclear', description: 'The developer website, support email, privacy policy, or previous apps are difficult to verify.', advice: 'Search the developer name, official domain, and other apps. Do not grant sensitive permissions to apps with no reachable contact path.' },
      { id: 'aggressivePermissions', category: 'privacy', weight: 18, title: 'Permissions exceed the core function', description: 'For example, flashlight, wallpaper, calculator, or filter apps requesting contacts, location, photos, or Bluetooth.', advice: 'Allow only necessary permissions at first launch. Deny or limit non-essential permissions.' },
      { id: 'subscriptionFirst', category: 'billing', weight: 16, title: 'Subscription or trial appears before core use', description: 'The app pushes a free trial, annual plan, or hidden skip button before showing meaningful functionality.', advice: 'Confirm billing period, trial end date, and cancellation path. If needed, close the app and read the App Store terms first.' },
      { id: 'lowRecentReviews', category: 'quality', weight: 12, title: 'Recent reviews mention billing, crashes, or cancellation issues', description: 'The overall rating may look high while recent reviews show serious problems in the current version.', advice: 'Sort by newest reviews and read 1-star and 2-star feedback. Repeated patterns are a warning sign.' },
      { id: 'staleUpdates', category: 'quality', weight: 10, title: 'Long time without updates or vague release notes', description: 'The app has not been updated for years, or release notes only say “bug fixes” without addressing reported issues.', advice: 'Check compatibility with your current iOS version. VPN, finance, security, and utility apps especially need maintenance.' },
      { id: 'trackingHeavy', category: 'privacy', weight: 14, title: 'Privacy label shows heavy tracking or linked data', description: 'The app collects location, contacts, browsing history, purchases, or other data unrelated to the core feature.', advice: 'Choose a lower-data alternative if possible. Disable “Allow Apps to Request to Track” after installation.' },
      { id: 'externalPayment', category: 'billing', weight: 12, title: 'Pushes external payment or private chat payment', description: 'The app or support channel asks you to pay outside App Store through a website, chat, or transfer.', advice: 'Be cautious with external payment. Confirm refund rules, terms, and merchant identity before paying.' },
      { id: 'profileVpnCert', category: 'security', weight: 20, title: 'Requests profiles, VPN, or root certificates', description: 'These permissions can affect network traffic, certificate trust, or device management.', advice: 'Install only from trusted sources. Read the profile signer, permission scope, and removal path before granting high privileges.' },
      { id: 'copycatBranding', category: 'trust', weight: 10, title: 'Name, icon, or wording looks like a copycat', description: 'Similar icons, keyword stuffing, or “official/pro/enhanced” wording may mislead downloads.', advice: 'Verify developer name, official website, and App ID. Do not rely only on search ranking.' },
      { id: 'childrenSensitive', category: 'family', weight: 10, title: 'Children or family devices may use it', description: 'The app includes ads, in-app purchases, chat, location, or user-generated content without purchase controls.', advice: 'Enable Screen Time, Ask to Buy, and content restrictions. Disable personalized ads on children’s devices where possible.' }
    ]
  },
  zh: {
    page: {
      heroTitle: 'App 安全风险评估器', heroSub: '根据权限、订阅、开发者、评论和设备管理等信号，为准备安装或付费的 App 做一次快速风险自查。', title: 'App 安全风险评估器解决什么问题？', intro: '很多用户在 App Store 看到评分、截图和榜单后就直接下载，但真正影响体验的风险往往藏在权限、订阅、开发者可信度和近期评论里。这个评估器把常见风险信号转化为可勾选的问题，帮助用户形成更稳健的安装和付费决策。',
      items: [{ heading: '不依赖第三方接口', text: '页面默认就提供完整评估框架、说明和建议。即使用户没有输入任何 App 名称，也能阅读风险知识并使用清单进行自查。' }, { heading: '比单纯搜索更有指导性', text: '搜索工具告诉你某个 App 是否存在，风险评估器告诉你应该看哪些证据：权限是否匹配功能、订阅是否透明、开发者是否可信、评论是否出现共性问题。' }, { heading: '适合 AdSense 内容价值要求', text: '它属于原创解释型内容与交互工具结合的页面，不是外链聚合、空结果页或广告承载页。广告如需展示，应放在说明和评估结果之后。' }],
      linksLabel: '相关阅读', links: [{ href: '#checklists', label: '决策清单' }, { href: '#iap', label: '内购查询' }, { href: '#privacy', label: '隐私政策' }],
      startTitle: '开始评估', startText: '可以输入 App 名称方便记录，也可以直接勾选你观察到的风险信号。所有计算都在浏览器本地完成。', placeholder: '例如：某款 VPN、壁纸、扫描、记账或 AI 应用', currentApp: '当前 App', resultTitle: '评估结论与下一步', resultText: '根据你勾选的风险信号，优先处理分数最高的类别。', noSignals: '还没有勾选风险信号。建议在 App Store 页面、设置权限弹窗、订阅说明和最近评论中逐项核对。', focus: '优先关注', openChecklists: '打开决策清单', checkIap: '检查内购', readGuides: '阅读指南', reset: '重新评估', scoreOf: '/ 100'
    },
    categories: { trust: '可信度', privacy: '隐私', billing: '扣费', quality: '质量', security: '安全', family: '家庭' },
    levels: { high: { label: '高风险', summary: '建议暂停安装或付款，先完成更多核查。' }, medium: { label: '中风险', summary: '可以继续评估，但不要立刻授权敏感权限或开启订阅。' }, low: { label: '低风险', summary: '暂未发现明显高风险信号，但仍建议保留必要权限原则。' } },
    questions: [
      { id: 'unknownDeveloper', category: 'trust', weight: 14, title: '开发者身份不清晰', description: '开发者官网、客服邮箱、隐私政策或历史作品难以验证。', advice: '优先搜索开发者名称、官网域名和其他作品。没有公开联系方式的应用不要授权敏感权限。' },
      { id: 'aggressivePermissions', category: 'privacy', weight: 18, title: '权限请求超出核心功能', description: '例如手电筒、壁纸、计算器类应用请求通讯录、定位、照片或蓝牙。', advice: '首次启动只允许必要权限。对非必要权限选择“拒绝”或“仅本次允许”。' },
      { id: 'subscriptionFirst', category: 'billing', weight: 16, title: '启动后立即要求订阅或试用', description: '未展示核心功能前就要求开启免费试用、年付订阅或跳过按钮很隐蔽。', advice: '先确认订阅周期、试用结束时间和取消路径。必要时先关闭应用，去 App Store 页面查看条款。' },
      { id: 'lowRecentReviews', category: 'quality', weight: 12, title: '近期评论集中提到扣费、崩溃或无法取消', description: '总评分可能较高，但最近评论显示新版存在严重问题。', advice: '按“最新”查看评论，重点看 1 星和 2 星内容。如果多次出现同类问题，建议暂缓安装。' },
      { id: 'staleUpdates', category: 'quality', weight: 10, title: '长期未更新或版本记录异常', description: '应用多年未更新，或更新日志长期只有“bug fixes”但评论问题没有改善。', advice: '确认是否兼容当前 iOS 版本。工具类、VPN、金融和安全类应用尤其需要稳定维护。' },
      { id: 'trackingHeavy', category: 'privacy', weight: 14, title: '隐私标签显示大量追踪或关联数据', description: '应用收集位置、联系人、浏览历史、购买记录等与功能无关的数据。', advice: '如果不是强需求，选择数据收集更少的替代应用。安装后关闭“允许 App 请求跟踪”。' },
      { id: 'externalPayment', category: 'billing', weight: 12, title: '引导到外部支付或私聊付款', description: '应用或客服要求离开 App Store 体系，通过网页、聊天或转账解锁功能。', advice: '谨慎处理外部支付。确认退款规则、服务条款和商家主体，避免无法维权。' },
      { id: 'profileVpnCert', category: 'security', weight: 20, title: '要求安装描述文件、VPN 或根证书', description: '这类权限可能影响网络流量、证书信任或设备管理。', advice: '只从可信来源安装。看清描述文件签名、权限范围和删除方式，不要为了小功能授予高权限。' },
      { id: 'copycatBranding', category: 'trust', weight: 10, title: '名称、图标或描述疑似仿冒知名应用', description: '通过相似图标、关键词堆砌或“官方/增强版”等描述误导下载。', advice: '核对开发者名称、官网链接和 App ID。不要只依赖搜索结果排名。' },
      { id: 'childrenSensitive', category: 'family', weight: 10, title: '儿童或家庭设备可能使用', description: '应用含广告、内购、聊天、定位或用户生成内容，但设备没有购买限制。', advice: '开启屏幕使用时间、购买前询问和内容限制。儿童设备尽量关闭个性化广告。' }
    ]
  }
};

export const riskQuestions = riskContent.zh.questions;
export const riskCategories = riskContent.zh.categories;

export function getRiskLevel(score, lang = 'zh') {
  const levels = riskContent[lang]?.levels || riskContent.zh.levels;
  if (score >= 65) return { ...levels.high, className: 'high' };
  if (score >= 35) return { ...levels.medium, className: 'medium' };
  return { ...levels.low, className: 'low' };
}
