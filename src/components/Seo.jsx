import { useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLang } from '../LanguageContext.jsx';
import { getArticle } from '../data/articles.js';

const SITE = 'https://souk.eu.org';

const routeMeta = {
  '/': {
    en: ['Wolffy - Apple / iOS Toolkit', 'Compare App Store prices, inspect IAP signals, discover free apps, search icons, check IP details, and read practical Apple safety guides.'],
    zh: ['Wolffy - Apple / iOS 工具箱', '提供 App Store 跨区价格对比、限免应用发现、内购查询、图标搜索、IP 检测、测试地址生成和 Apple 安全指南。'],
  },
  '/price': {
    en: ['App Store Price Compare - Wolffy', 'Compare App Store prices across regions and understand currency differences before buying.'],
    zh: ['App Store 价格对比 - Wolffy', '比较 App Store 在不同国家和地区的价格差异，购买前了解真实成本。'],
  },
  '/appfree': {
    en: ['Limited-Time Free Apps - Wolffy', 'Discover limited-time free and discounted App Store apps with practical review notes.'],
    zh: ['App Store 限免应用 - Wolffy', '发现限时免费和折扣应用，并结合分类、开发者和风险提示做判断。'],
  },
  '/iap': {
    en: ['IAP Lookup - Wolffy', 'Look up App Store app metadata and in-app purchase signals before paying or subscribing.'],
    zh: ['App Store 内购查询 - Wolffy', '查询应用定价、Bundle ID 和内购标记，购买或订阅前了解成本。'],
  },
  '/icon': {
    en: ['App Store Icon Search - Wolffy', 'Search App Store apps and copy high-resolution icon links for reference.'],
    zh: ['App Store 图标搜索 - Wolffy', '搜索应用并获取高清图标链接，用于识别、设计参考和资料整理。'],
  },
  '/ip': {
    en: ['IP Check - Wolffy', 'Check outbound IP address, region, ASN, ISP, and basic connectivity signals.'],
    zh: ['IP 地址检测 - Wolffy', '检测当前出口 IP、地理位置、ASN、运营商和基础连通性。'],
  },
  '/address': {
    en: ['Address Generator - Wolffy', 'Generate realistic test address data locally for forms, UI mockups, and development workflows.'],
    zh: ['地址生成器 - Wolffy', '在浏览器本地生成测试地址数据，用于表单测试、界面演示和开发调试。'],
  },
  '/guides': {
    en: ['App Store Guides - Wolffy', 'Read practical App Store guides for subscriptions, privacy, refunds, family devices, and region decisions.'],
    zh: ['App Store 使用指南 - Wolffy', '阅读订阅管理、隐私设置、退款、家庭设备和跨区操作等实用指南。'],
  },
  '/knowledge': {
    en: ['Apple Safety Knowledge Base - Wolffy', 'Plain-language Apple safety articles about permissions, privacy labels, subscriptions, refunds, and common risks.'],
    zh: ['Apple 安全知识库 - Wolffy', '覆盖权限、隐私标签、订阅、退款和常见风险的 Apple 安全知识文章。'],
  },
  '/checklists': {
    en: ['Decision Checklists - Wolffy', 'Use practical checklists before buying apps, starting subscriptions, reviewing privacy, or switching regions.'],
    zh: ['决策清单 - Wolffy', '在购买应用、开始订阅、检查隐私或切换地区前使用实用清单降低风险。'],
  },
  '/glossary': {
    en: ['App Store Glossary - Wolffy', 'Understand common Apple and App Store terms including Bundle ID, IAP, TestFlight, price tiers, and family sharing.'],
    zh: ['App Store 术语表 - Wolffy', '理解 Bundle ID、内购、TestFlight、价格等级、家庭共享等常见 Apple 生态术语。'],
  },
  '/risk': {
    en: ['App Risk Assessor - Wolffy', 'Review common risk signals before installing apps or granting sensitive permissions.'],
    zh: ['应用风险评估 - Wolffy', '从权限、更新、开发者、订阅和隐私标签等维度评估应用风险。'],
  },
  '/about': {
    en: ['About Wolffy', 'Learn what Wolffy is, how it handles data sources, and how to contact the maintainer.'],
    zh: ['关于 Wolffy', '了解 Wolffy 的定位、数据来源、使用限制和维护者联系方式。'],
  },
  '/contact': {
    en: ['Contact Wolffy', 'Contact the Wolffy maintainer for corrections, bug reports, privacy questions, or advertising inquiries.'],
    zh: ['联系 Wolffy', '联系维护者反馈内容更正、Bug、隐私请求或广告合作问题。'],
  },
  '/privacy': {
    en: ['Privacy Policy - Wolffy', 'Learn what Wolffy stores locally, which third-party requests may occur, and how advertising scripts may be used.'],
    zh: ['隐私政策 - Wolffy', '说明 Wolffy 的本地存储、第三方请求、广告脚本和用户选择。'],
  },
  '/disclaimer': {
    en: ['Disclaimer - Wolffy', 'Important limitations, data source notes, and user responsibility for Wolffy tools and guides.'],
    zh: ['免责声明 - Wolffy', '说明工具使用限制、数据来源限制和用户责任。'],
  },
  '/terms': {
    en: ['Terms of Use - Wolffy', 'Rules and limitations for using Wolffy tools, guides, generated data, external links, and third-party services.'],
    zh: ['服务条款 - Wolffy', '说明使用 Wolffy 工具、指南、生成数据、外部链接和第三方服务时的规则与限制。'],
  },
  '/editorial': {
    en: ['Editorial Policy - Wolffy', 'How Wolffy writes, reviews, labels, and corrects content for Apple and App Store research.'],
    zh: ['编辑政策 - Wolffy', '说明 Wolffy 如何撰写、审核、标注和更正 Apple 与 App Store 研究内容。'],
  },
  '/data-sources': {
    en: ['Data Sources - Wolffy', 'Where Wolffy may obtain app, price, IP, address-format, and safety reference information.'],
    zh: ['数据来源 - Wolffy', '说明 Wolffy 可能使用的应用、价格、IP、地址格式和安全参考信息来源。'],
  },
  '/articles': {
    en: ['Articles - Wolffy', 'Practical Apple and App Store research articles for safer purchasing, privacy, and account decisions.'],
    zh: ['文章 - Wolffy', '围绕购买、隐私、账号和 App Store 决策的实用 Apple 研究文章。'],
  },
};

