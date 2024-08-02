// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// export NODE_OPTIONS=--max-old-space-size=16384;

export const environment = {
    production: false,
    // hmr       : false,
    // domain   : '103.112.238.22',
    ibcs: {
        // baseApiEndPoint: 'https://202.161.191.133:9020/hospital-server/', // live
        baseApiEndPoint: 'http://localhost:8082/', // local host
        apiEndPoint: 'api/',
        moduleHRM: 'hrm/',
        moduleACCESS: 'acc/',
        moduleCLEARANCE: 'clearance/',
        moduleICT: 'ict/',
        moduleCommon: 'common/',
        moduleRecuiment: 'rec/',
        moduleClearance: 'clr/',
        moduleSystemAdmin: 'sya/',
        moduleFinance: 'fin/',
        moduleDrawing: 'drw/',
        moduleRationAndWelfare: 'raw/',
        moduleBudget: 'budget/',
        moduleEHM: 'hospital/',
    },
    // clientid: 'ibcsplanningidsdp',
    // clientSecret: 'planningIdsdpsha$@#929%'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
