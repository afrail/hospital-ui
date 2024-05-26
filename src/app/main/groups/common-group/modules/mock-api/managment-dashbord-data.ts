export const project = {
    githubIssues      : {
        overview: {
            'this-week': {
                'new-issues'   : 214,
                'closed-issues': 75,
                'fixed'        : 3,
                'wont-fix'     : 4,
                're-opened'    : 8,
                'needs-triage' : 6,
                'needs-finishing' : 6
            },
            'last-week': {
                'new-issues'   : 197,
                'closed-issues': 72,
                'fixed'        : 6,
                'wont-fix'     : 11,
                're-opened'    : 6,
                'needs-triage' : 5,
                'needs-finishing' : 6
            }
        },

        labels  : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series  : {
            'this-week': [
                {
                    name: 'New issues',
                    type: 'bar',
                    data: [70, 60, 50, 40, 30, 20, 10]
                },
            ],
            'last-week': [
                {
                    name: 'New issues',
                    type: 'bar',
                    data: [10, 20, 30, 40, 50, 60, 70]
                },
            ]
        }
    },

    githubIssues2      : {
        labels  : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series  : {
            'this-week': [
                {
                    name: 'New issues',
                    type: 'column',
                    data: [10, 20, 30, 40, 50, 60, 70]
                },
                {
                    name: 'Closed issues',
                    type: 'column',
                    data: [15, 25, 35, 45, 55, 65, 75]
                }
            ],
            'last-week': [
                {
                    name: 'New issues',
                    type: 'column',
                    data: [30, 18, 33, 24, 10, 15, 12]
                },
                {
                    name: 'Closed issues',
                    type: 'column',
                    data: [1, 11, 10, 5, 10, 20, 20]
                }
            ],
        }
    },

    gender             : {
        uniqueVisitors: 46085,
        no            : ['Order No 02', 'Order No 01'],
        series        : {
            'this-week': [55, 45],
            'last-week': [45, 55]
        },
        labels        : [
            'Complete',
            'Pending'
        ]
    }
};
