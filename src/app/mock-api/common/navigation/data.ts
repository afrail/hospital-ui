/* tslint:disable:max-line-length */
import {FuseNavigationItem} from '@fuse/components/navigation';

export const administrationNavigation: FuseNavigationItem[] = [
    {
        id   : 'adm-dashBoard',
        title: 'DashBoard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id   : 'administration',
        title: 'Administration',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/adminstration'
    },
    {
        id      : 'recruitment',
        title   : 'Recruitment',
        icon    : 'heroicons_outline:check-circle',
        type    : 'collapsable',
        children: [
            {
                id      : 'commonLookupMaster',
                title   : 'Common Lookup Master',
                type    : 'basic',
                link : 'common-lookup-master',
            },
            {
                id      : 'commonLookupDetails',
                title   : 'Common Lookup Details',
                type    : 'basic',
                link : '/#'
            },
        ]
    },

    {
        id      : 'hrmStuff',
        title   : 'Record(HRM)- Stuff & Workman ',
        icon    : 'heroicons_outline:check-circle',
        type    : 'collapsable',
        children: [
            {
                id      : 'employeeInformation ',
                title   : 'Employee Information',
                type    : 'basic',
                link : '/#'
            },
            {
                id      : 'leaveType ',
                title   : 'Leave Type ',
                type    : 'basic',
                link : '/#'
            },
        ]
    },

    
];


export const securityNavigation: FuseNavigationItem[] = [
    {
        id   : 'sec-dashBoard',
        title: 'DashBoard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard'
    },
    {
        id   : 'security',
        title: 'Security',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/security'
    },
    {
        id      : 'access-control',
        title   : 'Access Control',
        icon    : 'heroicons_outline:check-circle',
        type    : 'collapsable',
        children: [
            {
                id      : 'dog-kennel',
                title   : 'Dog Kennel',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    {
                        id      : 'dog-profile-entry-form',
                        title   : 'Dog Profile Entry Form',
                        type    : 'basic',
                        link : '/#'
                    },
                    {
                        id      : 'age-range-table ',
                        title   : 'Age Range Table ',
                        type    : 'basic',
                        link : '/#'
                    }
                ]
            },
            {
                id      : 'attendance',
                title   : 'Attendance',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    
                ]
            },
            {
                id      : 'others',
                title   : 'Others',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    
                ]
            }
        ]
    },

    {
        id      : 'clearance',
        title   : 'Clearance',
        icon    : 'heroicons_outline:check-circle',
        type    : 'collapsable',
        children: [
            
        ]
    },

    {
        id      : 'visitorManagement',
        title   : 'Visitor Management',
        icon    : 'heroicons_outline:check-circle',
        type    : 'collapsable',
        children: [
            
        ]
    },

    
];

export const defaultNavigation2: FuseNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Management',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id      : 'navigation-features.level.0',
                title   : 'Project Concept Management',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    {
                        id      : 'navigation-features.level.0.1',
                        title   : 'Project Concept List',
                        type    : 'basic',
                        link : '/project-concept'
                    }
                ]
            }
        ]
    }
];



export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
