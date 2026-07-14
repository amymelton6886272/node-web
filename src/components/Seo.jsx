import { useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useLang } from '../LanguageContext.jsx';
import { getArticle } from '../data/articles.js';

const SITE = 'https://souk.eu.org';

const routeMeta = {
  '/': {
    en: ['Storewise - Apple / iOS Toolkit', 'Compare App Store prices, discover free apps, search icons, check IP details, and read practical Apple safety guides.'],
    zh: ['Storewise - Apple / iOS 工具箱', '提供 App Store 跨区价格对比、限免应用发现、图标搜索、IP 检测、测试地址生成和 Apple 安全指南。'],
  },
  '/price': {
    en: ['App Store Subscription Compare - Storewise', 'Search an app once, then compare the app itself and public subscription prices across regions.'],
    zh: ['App Store 订阅比价 - Storewise', '搜索一次应用后，对比软件本体与公开订阅项目在多个热门地区的价格。'],
  },
  '/appfree': {
    en: ['Limited-Time Free Apps - Storewise', 'Discover limited-time free and discounted App Store apps with practical review notes.'],
    zh: ['App Store 限免应用 - Storewise', '发现限时免费和折扣应用，并结合分类、开发者和风险提示做判断。'],
  },
  '/icon': {
    en: ['App Store Icon Search - Storewise', 'Search App Store apps and copy high-resolution icon links for reference.'],
    zh: ['App Store 图标搜索 - Storewise', '搜索应用并获取高清图标链接，用于识别、设计参考和资料整理。'],
  },
  '/ip': {
    en: ['IP Check - Storewise', 'Check outbound IP address, region, ASN, ISP, and basic connectivity signals.'],
    zh: ['IP 地址检测 - Storewise', '检测当前出口 IP、地理位置、ASN、运营商和基础连通性。'],
  },
  '/address': {
    en: ['Address Generator - Storewise', 'Generate realistic test address data locally for forms, UI mockups, and development workflows.'],
    zh: ['地址生成器 - Storewise', '在本地生成测试地址数据，用于表单、界面演示和开发调试。'],
  },
  '/guides': {
    en: ['App Store Guides - Storewise', 'Read practical App Store guides for subscriptions, privacy, refunds, family devices, and region decisions.'],
    zh: ['App Store 使用指南 - Storewise', '阅读订阅、隐私、退款、家庭设备和跨区决策相关的实用指南。'],
  },
  '/knowledge': {
    en: ['Apple Safety Knowledge Base - Storewise', 'Plain-language Apple safety articles about permissions, privacy labels, subscriptions, refunds, and common risks.'],
    zh: ['Apple 安全知识库 - Storewise', '以通俗语言整理权限、隐私标签、订阅、退款和常见风险内容。'],
  },
  '/checklists': {
    en: ['Decision Checklists - Storewise', 'Use practical checklists before buying apps, starting subscriptions, reviewing privacy, or switching regions.'],
    zh: ['决策清单 - Storewise', '在购买应用、开始订阅、检查隐私或切换地区前使用实用清单。'],
  },
  '/glossary': {
    en: ['App Store Glossary - Storewise', 'Understand common Apple and App Store terms including Bundle ID, IAP, TestFlight, price tiers, and family sharing.'],
    zh: ['App Store 术语表 - Storewise', '理解 Bundle ID、IAP、TestFlight、价格等级和家庭共享等常见术语。'],
  },
  '/risk': {
    en: ['App Risk Assessor - Storewise', 'Review common risk signals before installing apps or granting sensitive permissions.'],
    zh: ['应用风险评估 - Storewise', '从权限、更新、开发者、订阅和隐私标签等维度评估应用风险。'],
  },
  '/about': {
    en: ['About Storewise', 'Learn what Storewise is, how it handles data sources, and how to contact the maintainer.'],
    zh: ['关于 Storewise', '了解 Storewise 的定位、数据来源和维护者联系方式。'],
  },
  '/contact': {
    en: ['Contact Storewise', 'Contact the Storewise maintainer for corrections, bug reports, privacy questions, or advertising inquiries.'],
    zh: ['联系 Storewise', '提交更正、Bug 反馈、隐私问题或合作咨询。'],
  },
  '/privacy': {
    en: ['Privacy Policy - Storewise', 'Learn what Storewise stores locally, which third-party requests may occur, and how advertising scripts may be used.'],
    zh: ['隐私政策 - Storewise', '说明本地存储、第三方请求以及广告脚本的使用边界。'],
  },
  '/disclaimer': {
    en: ['Disclaimer - Storewise', 'Important limitations, data source notes, and user responsibility for Storewise tools and guides.'],
    zh: ['免责声明 - Storewise', '说明工具使用限制、数据来源边界和用户责任。'],
  },
  '/terms': {
    en: ['Terms of Use - Storewise', 'Rules and limitations for using Storewise tools, guides, generated data, external links, and third-party services.'],
    zh: ['服务条款 - Storewise', '说明使用 Storewise 工具、指南、生成数据、外部链接和第三方服务时的规则与限制。'],
  },
  '/editorial': {
    en: ['Editorial Policy - Storewise', 'How Storewise writes, reviews, labels, and corrects content for Apple and App Store research.'],
    zh: ['编辑政策 - Storewise', '说明 Storewise 如何撰写、审核、标注和更正 Apple 与 App Store 研究内容。'],
  },
  '/data-sources': {
    en: ['Data Sources - Storewise', 'Where Storewise may obtain app, price, IP, address-format, and safety reference information.'],
    zh: ['数据来源 - Storewise', '说明 Storewise 可能使用的应用、价格、IP、地址格式和安全参考信息来源。'],
  },
  '/articles': {
    en: ['Articles - Storewise', 'Practical Apple and App Store research articles for safer purchasing, privacy, and account decisions.'],
    zh: ['文章 - Storewise', '围绕购买、隐私、账号和 App Store 决策的实用文章。'],
  },
};

const names = Object.fromEntries(Object.entries(routeMeta).map(([path, value]) => [path, value.en[0].replace(' - Storewise', '')]));
const namesZh = Object.fromEntries(Object.entries(routeMeta).map(([path, value]) => [path, value.zh[0].replace(' - Storewise', '')]));
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
    const finalTitle = article ? `${article.title} - Storewise` : title;
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

    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('description', finalDescription);
    setMeta('og:title', finalTitle, 'property');
    setMeta('og:description', finalDescription, 'property');
    setMeta('og:url', canonical, 'property');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setLink('canonical', canonical);
  }, [lang, route]);

  return null;
}

export function Breadcrumb({ route }) {
  const { lang } = useLang();
  const path = route || '/';
  const segments = path.split('/').filter(Boolean);

  if (!segments.length) return null;

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = lang === 'zh' ? namesZh[href] : names[href];
    return { href, label: label || segment };
  });

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <a href="/"><Home size={14} /></a>
      {crumbs.map((crumb) => (
        <span key={crumb.href}>
          <ChevronRight size={14} />
          <a href={crumb.href}>{crumb.label}</a>
        </span>
      ))}
    </nav>
  );
}
