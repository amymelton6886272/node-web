export const SITE = 'https://souk.eu.org';

export const navItems = [
  { href: '/', label: 'Home', labelZh: '首页' },
  { href: '/articles', label: 'Articles', labelZh: '文章' },
  { href: '/about', label: 'About', labelZh: '关于' },
  { href: '/contact', label: 'Contact', labelZh: '联系' },
  { href: '/privacy', label: 'Privacy', labelZh: '隐私' },
  { href: '/terms', label: 'Terms', labelZh: '条款' },
];

export const sidebarItems = [
  { href: '/price', label: 'Price Compare', labelZh: '价格对比', icon: '$', desc: 'Regional price checks', descZh: '多地区价格参考' },
  { href: '/iap', label: 'IAP Lookup', labelZh: '内购查询', icon: 'I', desc: 'Subscriptions and trials', descZh: '订阅与试用判断' },
  { href: '/appfree', label: 'Free Apps', labelZh: '限免应用', icon: 'F', desc: 'Limited-time deals', descZh: '限时免费发现' },
  { href: '/icon', label: 'Icon Lookup', labelZh: '图标查询', icon: 'A', desc: 'App identity lookup', descZh: '应用身份识别' },
  { href: '/ip', label: 'IP Check', labelZh: 'IP 检测', icon: 'IP', desc: 'Network location clues', descZh: '网络位置线索' },
  { href: '/address', label: 'Address', labelZh: '地址生成', icon: '@', desc: 'Regional test data', descZh: '地区测试数据' },
  { href: '/knowledge', label: 'Knowledge', labelZh: '知识库', icon: 'K', desc: 'Concepts and explainers', descZh: '概念与说明' },
  { href: '/articles', label: 'Articles', labelZh: '文章', icon: 'R', desc: 'Practical reading', descZh: '实用阅读内容' },
  { href: '/risk', label: 'App Risk', labelZh: '应用风险', icon: '!', desc: 'Permission risk review', descZh: '权限风险评估' },
  { href: '/checklists', label: 'Checklists', labelZh: '检查清单', icon: 'C', desc: 'Before-you-act lists', descZh: '行动前核对' },
  { href: '/guides', label: 'Guides', labelZh: '指南', icon: 'G', desc: 'Step-by-step help', descZh: '分步帮助' },
  { href: '/glossary', label: 'Glossary', labelZh: '术语表', icon: 'T', desc: 'Plain definitions', descZh: '通俗定义' },
];

export const sidebarGroups = [
  {
    label: 'Tools',
    labelZh: '工具',
    items: sidebarItems.slice(0, 6),
  },
  {
    label: 'Learn',
    labelZh: '学习',
    items: sidebarItems.slice(6, 8),
  },
  {
    label: 'Decide',
    labelZh: '决策',
    items: sidebarItems.slice(8),
  },
];

export function isActive(currentPath, href) {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
