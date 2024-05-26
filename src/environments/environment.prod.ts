// export NODE_OPTIONS=--max_old_space_size=4096;




export const environment = {
    production: true,
    // domain   : '103.112.238.22',
    // domain   : 'boferp.ibcs-primax.com', // IBCS server
    // domain   : '172.16.1.243', // BOF server
    ibcs: {
        baseApiEndPoint: 'http://localhost:8082/',
        // baseApiEndPoint: 'http://192.168.1.2:9020/bof-erp-server/', // IBCS server
        // baseApiEndPoint: 'http://172.16.1.243:9020/bof-erp-server/', // BOF server
        apiEndPoint: 'api/',
        moduleCommon: 'common/',
        moduleSystemAdmin: 'sya/',
    },
    // clientid: 'ibcsplanningidsdp',
    // clientSecret: 'planningIdsdpsha$@#929%',
};
