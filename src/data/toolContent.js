export const toolContent = {
  en: {
    price: {
      title: 'Why App Store cross-region prices need careful reading',
      intro: 'The same app can use different price tiers, taxes, currencies, and promotions across countries and regions. A simple currency conversion does not always equal the final purchase cost, so Wolffy shows the original storefront price, approximate CNY value, and availability state together.',
      items: [
        { heading: 'Where price differences come from', text: 'Apple pricing tiers, developer choices, exchange-rate adjustments, and local taxes can all change the displayed price. Some apps are unavailable in certain storefronts or offer different subscription plans.' },
        { heading: 'How to read the lowest-price badge', text: 'The lowest-price marker only reflects the lowest approximate CNY value among currently queried public prices. It is not a purchase recommendation. Original currency values remain visible for manual verification.' },
        { heading: 'When to use this tool', text: 'Use it to estimate price ranges, identify obvious regional differences, and confirm whether an App ID is listed in a storefront. For subscriptions and long-term services, also review IAP details and developer terms.' },
      ],
      //note: 'Do not treat the price page as only a search box. These explanations and related links help users understand context even before they run a query.',
      links: [{ href: '#iap', label: 'IAP Lookup' }, { href: '#guides', label: 'App Store guides' }, { href: '#glossary', label: 'Price tier terms' }, { href: '#knowledge', label: 'Apple safety guides' }, { href: '#checklists', label: 'Decision checklists' }],
      linksLabel: 'Related reading'
    },
    appfree: {
      title: 'How to evaluate limited-time free app lists',
      intro: 'Free-app information changes quickly. Simply copying third-party deal lists can be low-value. Wolffy adds category, developer, store link, and usage reminders so users can decide whether an app is worth downloading.',
      items: [
        { heading: 'Free today does not mean free forever', text: 'Many apps are temporarily free and may return to paid pricing. Always confirm the App Store price before downloading, especially for subscription or IAP-heavy apps.' },
        { heading: 'Check quality signals first', text: 'Review developer name, rating, update date, privacy labels, and recent comments. An abandoned or permission-heavy app may not be worth installing even when free.' },
        { heading: 'Keep context when feeds fail', text: 'If an API fails or no apps are available, the page still provides filtering advice and related guides instead of becoming an empty screen with ads.' },
      ],
      links: [{ href: '#price', label: 'Price Compare' }, { href: '#iap', label: 'Check IAP' }, { href: '#guides', label: 'Free app guide' }, { href: '#risk', label: 'App Risk Assessor' }],
      linksLabel: 'Related reading'
    },
    iap: {
      title: 'How to interpret in-app purchase lookup results',
      intro: 'App Store in-app purchase information may vary by region, language, and page structure. Wolffy attempts to identify IAP items from Apple data, but users should always confirm final terms in the App Store checkout flow.',
      items: [
        { heading: 'Different IAP types', text: 'Common IAP models include one-time unlocks, consumables, auto-renewing subscriptions, and non-renewing subscriptions. A free app can still place core features behind IAP.' },
        { heading: 'A failed lookup does not mean no IAP', text: 'Network proxies, Apple page changes, and regional limits can prevent detection. The page avoids presenting incomplete data as a definite conclusion.' },
        { heading: 'What to check before buying', text: 'Review trial length, renewal period, cancellation path, Family Sharing, refund rules, and developer reputation. Extra purchase restrictions are recommended on family devices.' },
      ],
      links: [{ href: '#price', label: 'App base price' }, { href: '#guides', label: 'Subscription safety guide' }, { href: '#glossary', label: 'IAP terms' }, { href: '#risk', label: 'App Risk Assessor' }, { href: '#checklists', label: 'Decision checklists' }],
      linksLabel: 'Related reading'
    },
    icon: {
      title: 'Appropriate uses for high-resolution app icons',
      intro: 'Icon search helps preview public App Store artwork, design references, and direct icon links. App icons usually belong to the developer or rights holder, so use them responsibly.',
      items: [
        { heading: 'Why an icon tool is useful', text: 'App Store icon URLs contain size parameters that are easy to edit incorrectly. The tool shows app name, developer, and icon link so users can confirm they found the correct app.' },
        { heading: 'Avoid misleading use', text: 'Do not use icons to impersonate official apps, mislead downloads, or imply authorization. Commercial designs and review pages should identify the source and link back to the App Store.' },
        { heading: 'When search returns nothing', text: 'If no results are found, the page still offers usage guidance and related articles. Ads should not be placed in a pure empty-result area.' },
      ],
      links: [{ href: '#guides', label: 'App identification guide' }, { href: '#glossary', label: 'Bundle ID and icon terms' }, { href: '#knowledge', label: 'Apple safety guides' }],
      linksLabel: 'Related reading'
    },
    ip: {
      title: 'How to read IP check results',
      intro: 'The IP page helps you understand current network exit, geolocation, ISP/ASN, and basic connectivity. It cannot precisely prove your real physical location or replace professional network diagnostics.',
      items: [
        { heading: 'Geolocation is database estimation', text: 'Different IP databases can report different cities or operators. Mobile networks, data centers, and proxy exits are especially likely to show approximate or inconsistent locations.' },
        { heading: 'Connectivity tests have limits', text: 'Reachability can be affected by DNS, browser behavior, CORS rules, and local network conditions. A single failure does not necessarily mean a service is down.' },
        { heading: 'Privacy reminder', text: 'The page displays information your browser can obtain. When using public Wi‑Fi, proxies, or enterprise networks, avoid logging into sensitive accounts in untrusted environments.' },
      ],
      links: [{ href: '#knowledge', label: 'Network safety guide' }, { href: '#glossary', label: 'Network terms' }, { href: '#privacy', label: 'Privacy Policy' }],
      linksLabel: 'Related reading'
    },
    address: {
      title: 'Correct use of the address generator',
      intro: 'The address generator is for test forms, demo data, and local drafts. It must not be used for fraud, evading platform rules, or impersonating a real person. Generated content stays in your browser unless you export it.',
      items: [
        { heading: 'Test data versus real addresses', text: 'The page combines city, street, and postal-code patterns to look realistic, but it does not guarantee a real resident or deliverable address.' },
        { heading: 'Good development and design uses', text: 'Use it for checkout form testing, CRM sample data, UI screenshots, and internationalization field validation. For compliance or logistics, use an official address validation service.' },
        { heading: 'Local saving and export', text: 'Saved addresses are stored in browser localStorage and are not automatically uploaded. Clearing browser site data will remove them.' },
      ],
      links: [{ href: '#ip', label: 'IP Check' }, { href: '#guides', label: 'App Store guides' }, { href: '#knowledge', label: 'Safety knowledge base' }, { href: '#privacy', label: 'Privacy Policy' }],
      linksLabel: 'Related reading'
    }
  },
  zh: {
    price: {
      title: 'App Store 跨区价格为什么需要谨慎比较？',
      intro: '同一款 App 在不同国家或地区可能使用不同价格等级、税率、货币和促销策略。简单地把当地价格换算成人民币并不等同于最终购买成本，因此 Wolffy 同时展示原始商店价格、近似人民币和可用状态。',
      items: [{ heading: '价格差异的来源', text: 'Apple 会根据地区价格等级、开发者定价、汇率调整和当地税费展示不同价格。部分应用在某些区不可用，或提供不同订阅方案。对比时应优先确认可购买性、家庭共享、语言支持和售后限制。' }, { heading: '如何阅读最低价提示', text: '最低价标记只代表当前查询到的公开价格中人民币估算最低的一项，不构成购买建议。汇率接口失败时会使用备用汇率，因此页面保留原币种价格，方便用户自行核对。' }, { heading: '适合的使用场景', text: '这个工具适合购买前快速判断价格区间、寻找是否存在明显区域差异、确认 App ID 是否在指定商店上架。对于订阅、内购和长期服务，建议继续查看 IAP 页面和开发者说明。' }],
      //note: '提示：不要把价格页做成只有搜索框和广告的页面。保留这些说明、示例和相关链接，有助于证明页面具备独立价值。', 
      links: [{ href: '#iap', label: '内购查询' }, { href: '#guides', label: 'App Store 使用指南' }, { href: '#glossary', label: '价格等级术语' }, { href: '#knowledge', label: '安全知识库' }, { href: '#checklists', label: '决策清单' }], linksLabel: '相关阅读'
    },
    appfree: {
      title: '限免应用页面的筛选原则', intro: '限免信息变化很快，单纯复制第三方列表容易被视为低价值聚合。本站会补充应用分类、开发者、可用链接和使用提醒，帮助用户判断是否值得下载，而不是只展示一组外链。', items: [{ heading: '限免不等于永久免费', text: '很多应用只在短时间内免费，恢复原价后可能仍显示历史缓存。打开 App Store 前请再次确认价格，尤其是订阅型应用和包含内购的应用。' }, { heading: '优先查看应用质量信号', text: '建议结合开发者名称、评分、更新时间、隐私标签和评论趋势判断。没有维护、权限异常或描述夸张的应用，即使限免也不一定值得安装。' }, { heading: '保留上下文内容', text: '当接口暂时失败或当天数据为空时，页面仍应显示说明、筛选建议和相关文章，避免形成“无发布商内容但展示广告”的屏幕。' }], links: [{ href: '#price', label: '价格对比' }, { href: '#iap', label: '检查内购' }, { href: '#guides', label: '限免应用指南' }, { href: '#risk', label: 'App 风险评估' }], linksLabel: '相关阅读'
    },
    iap: {
      title: '内购查询结果如何判断？', intro: 'App Store 的内购信息可能因地区、语言和页面结构而变化。Wolffy 会尝试从 Apple 页面识别内购项目，但仍建议用户以 App Store 结算页显示为准。', items: [{ heading: '内购类型差异', text: '常见内购包括一次性解锁、消耗型点数、自动续订订阅和非续订订阅。即使应用本体免费，也可能通过内购提供核心功能。' }, { heading: '查询失败不代表没有内购', text: '网络代理、Apple 页面结构变化或地区限制都可能导致识别失败。页面会标记“待确认”或“检查失败”，避免把不完整数据包装成确定结论。' }, { heading: '购买前检查', text: '建议检查试用期、续订周期、取消方式、家庭共享、退款规则和开发者信誉。儿童或家庭设备应额外启用购买限制。' }], links: [{ href: '#price', label: '应用本体价格' }, { href: '#guides', label: '订阅避坑指南' }, { href: '#glossary', label: 'IAP 术语' }, { href: '#risk', label: 'App 风险评估' }, { href: '#checklists', label: '决策清单' }], linksLabel: '相关阅读'
    },
    icon: {
      title: '高清图标搜索的合理用途', intro: '图标搜索用于预览 App Store 公开素材、设计参考和链接复制。图标版权通常归应用开发者或权利方所有，下载或展示时应遵守对方品牌规范。', items: [{ heading: '为什么需要图标工具', text: 'App Store 图标 URL 包含尺寸参数，手动替换容易出错。工具会展示应用名称、开发者和图标链接，方便核对是否为目标应用。' }, { heading: '避免误用素材', text: '不要把图标用于冒充官方、误导下载或暗示授权。商业设计、文章配图或应用推荐页应标明来源并链接回 App Store。' }, { heading: '搜索为空时的处理', text: '如果没有结果，页面仍提供使用说明和相关指南，不应在纯空结果区域投放广告。' }], links: [{ href: '#guides', label: 'App 识别指南' }, { href: '#glossary', label: 'Bundle ID 与图标术语' }, { href: '#knowledge', label: '安全知识库' }], linksLabel: '相关阅读'
    },
    ip: {
      title: 'IP 检测结果的解释方式', intro: 'IP 页面用于了解当前网络出口、地理位置、运营商和常见站点连通性。它不能保证准确判断真实位置，也不能替代专业网络诊断。', items: [{ heading: '地理位置只是数据库估计', text: '不同 IP 数据库可能给出不同城市或运营商。移动网络、数据中心和代理出口尤其容易出现偏差，因此结果应作为排查线索而非绝对事实。' }, { heading: '连通性测试的限制', text: '站点可访问性会受 DNS、浏览器策略、跨域限制和本地网络影响。单次失败不一定代表服务不可用，建议结合其他工具复测。' }, { heading: '隐私提醒', text: '页面只展示浏览器可获得的网络信息。使用公共 Wi‑Fi、代理或企业网络时，请避免在不可信环境中登录敏感账号。' }], links: [{ href: '#knowledge', label: '网络安全指南' }, { href: '#glossary', label: '网络术语' }, { href: '#privacy', label: '隐私政策' }], linksLabel: '相关阅读'
    },
    address: {
      title: '地址生成器的正确使用范围', intro: '地址生成器用于测试表单、演示数据和本地草稿，不应用于欺诈、规避平台规则或冒充真实身份。生成内容保存在浏览器本地，用户可以自行复制或导出。', items: [{ heading: '测试数据与真实地址的区别', text: '页面会组合城市、街道和邮编格式，让数据看起来接近真实场景，但并不保证对应真实居民或可投递地址。' }, { heading: '适合开发和设计流程', text: '常见用途包括结账表单测试、CRM 示例数据、UI 截图和国际化字段验证。涉及合规或物流时，应使用官方地址校验服务。' }, { heading: '本地保存与导出', text: '收藏地址保存在浏览器 localStorage 中，不会自动上传到服务器。清理浏览器数据会删除这些内容。' }], links: [{ href: '#ip', label: 'IP 检测' }, { href: '#guides', label: 'App Store 指南' }, { href: '#knowledge', label: '安全知识库' }, { href: '#privacy', label: '隐私政策' }], linksLabel: '相关阅读'
    }
  }
};
