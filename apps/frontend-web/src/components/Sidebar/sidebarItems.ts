// src/components/Sidebar/sidebarItems.ts

export interface SidebarItem {
  count: number;
  label: string;
  path: string;
  icon: string;
  subItems: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: 'home-simple.svg',
    subItems: [],
    count: 9,
  },
  {
    label: 'Users',
    path: '/users',
    icon: 'user.svg',
    subItems: [],
    count: 8,
  },
  {
    label: 'Titan',
    path: '/titan',
    icon: 'titan-chat-blue.png',
    subItems: [],
    count: 1,
  },
  {
    label: 'Chat',
    path: '/chat',
    icon: 'chat.svg',
    subItems: [],
    count: 6,
  },
  {
    label: 'Dashboards',
    path: '/dashboards',
    icon: 'dashboard.svg',
    subItems: [],
    count: 10,
  },
  {
    label: 'Audits',
    path: '/audits',
    icon: 'attachment.svg',
    subItems: [],
    count: 8,
  },
  {
    label: 'Items',
    path: '/items',
    icon: 'cube.svg',
    subItems: [
      {
        label: 'Items',
        path: '/items/items',
        icon: 'cube.svg',
        subItems: [],
        count: 3, // número de ítems activos (demo)
      },
      {
        label: 'Stock Movements',
        path: '/items/mobilizations',
        icon: 'cube.svg',
        subItems: [],
        count: 120, // demo de movilizaciones
      },
    ],
    count: 123,
  },
  {
    label: 'Locations',
    path: '/locations',
    icon: 'location.svg',
    subItems: [
      {
        label: 'Warehouses',
        path: '/locations/warehouses',
        icon: 'location.svg',
        subItems: [],
        count: 30,
      },
    ],
    count: 30,
  },
  {
    label: 'Operations',
    path: '/operations',
    icon: 'cube.svg',
    subItems: [
      {
        label: 'Picking (Partial)',
        path: '/operations/picking/partial',
        icon: 'pickin.svg',
        subItems: [],
        count: 3,
      },
      {
        label: 'Packing',
        path: '/operations/picking/packing',
        icon: 'packing.svg',
        subItems: [],
        count: 6,
      },
      {
        label: 'Putaway',
        path: '/operations/arrivals/putaway',
        icon: 'putaway.svg',
        subItems: [],
        count: 10,
      },
    ],
    count: 19,
  },
];
