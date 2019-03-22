export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: any;
  title?: boolean;
  children?: any;
  variant?: string;
  attributes?: object;
  divider?: boolean;
  class?: string;
}

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },  
  {
    name: 'Reports',
    url: '/reports',
    icon: 'fa fa-line-chart',
    children: [
      {
        name: 'Participation',
        url: '/reports/participation',
        icon: 'fa fa-bar-chart'
      }, 
      {
        name: 'Engagement',
        url: '/reports/engagement',        
         icon: 'fa fa-pie-chart'
      },
      {
        name: 'Retention',
        url: '/reports/retention',
        icon: 'fa fa-signal'
      },
      {
        name: 'Acquisition',
        url: '/reports/acquisition',
         icon: 'fa fa-area-chart'       
      },
      {
        name: 'General',
        url: '/reports/generic',
        icon: 'icon-chart'
      }
    ]
  },
  {
    name: 'File Upload',
    url: '/fileupload',
    icon: 'fa fa-cloud-upload'
  },
  {
    name: 'Users',
    url: '/users',
    icon: 'icon-user-follow',
  },
  {
    name: 'Settings',
    url: '/settings',
    icon: 'icon-settings'
  },
];
