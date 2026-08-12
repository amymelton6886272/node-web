export const SITE = 'https://souk.eu.org';

export const navItems = [
  { href: '/', label: 'Home', labelZh: '首页' },
  { href: '/articles', label: 'Articles', labelZh: '文章' },
  { href: '/series', label: 'Series', labelZh: '系列' },
  { href: '/knowledge', label: 'Knowledge', labelZh: '知识库' },
  { href: '/about', label: 'About', labelZh: '关于' },
];

/**
 * Sidebar order is content-first for quality-review signal:
 * Content (read) → Decide (act) → Tools (utilities).
 */
export const sidebarItems = [
  // Content first — long-form reading
  { href: '/articles', label: 'Articles', labelZh: '文章', icon: '📚', desc: 'Research guides & playbooks', descZh: '研究指南与实操手册' },
  { href: '/series', label: 'Series', labelZh: '系列', icon: '🧭', desc: 'Ordered reading paths', descZh: '有序阅读路径' },
  { href: '/knowledge', label: 'Knowledge', labelZh: '知识库', icon: '🧠', desc: 'Concepts and explainers', descZh: '常见概念与基础说明' },
  { href: '/guides', label: 'Guides', labelZh: '指南', icon: '🛠️', desc: 'Step-by-step help', descZh: '按步骤完成常见任务' },
  // Decide next — decision aids
  { href: '/risk', label: 'App Risk', labelZh: '应用风险', icon: '⚠️', desc: 'Permission risk review', descZh: '评估权限与风险点' },
  { href: '/checklists', label: 'Checklists', labelZh: '检查清单', icon: '✅', desc: 'Before-you-act lists', descZh: '用清单减少操作遗漏' },
  { href: '/glossary', label: 'Glossary', labelZh: '术语表', icon: '🔤', desc: 'Plain definitions', descZh: '用更直白的话解释术语' },
];

export const sidebarGroups = [
  {
    label: 'Content',
    labelZh: '内容',
    items: sidebarItems.slice(0, 4),
  },
  {
    label: 'Decide',
    labelZh: '决策',
    items: sidebarItems.slice(4, 7),
  },
];

export function isActive(currentPath, href) {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