const names = Object.fromEntries(Object.entries(routeMeta).map(([path, value]) => [path, value.en[0].replace(' - Wolffy', '')]));
const namesZh = Object.fromEntries(Object.entries(routeMeta).map(([path, value]) => [path, value.zh[0].replace(' - Wolffy', '')]));
names['/'] = null;
namesZh['/'] = null;

export function Head({ route }) {
  const { lang } = useLang();

  useEffect(() => {
    const path = route || '/';
    const articleSlug = path.startsWith('/articles/') ? path.split('/')[2] : '';
    const article = articleSlug ? getArticle(articleSlug) : null;
    const metaSet = routeMeta[path] || routeMeta['/articles'] || routeMeta['/'];
    const [title, description] = metaSet[lang === 'zh' ? 'zh' : 'en'];
    const finalTitle = article ? `${article.title} - Wolffy` : title;
    const finalDescription = article ? article.description : description;
    const canonical = SITE + path;

    document.title = finalTitle;

    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', finalDescription);
    setMeta('og:title', finalTitle, 'property');
    setMeta('og:description', finalDescription, 'property');
    setMeta('og:image', `${SITE}/og-image.svg`, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('og:locale', lang === 'zh' ? 'zh_CN' : 'en_US', 'property');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    let bcScript = document.getElementById('breadcrumb-ld');
    if (!bcScript) {
      bcScript = document.createElement('script');
      bcScript.type = 'application/ld+json';
      bcScript.id = 'breadcrumb-ld';
      document.head.appendChild(bcScript);
    }

    if (path === '/') {
      bcScript.textContent = '';
      return;
    }

    const routeNames = lang === 'zh' ? namesZh : names;
    bcScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'zh' ? '首页' : 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: article?.title || routeNames[path] || path.slice(1), item: canonical },
      ],
    });
  }, [route, lang]);

  return null;
}

export function Breadcrumb({ route }) {
  const { lang } = useLang();
  const routeNames = lang === 'zh' ? namesZh : names;
  const path = route || '/';
  const name = routeNames[path];
  if (!name) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/">
        <Home size={14} />
        <span>{lang === 'zh' ? '首页' : 'Home'}</span>
      </a>
      <ChevronRight size={14} className="breadcrumbSep" />
      <span className="breadcrumbCurrent">{name}</span>
    </nav>
  );
}
