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
  { href: '/price', label: 'Subscription Compare', labelZh: '订阅比价', icon: '$', desc: 'Base app and subscription prices', descZh: '查看软件本体与订阅项目的各区价格' },
  { href: '/appfree', label: 'Free Apps', labelZh: '限免应用', icon: 'F', desc: 'Limited-time deals', descZh: '发现限时免费的应用与游戏' },
  { href: '/icon', label: 'Icon Lookup', labelZh: '图标查询', icon: 'A', desc: 'App identity lookup', descZh: '快速识别应用图标与来源' },
  { href: '/ip', label: 'IP Check', labelZh: 'IP 检测', icon: 'IP', desc: 'Network location clues', descZh: '判断网络出口与地区信息' },
  { href: '/address', label: 'Address', labelZh: '地址生成', icon: '@', desc: 'Regional test data', descZh: '生成不同地区的测试地址资料' },
  { href: '/subcost', label: 'Sub Cost', labelZh: '订阅成本', icon: '¥', desc: 'Monthly/yearly estimate', descZh: '估算订阅月成本与年成本' },
  { href: '/trial', label: 'Trial Reminder', labelZh: '试用提醒', icon: 'D', desc: 'Cancel deadline builder', descZh: '生成试用取消提醒与日历文案' },
  { href: '/knowledge', label: 'Knowledge', labelZh: '知识库', icon: 'K', desc: 'Concepts and explainers', descZh: '整理常见概念与基础说明' },
  { href: '/articles', label: 'Articles', labelZh: '文章', icon: 'R', desc: 'Practical reading', descZh: '浏览更新中的实用内容' },
  { href: '/risk', label: 'App Risk', labelZh: '应用风险', icon: '!', desc: 'Permission risk review', descZh: '评估权限、隐私与风险点' },
  { href: '/checklists', label: 'Checklists', labelZh: '检查清单', icon: 'C', desc: 'Before-you-act lists', descZh: '用清单减少操作遗漏' },
  { href: '/guides', label: 'Guides', labelZh: '指南', icon: 'G', desc: 'Step-by-step help', descZh: '按步骤完成常见任务' },
  { href: '/glossary', label: 'Glossary', labelZh: '术语表', icon: 'T', desc: 'Plain definitions', descZh: '用更直白的话解释术语' },
];

export const sidebarGroups = [
  {
    label: 'Tools',
    labelZh: '工具',
    items: sidebarItems.slice(0, 7),
  },
  {
    label: 'Learn',
    labelZh: '内容',
    items: sidebarItems.slice(7, 9),
  },
  {
    label: 'Decide',
    labelZh: '决策',
    items: sidebarItems.slice(9),
  },
];

export function isActive(currentPath, href) {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
