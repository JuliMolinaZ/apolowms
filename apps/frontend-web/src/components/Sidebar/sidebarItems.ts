export interface SidebarItem {
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
    subItems: []
  },
  {
    label: 'Users',
    path: '/users',
    icon: 'user.svg',
    subItems: []
  },
  {
    label: 'Titan',
    path: '/titan',
    icon: 'titan-chat-blue.png',
    subItems: []
  },
  {
    label: 'Chat',
    path: '/chat',
    icon: 'chat.svg',
    subItems: []
  },
  {
    label: 'Dashboards',
    path: '/dashboards',
    icon: 'dashboard.svg',
    subItems: []
  },
  {
    label: 'Audits',
    path: '/audits',
    icon: 'audits.svg',
    subItems: []
  },
  {
    label: 'Items',
    path: '/items',
    icon: 'cube.svg',
    subItems: [
      {
        label: 'Mobilizations',
        path: '/items/mobilizations',
        icon: 'cube.svg',
        subItems: []
      }
    ]
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
        subItems: []
      }
    ]
  },
  {
    label: 'Operations',
    path: '/operations',
    icon: 'operations.svg',
    subItems: [
      {
        label: 'Picking (Partial)',
        path: '/operations/picking/partial',
        icon: 'pickin.svg',
        subItems: []
      },
      {
        label: 'Packing',
        path: '/operations/picking/packing',
        icon: 'packing.svg',
        subItems: []
      },
      {
        label: 'Putaway',
        path: '/operations/arrivals/putaway',
        icon: 'putaway.svg',
        subItems: []
      }
    ]
  }
];
