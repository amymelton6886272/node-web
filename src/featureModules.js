// 功能模块展示配置
// 按功能分组排序：价格工具 → 视觉 → 网络工具 → 内容资源
// enabled: false 后，该模块会从首页卡片、侧边栏导航和路由中隐藏。
export const featureModules = [
  {
    id: 'accounts',
    icon: 'users',
    enabled: false,
  },
  // 价格工具
  {
    id: 'price',
    icon: 'scale',
    enabled: true,
  },
  {
    id: 'iap',
    icon: 'search',
    enabled: true,
  },
  {
    id: 'appfree',
    icon: 'gift',
    enabled: true,
  },
  // 视觉
  {
    id: 'icon',
    icon: 'image',
    enabled: true,
  },
  // 网络工具
  {
    id: 'ip',
    icon: 'wifi',
    enabled: true,
  },
  {
    id: 'address',
    icon: 'mapPin',
    enabled: true,
  },
  {
    id: 'proxy',
    icon: 'fileCode',
    enabled: false,
  },
  // 内容资源
  {
    id: 'knowledge',
    icon: 'library',
    enabled: true,
  },
  {
    id: 'risk',
    icon: 'shieldCheck',
    enabled: true,
  },
  {
    id: 'checklists',
    icon: 'clipboardList',
    enabled: true,
  },
  {
    id: 'guides',
    icon: 'bookOpen',
    enabled: true,
  },
  {
    id: 'glossary',
    icon: 'bookOpen',
    enabled: true,
  },
];
