export const toolContent = {
  en: {
    price: {
      title: 'Why App Store cross-region prices need careful reading',
      intro: 'The same app can use different price tiers, taxes, currencies, and promotions across countries and regions. A simple currency conversion does not always equal the final purchase cost, so Storewise shows the original storefront price, approximate CNY value, and availability state together.',
      items: [
        { heading: 'Where price differences come from', text: 'Apple pricing tiers, developer choices, exchange-rate adjustments, and local taxes can all change the displayed price. Some apps are unavailable in certain storefronts or offer different subscription plans.' },
        { heading: 'How to read the lowest-price badge', text: 'The lowest-price marker only reflects the lowest approximate CNY value among currently queried public prices. It is not a purchase recommendation. Original currency values remain visible for manual verification.' },
        { heading: 'When to use this tool', text: 'Use it to estimate price ranges, identify obvious regional differences, and confirm whether an App ID is listed in a storefront. For subscriptions and long-term services, also review IAP details and developer terms.' },
        { heading: 'How the comparison works', text: 'Storewise queries public App Store metadata for the selected regions, normalizes currency display, and keeps the original storefront price visible next to any converted estimate. Availability state is shown separately so a missing region is not mistaken for a zero price. When an interface fails, the page should keep explanatory content instead of collapsing into an empty search box.' },
        { heading: 'Common mistakes to avoid', text: 'Do not switch your main Apple ID region only because one converted price looks lower. Do not ignore taxes, trials, or subscription packaging. Do not assume the cheapest region offers the same feature set, language support, or refund path. For family or work accounts, operational risk can outweigh a small discount.' },
        { heading: 'Recommended next steps', text: 'After comparing base prices, open the related checklist, inspect subscription terms, and verify the final amount in the official App Store checkout. If the purchase is expensive or hard to reverse, save screenshots of the offer sheet before paying.' },
        { heading: 'Build a one-page price brief before expensive buys', text: 'For purchases over your personal threshold, write app name, storefront, original price, converted estimate, IAP ladder, trial terms, and a walk-away price. If any cell is empty, delay payment. Share the brief with the household payer when Family Sharing is involved.' }
      ],
      links: [{ href: '/iap', label: 'IAP Lookup' }, { href: '/guides', label: 'App Store guides' }, { href: '/glossary', label: 'Price tier terms' }, { href: '/knowledge', label: 'Apple safety guides' }, { href: '/checklists', label: 'Decision checklists' }],
      linksLabel: 'Related reading'
    },
    appfree: {
      title: 'How to evaluate limited-time free app lists',
      intro: 'Free-app information changes quickly. Simply copying third-party deal lists can be low-value. Storewise adds category, developer, store link, and usage reminders so users can decide whether an app is worth downloading.',
      items: [
        { heading: 'Free today does not mean free forever', text: 'Many apps are temporarily free and may return to paid pricing. Always confirm the App Store price before downloading, especially for subscription or IAP-heavy apps.' },
        { heading: 'Check quality signals first', text: 'Review developer name, rating, update date, privacy labels, and recent comments. An abandoned or permission-heavy app may not be worth installing even when free.' },
        { heading: 'Keep context when feeds fail', text: 'If an API fails or no apps are available, the page still provides filtering advice and related guides instead of becoming an empty screen with ads.' },
        { heading: 'How free-app curation should work', text: 'A useful free-app page explains category, developer identity, update freshness, privacy burden, and whether the app is truly free or only free to install. The goal is decision support, not a raw dump of outbound links. When data is incomplete, the page should say so clearly.' },
        { heading: 'Before you install a free app', text: 'Confirm the current App Store price, scan recent reviews for billing complaints, check whether a subscription is required for core features, and review permissions. If the app demands high privileges for a simple job, skip it even when the download is free.' },
        { heading: 'Score free apps on a 5-point card', text: 'Rate update freshness, developer identity, privacy burden, billing risk, and whether core features work offline or without an account. Install only if at least four scores are acceptable. Free downloads that fail this card are usually expensive later.' },
        { heading: 'Permissions and notification pressure', text: 'A free cleaner, VPN, or battery tool that wants contacts, precise location, or always-on notifications is a red flag. Deny first, use the feature, then decide. Pair this page with the risk assessor and permission decision articles.' },
        { heading: 'After install: 10-minute probation', text: 'Keep a 10-minute timer. If the app immediately paywalls the feature that made it free, pushes aggressive reviews, or restarts a trial you already cancelled, delete it and note the pattern for next time.' }
      ],
      links: [{ href: '/price', label: 'Price Compare' }, { href: '/iap', label: 'Check IAP' }, { href: '/guides', label: 'Free app guide' }, { href: '/risk', label: 'App Risk Assessor' }],
      linksLabel: 'Related reading'
    },
    iap: {
      title: 'How to interpret in-app purchase lookup results',
      intro: 'App Store in-app purchase information may vary by region, language, and page structure. Storewise attempts to identify IAP items from Apple data, but users should always confirm final terms in the App Store checkout flow.',
      items: [
        { heading: 'Different IAP types', text: 'Common IAP models include one-time unlocks, consumables, auto-renewing subscriptions, and non-renewing subscriptions. A free app can still place core features behind IAP.' },
        { heading: 'A failed lookup does not mean no IAP', text: 'Network proxies, Apple page changes, and regional limits can prevent detection. The page avoids presenting incomplete data as a definite conclusion.' },
        { heading: 'What to check before buying', text: 'Review trial length, renewal period, cancellation path, Family Sharing, refund rules, and developer reputation. Extra purchase restrictions are recommended on family devices.' },
        { heading: 'Map every SKU to a job-to-be-done', text: 'Write one sentence for each IAP: unlocks export, removes ads, adds seats, or sells consumable credits. If two SKUs buy the same job, keep the cheaper long-term option. Storewise lookup is a map, not a shopping cart.' },
        { heading: 'Trials, free periods, and first charge dates', text: 'When a trial exists, record start date, length, first charge date, and cancel path before you tap Start. Annualize the post-trial price. A 3-day trial into a weekly plan can cost more than a yearly unlock if you forget to cancel.' },
        { heading: 'Region and language mismatches', text: 'IAP names and prices can differ by storefront. If you switched regions or used a shared Apple ID, confirm the storefront that will bill you. Screenshots from another country are not your checkout sheet.' },
        { heading: 'Family Sharing and Ask to Buy interactions', text: 'Some subscriptions share; consumables usually do not. On child devices, Ask to Buy may still allow free downloads that later open paid IAP. Pair this page with Screen Time purchase limits when the device is shared.' },
        { heading: 'Evidence pack before you buy', text: 'Save the product page, IAP list, Privacy labels, and the final confirm sheet. If billing goes wrong, Report a Problem needs a timeline more than a long complaint. Re-check Settings > Apple ID > Subscriptions after any purchase.' }
      ],
      links: [{ href: '/price', label: 'App base price' }, { href: '/guides', label: 'Subscription safety guide' }, { href: '/glossary', label: 'IAP terms' }, { href: '/risk', label: 'App Risk Assessor' }, { href: '/checklists', label: 'Decision checklists' }],
      linksLabel: 'Related reading'
    },
    icon: {
      title: 'Appropriate uses for high-resolution app icons',
      intro: 'Icon search indexes public App Store API results so you can preview official artwork and copy high-resolution links for design reference.',
      notice: 'Copyright notice: This site only indexes public App Store API data and does not host or store app icons. All app trademarks, logos, and icons remain the property of their respective developers and Apple Inc.',
      items: [
        { heading: 'Why an icon tool is useful', text: 'App Store icon URLs contain size parameters that are easy to edit incorrectly. The tool shows app name, developer, and icon link so users can confirm they found the correct app.' },
        { heading: 'Avoid misleading use', text: 'Do not use icons to impersonate official apps, mislead downloads, or imply authorization. Commercial designs and review pages should identify the source and link back to the App Store.' },
        { heading: 'When search returns nothing', text: 'If no results are found, the page still offers usage guidance and related articles so you can refine the query or continue reading.' },
        { heading: 'How it works', text: 'Enter an App Store app ID, bundle ID, or app name into the search field. The tool calls the iTunes Search API (public and rate-limited) to fetch the app\'s official artwork at the highest available resolution — typically 1024×1024 pixels. It also retrieves the app name, developer, content rating, and App Store link. The icon URL is extracted from the artworkUrl100 field and automatically upscaled to the 1024px variant. Results are cached in your browser session to avoid redundant API calls.' },
        { heading: 'Troubleshooting', text: 'No results found: The iTunes Search API may rate-limit frequent requests or return empty results for region-restricted apps. Wait 30 seconds and try again, or verify the app ID is correct by visiting the App Store listing. || Low resolution icon: Some apps do not provide 1024px artwork; the tool falls back to the highest resolution available (512px or 256px). This is not an error — the developer simply did not upload a larger asset. || Wrong app returned: If searching by name, multiple apps may match. Use the exact App Store app ID (numeric) for guaranteed precision.' },
        { heading: 'Attribution and fair use boundaries', text: 'Use icons for mockups, comparison tables, and internal design exploration with clear App Store links. Do not ship icons inside competing store clients, phishing pages, or ads that imply Apple or developer endorsement.' }
      ],
      links: [{ href: '/guides', label: 'App identification guide' }, { href: '/glossary', label: 'Bundle ID and icon terms' }, { href: '/knowledge', label: 'Apple safety guides' }],
      linksLabel: 'Related reading'
    },
    subcost: {
      title: 'How to estimate real subscription cost',
      intro: 'Weekly prices look small until they are annualized. This calculator converts weekly, monthly, and yearly plans into comparable monthly and yearly totals so you can decide whether a trial or paid plan matches your actual usage.',
      items: [
        { heading: 'Why annualization matters', text: 'A 4.99 weekly plan is roughly 259.48 per year before tax. Users often compare the weekly number with a yearly unlock and pick the wrong option. Convert every offer to the same time base first.' },
        { heading: 'Count only active plans', text: 'Paused, cancelled-but-not-expired, and family-shared plans can confuse totals. Mark only the plans that still create real spend. Keep notes for trial end dates and cancel paths.' },
        { heading: 'Local privacy by design', text: 'Rows are stored in browser localStorage only if you click save. Export JSON for spreadsheets. Nothing is uploaded to Storewise servers.' },
        { heading: 'What this tool cannot do', text: 'It cannot read your Apple account, cancel subscriptions, or include tax automatically. Always confirm final amounts and renewal dates in Settings > Apple ID > Subscriptions and the App Store checkout page.' },
        { heading: 'Recommended workflow', text: '1) list every recurring plan, 2) annualize cost, 3) open the matching checklist, 4) cancel low-value plans, 5) re-check next week. Pair this page with paid-vs-subscription and subscription-fatigue articles.' },
        { heading: 'Household stack view', text: 'List plans by person and device, not only by app name. Two personal VPN plans on one organizer card are still one household problem. Cap the number of active AI, photo, and VPN seats before adding new trials.' },
        { heading: 'Quarterly kill list', text: 'Every 90 days, force-rank subscriptions by hours used last month. The bottom two become cancel candidates unless they protect security or family safety. Re-run the calculator after each cancel.' }
      ],
      links: [{ href: '/price', label: 'Price compare' }, { href: '/checklists', label: 'Decision checklists' }, { href: '/articles/when-paid-app-beats-subscription', label: 'Paid vs subscription' }, { href: '/articles/spot-subscription-fatigue-apps', label: 'Subscription fatigue' }, { href: '/articles/manage-apple-subscriptions-after-trial', label: 'After free trial' }],
      linksLabel: 'Related reading'
    },
    trial: {
      title: 'How to build a free-trial cancel reminder',
      intro: 'Most trial traps happen because the end date is not written down. This page turns a start date and trial length into a cancel deadline, reminder day, calendar text, and a short action checklist.',
      items: [
        { heading: 'Cancel before the last day when possible', text: 'Many plans need cancellation at least 24 hours before renewal. The tool suggests a cancel-by date one day before the trial ends and a reminder one day earlier than that when the trial is long enough.' },
        { heading: 'Annualize the renewal before you keep it', text: 'If a weekly plan looks cheap, convert it to yearly cost. Pair this page with the subscription cost calculator when you are deciding whether the trial is worth keeping.' },
        { heading: 'Family devices need extra controls', text: 'A reminder is not enough on shared iPads. Re-check Ask to Buy and Screen Time purchase restrictions so the same trial path cannot restart silently.' },
        { heading: 'What this tool cannot do', text: 'It cannot read Apple subscriptions, create system calendar events by itself, or cancel billing. Copy the text into your own Calendar/Notes and confirm the live plan in Apple settings.' },
        { heading: 'Recommended next steps', text: 'Generate the packet, set a calendar alert, cancel if value is unclear, then review monthly costs. Keep screenshots if you later need Report a Problem.' },
        { heading: 'Screenshot the offer before Start Trial', text: 'Capture price, period, free days, and fine print. If the UI differs from the product page, treat the confirm sheet as truth. Store the screenshot with the cancel-by date in the same note.' },
        { heading: 'Shared devices and re-trials', text: 'Some apps re-offer trials after reinstall or alternate Apple IDs. On family devices, lock installs and purchases so a cancelled trial cannot restart from another profile.' }
      ],
      links: [{ href: '/subcost', label: 'Sub cost calculator' }, { href: '/checklists', label: 'Decision checklists' }, { href: '/articles/free-trial-trap-checklist', label: 'Trial trap checklist' }, { href: '/articles/cancel-apple-subscription-step-by-step', label: 'Cancel subscription' }, { href: '/articles/manage-apple-subscriptions-after-trial', label: 'After free trial' }],
      linksLabel: 'Related reading'
    }
  },
  zh: {
    price: {
      title: 'App Store 跨区价格为什么需要谨慎比较？',
      intro: '同一款 App 在不同国家或地区可能使用不同价格等级、税率、货币和促销策略。简单地把当地价格换算成人民币并不等同于最终购买成本，因此 Storewise 同时展示原始商店价格、近似人民币和可用状态。',
      items: [
        { heading: '价格差异的来源', text: 'Apple 会根据地区价格等级、开发者定价、汇率调整和当地税费展示不同价格。部分应用在某些区不可用，或提供不同订阅方案。对比时应优先确认可购买性、家庭共享、语言支持和售后限制。' },
        { heading: '如何阅读最低价提示', text: '最低价标记只代表当前查询到的公开价格中人民币估算最低的一项，不构成购买建议。汇率接口失败时会使用备用汇率，因此页面保留原币种价格，方便用户自行核对。' },
        { heading: '适合的使用场景', text: '这个工具适合购买前快速判断价格区间、寻找是否存在明显区域差异、确认 App ID 是否在指定商店上架。对于订阅、内购和长期服务，建议继续查看 IAP 页面和开发者说明。' },
        { heading: '比较过程如何工作', text: 'Storewise 会查询所选地区的公开 App Store 元数据，规范币种展示，并在换算估值旁保留原始商店价格。可用性状态会单独显示，避免把“未上架”误看成“价格为零”。当接口失败时，页面仍应保留说明内容，而不是只剩空搜索框。' },
        { heading: '常见误区', text: '不要只因为换算价更低就切换主 Apple ID 地区；不要忽略税费、试用和订阅包装；不要假设最低价地区拥有相同功能、语言支持或退款路径。对家庭或工作账号，操作风险可能大于小额优惠。' },
        { heading: '建议的下一步', text: '比较本体价格后，打开相关清单，检查订阅条款，并在官方 App Store 结算页核对最终金额。如果购买金额高或难以撤销，付款前先保存报价页截图。' },
        { heading: '高价购买前做一页价格简报', text: '超过个人阈值的购买，写下应用名、店面、原价、换算估值、内购阶梯、试用条款和走开价。任一格为空就暂缓付款。涉及家庭共享时与付款人共享简报。' }
      ],
      links: [{ href: '/iap', label: '内购查询' }, { href: '/guides', label: 'App Store 使用指南' }, { href: '/glossary', label: '价格等级术语' }, { href: '/knowledge', label: '安全知识库' }, { href: '/checklists', label: '决策清单' }],
      linksLabel: '相关阅读'
    },
    appfree: {
      title: '限免应用页面的筛选原则',
      intro: '限免信息变化很快，如果只堆第三方外链，信息会很薄。本站会补充应用分类、开发者、可用链接和使用提醒，帮助用户判断是否值得下载，而不是只展示一组外链。',
      items: [
        { heading: '限免不等于永久免费', text: '很多应用只在短时间内免费，恢复原价后可能仍显示历史缓存。打开 App Store 前请再次确认价格，尤其是订阅型应用和包含内购的应用。' },
        { heading: '优先查看应用质量信号', text: '建议结合开发者名称、评分、更新时间、隐私标签和评论趋势判断。没有维护、权限异常或描述夸张的应用，即使限免也不一定值得安装。' },
        { heading: '保留上下文内容', text: '当接口暂时失败或当天数据为空时，页面仍应显示说明、筛选建议和相关文章，避免形成“无页面内容但展示广告”的屏幕。' },
        { heading: '限免信息应如何整理', text: '有价值的限免页会补充分类、开发者身份、更新活跃度、隐私负担，以及应用是真免费还是仅免费安装。目标是辅助决策，而不是堆外链。数据不完整时，页面应明确说明。' },
        { heading: '安装限免应用前', text: '再次确认 App Store 当前价格，查看近期评论是否有扣费投诉，检查核心功能是否依赖订阅，并核对权限。如果一个简单工具索要高权限，即使免费下载也应跳过。' },
        { heading: '用 5 分卡给限免应用打分', text: '从更新活跃度、开发者身份、隐私负担、扣费风险、核心功能是否离线/免账号五维打分。至少四项可接受再装。过不了这张卡的免费下载，后面往往更贵。' },
        { heading: '权限与通知压力', text: '清理、VPN 或省电类免费工具若索要通讯录、精确位置或常驻通知，视为红旗。先拒绝，用完功能再决定。配合风险评估与权限决策文章。' },
        { heading: '安装后 10 分钟试用期', text: '定 10 分钟。若立刻锁死让你下载的功能、强推好评，或重启你已取消的试用，删除并记下模式，下次跳过同类。' }
      ],
      links: [{ href: '/price', label: '价格对比' }, { href: '/iap', label: '检查内购' }, { href: '/guides', label: '限免应用指南' }, { href: '/risk', label: 'App 风险评估' }],
      linksLabel: '相关阅读'
    },
    iap: {
      title: '内购查询结果如何判断？',
      intro: 'App Store 的内购信息可能因地区、语言和页面结构而变化。Storewise 会尝试从 Apple 页面识别内购项目，但仍建议用户以 App Store 结算页显示为准。',
      items: [
        { heading: '内购类型差异', text: '常见内购包括一次性解锁、消耗型点数、自动续订订阅和非续订订阅。即使应用本体免费，也可能通过内购提供核心功能。' },
        { heading: '查询失败不代表没有内购', text: '网络代理、Apple 页面结构变化或地区限制都可能导致识别失败。页面会标记“待确认”或“检查失败”，避免把不完整数据包装成确定结论。' },
        { heading: '购买前检查', text: '建议检查试用期、续订周期、取消方式、家庭共享、退款规则和开发者信誉。儿童或家庭设备应额外启用购买限制。' },
        { heading: '把每个 SKU 对应到用途', text: '为每个内购写一句话：解锁导出、去广告、加席位，还是卖消耗积分。若两个 SKU 买同一用途，保留长期更便宜的那个。Storewise 查询是地图，不是购物车。' },
        { heading: '试用、免费期与首次扣费日', text: '有试用时，点开始前先记开始日、时长、首次扣费日和取消路径。把试用后价格年化。3 天试用接周付，若忘记取消可能比年付解锁更贵。' },
        { heading: '地区与语言错配', text: '内购名称与价格可能因店面而异。若切过区或用共用 Apple ID，确认真正扣费的店面。其他国家截图不是你的结算页。' },
        { heading: '家庭共享与购买前询问', text: '部分订阅可共享；消耗型通常不能。儿童设备上即使开启购买前询问，免费下载仍可能打开付费内购。共用设备请配合屏幕使用时间购买限制。' },
        { heading: '购买前证据包', text: '保存产品页、内购列表、隐私标签和最终确认页。扣费异常时，Report a Problem 更需要时间线而不是长篇抱怨。任何购买后到“设置 > Apple ID > 订阅”复查。' }
      ],
      links: [{ href: '/price', label: '应用本体价格' }, { href: '/guides', label: '订阅避坑指南' }, { href: '/glossary', label: 'IAP 术语' }, { href: '/risk', label: 'App 风险评估' }, { href: '/checklists', label: '决策清单' }],
      linksLabel: '相关阅读'
    },
    icon: {
      title: '高清图标搜索的合理用途',
      intro: '图标搜索基于 App Store 公开 API 做索引与预览，方便你查看官方素材并复制高清链接，用于设计参考。',
      notice: '版权声明：本站仅提供 App Store 公开 API 的数据索引，不存储任何应用图标。所有 App 商标、Logo、图标版权均归其各自开发者及 Apple Inc. 所有。',
      items: [
        { heading: '为什么需要图标工具', text: 'App Store 图标 URL 包含尺寸参数，手动替换容易出错。工具会展示应用名称、开发者和图标链接，方便核对是否为目标应用。' },
        { heading: '避免误用素材', text: '不要把图标用于冒充官方、误导下载或暗示授权。商业设计、文章配图或应用推荐页应标明来源并链接回 App Store。' },
        { heading: '搜索为空时的处理', text: '如果没有结果，页面仍提供使用说明和相关指南，不应在纯空结果区域投放广告。' },
        { heading: '工作原理', text: '在搜索框中输入 App Store 应用 ID、Bundle ID 或应用名称。工具调用 iTunes Search API（公开、有限速）获取官方应用素材的最高分辨率——通常为 1024×1024 像素。同时拉取应用名称、开发者、内容评级和 App Store 链接。图标 URL 从 artworkUrl100 字段提取并自动升级至 1024px 版本。搜索结果会缓存在浏览器会话中，避免重复请求。' },
        { heading: '常见问题排查', text: '搜索无结果：iTunes Search API 可能对频繁请求施加限速，或对区域限制的应用返回空结果。等待 30 秒后重试，或前往 App Store 页面确认应用 ID 是否正确。 || 图标分辨率低：部分应用未提供 1024px 素材，工具会回退到最高可用分辨率（512px 或 256px）。这并非错误，只是开发者未上传更大尺寸的资产。 || 返回错误应用：如果按名称搜索，可能返回多个匹配结果。使用精确的 App Store 应用 ID（数字）可获得唯一结果。' },
        { heading: '署名与合理使用边界', text: '图标可用于原型、对比表与内部设计探索，并附 App Store 链接。不要把图标放进竞品商店客户端、钓鱼页，或暗示 Apple/开发者背书的广告。' }
      ],
      links: [{ href: '/guides', label: 'App 识别指南' }, { href: '/glossary', label: 'Bundle ID 与图标术语' }, { href: '/knowledge', label: '安全知识库' }],
      linksLabel: '相关阅读'
    },
    subcost: {
      title: '如何估算真实订阅成本',
      intro: '周付价格在换算成年成本前看起来总是很小。这个计算器把周付、月付和年付统一成可比较的月成本与年成本，帮助你判断试用或付费方案是否匹配真实使用。',
      items: [
        { heading: '为什么要做年化', text: '4.99 的周付方案在税前大约等于每年 259.48。用户常拿周价格和年付解锁直接比，结果选错。先把所有报价换算到同一时间基准。' },
        { heading: '只统计仍在花钱的方案', text: '已暂停、已取消但未到期、以及家庭共享方案容易干扰总数。只勾选仍产生真实支出的项目，并用备注记录试用结束日和取消路径。' },
        { heading: '本地隐私设计', text: '只有点击保存时，列表才会写入浏览器 localStorage。可导出 JSON 到表格工具。数据不会上传到 Storewise 服务器。' },
        { heading: '这个工具做不到什么', text: '它不能读取你的 Apple 账户、不能取消订阅，也不能自动计入税费。最终金额和续费日期请到“设置 > Apple ID > 订阅”和 App Store 结算页确认。' },
        { heading: '推荐流程', text: '1）列出全部循环方案；2）年化成本；3）打开对应清单；4）取消低价值项目；5）下周复查。建议配合“买断 vs 订阅”和“订阅疲劳”文章一起使用。' },
        { heading: '家庭堆叠视角', text: '按人与设备列计划，而不只按应用名。组织者卡上两个个人 VPN 仍是一个家庭问题。在加新试用前，先限制 AI、相册、VPN 有效席位数量。' },
        { heading: '季度淘汰清单', text: '每 90 天按上月使用时长强制排序。倒数两个除非涉及安全或家庭安全，否则作为取消候选。每次取消后重跑计算器。' }
      ],
      links: [{ href: '/price', label: '价格对比' }, { href: '/checklists', label: '决策清单' }, { href: '/articles/when-paid-app-beats-subscription', label: '买断 vs 订阅' }, { href: '/articles/spot-subscription-fatigue-apps', label: '订阅疲劳' }, { href: '/articles/manage-apple-subscriptions-after-trial', label: '试用后管理' }],
      linksLabel: '相关阅读'
    },
    trial: {
      title: '如何生成免费试用取消提醒',
      intro: '多数试用陷阱来自没有写下结束日。本页把开始日期和试用天数转成取消截止日、提醒日、日历文案和简短行动清单。',
      items: [
        { heading: '尽量在最后一天前取消', text: '很多方案需要至少提前 24 小时取消。工具会建议在试用结束前一天作为最晚取消日，并在可能时再提前一天提醒。' },
        { heading: '保留前先把续费年化', text: '如果周付看起来便宜，先换算成年成本。决定是否保留试用时，可配合订阅成本计算器一起看。' },
        { heading: '家庭设备需要额外控制', text: '共用 iPad 上仅有提醒不够。复查购买前询问和屏幕使用时间购买限制，避免同一试用路径静默重启。' },
        { heading: '这个工具做不到什么', text: '它不能读取 Apple 订阅、不能直接创建系统日历事件，也不能取消扣费。请把文案复制到自己的日历/备忘录，并在 Apple 设置中确认真实方案。' },
        { heading: '建议的下一步', text: '生成提醒包，设置日历提醒；价值不清就取消；然后每月复查成本。若后续需要报告问题，保留截图。' },
        { heading: '点开始试用前先截图报价', text: '截下价格、周期、免费天数与细则。若界面与产品页不一致，以确认页为准。把截图与最晚取消日放在同一笔记。' },
        { heading: '共用设备与重复试用', text: '部分应用重装或换 Apple ID 后会再次试用。家庭设备上锁定安装与购买，避免已取消试用从另一配置重启。' }
      ],
      links: [{ href: '/subcost', label: '订阅成本' }, { href: '/checklists', label: '决策清单' }, { href: '/articles/free-trial-trap-checklist', label: '试用陷阱清单' }, { href: '/articles/cancel-apple-subscription-step-by-step', label: '取消订阅' }, { href: '/articles/manage-apple-subscriptions-after-trial', label: '试用后管理' }],
      linksLabel: '相关阅读'
    }
  }
};
