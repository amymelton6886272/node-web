import { useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLang } from '../LanguageContext.jsx';

const SITE = 'https://souk.eu.org';

const metaByRoute = {
  '/': {
    title: 'Wolffy - Apple / iOS 实用工具合集 | App Store 价格对比、限免应用、IP 查询',
    description: 'Wolffy 是轻量 Apple 工具箱，提供 App Store 跨区价格对比、每日限免应用、IAP 内购查询、高清图标搜索、IP 检测、地址生成及 App Store 使用指南。',
  },
  '/price': {
    title: 'App Store 跨区价格对比 - Wolffy',
    description: '比较 App Store 在不同国家和地区的价格差异，查看近似人民币估算，帮助你在购买前做出更明智的决定。',
  },
  '/appfree': {
    title: 'App Store 限免应用 - Wolffy',
    description: '发现今日 App Store 限免应用，附带分类、开发者信息和使用提醒，帮你判断哪些免费应用值得下载。',
  },
  '/iap': {
    title: 'App Store 内购查询 - Wolffy',
    description: '查询 App Store 应用的内购项目，包括一次性购买、订阅和消耗型内购，购买前了解真实成本。',
  },
  '/icon': {
    title: 'App Store 图标搜索 - Wolffy',
    description: '搜索 App Store 应用的高清图标，获取图标链接和开发者信息，用于设计参考和应用识别。',
  },
  '/ip': {
    title: 'IP 地址检测 - Wolffy',
    description: '检测当前 IP 地址的地理位置、运营商信息和网络出口，了解你的网络环境。',
  },
  '/address': {
    title: '地址生成器 - Wolffy',
    description: '生成测试用地址数据，用于表单测试、UI 演示和开发调试，数据保存在浏览器本地。',
  },
  '/guides': {
    title: 'App Store 使用指南 - Wolffy',
    description: 'App Store 实用指南合集：订阅管理、隐私设置、跨区操作、家庭共享等场景的详细教程。',
  },
  '/knowledge': {
    title: 'Apple 安全知识库 - Wolffy',
    description: 'Apple 设备安全知识文章，涵盖网络安全、应用权限、隐私保护和常见风险防范。',
  },
  '/checklists': {
    title: 'App Store 决策清单 - Wolffy',
    description: '购买、订阅、隐私和跨区操作前的实用检查表，帮助你把风险确认清楚再行动。',
  },
  '/glossary': {
    title: 'App Store 术语表 - Wolffy',
    description: 'App Store 和 Apple 生态常用术语解释，包括 Bundle ID、价格等级、内购类型等专业词汇。',
  },
  '/risk': {
    title: '应用风险评估 - Wolffy',
    description: '评估 App Store 应用的安全风险，从权限、更新频率、隐私标签等维度给出综合判断。',
  },
  '/about': {
    title: '关于 Wolffy - 工具说明与团队介绍',
    description: '了解 Wolffy 工具箱的定位、数据来源、使用限制和团队信息。',
  },
  '/contact': {
    title: '联系我们 - Wolffy',
    description: '联系 Wolffy 团队：内容更正、Bug 报告、隐私请求、广告合作等。',
  },
  '/privacy': {
    title: '隐私政策 - Wolffy',
    description: 'Wolffy 隐私政策：我们如何收集、使用和保护你的数据。',
  },
  '/disclaimer': {
    title: '免责声明 - Wolffy',
    description: 'Wolffy 免责声明：工具使用限制、数据来源说明和用户责任。',
  },
};

export function Head({ route }) {
  useEffect(() => {
    const path = route || '/';
    const meta = metaByRoute[path] || metaByRoute['/'];
    const canonical = SITE + path;

    // Update title
    document.title = meta.title;

    // Update or create meta tags
    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', meta.description);
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);

    // Update canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Update structured data
    const ldScript = document.querySelector('script[type="application/ld+json"]');
    if (ldScript) {
      try {
        const ld = JSON.parse(ldScript.textContent);
        if (ld['@type'] === 'WebSite') {
          ld.potentialAction.target = SITE + '/price?q={search_term_string}';
        }
      } catch {}
    }
  }, [route]);

  return null;
}

const breadcrumbNames = {
  '/': null,
  '/price': 'Price Compare',
  '/appfree': 'Free Apps',
  '/iap': 'IAP Lookup',
  '/icon': 'Icon Search',
  '/ip': 'IP Check',
  '/address': 'Address Generator',
  '/guides': 'Guides',
  '/knowledge': 'Knowledge Base',
  '/checklists': 'Checklists',
  '/glossary': 'Glossary',
  '/risk': 'Risk Assessor',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/disclaimer': 'Disclaimer',
};

const breadcrumbNamesZh = {
  '/': null,
  '/price': '价格对比',
  '/appfree': '限免应用',
  '/iap': '内购查询',
  '/icon': '图标搜索',
  '/ip': 'IP 检测',
  '/address': '地址生成',
  '/guides': '使用指南',
  '/knowledge': '知识库',
  '/checklists': '决策清单',
  '/glossary': '术语表',
  '/risk': '风险评估',
  '/about': '关于',
  '/contact': '联系我们',
  '/privacy': '隐私政策',
  '/disclaimer': '免责声明',
};

export function Breadcrumb({ route }) {
  const { lang } = useLang();
  const names = lang === 'zh' ? breadcrumbNamesZh : breadcrumbNames;
  const path = route || '/';
  const name = names[path];
  if (!name) return null;

  const navigate = (href) => (e) => {
    e.preventDefault();
    location.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/" onClick={navigate('/')}>
        <Home size={14} />
        <span>{lang === 'zh' ? '首页' : 'Home'}</span>
      </a>
      <ChevronRight size={14} className="breadcrumbSep" />
      <span className="breadcrumbCurrent">{name}</span>
    </nav>
  );
}
