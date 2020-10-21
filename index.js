const axios = require('axios');

function generatePromise(servers) {
    return servers.map(server => {
        return new Promise((resolve, reject) => {
            axios.get(server.url, {timeout: 5*1000})
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    });
}

function createUrlPriorityHash(servers){
    let hash = {};
    servers.forEach(function(server){
        hash[server.url] = server.priority;
    });
    return hash;
}

function getLowPriorityServer(onlineServers, servers) {
    let serverHash = createUrlPriorityHash(servers);
    let min = {
        url: onlineServers[0],
        priority: serverHash[onlineServers[0]]
    }
    onlineServers.forEach(server => {
        if(serverHash[server] < min.priority){
            min.url = server;
            min.priority = serverHash[server]
        }
    });
    return min;
}

async function findServer(servers){
    try{
        let promises = generatePromise(servers);
        let results = await Promise.allSettled(promises);
        // filter all the fulfilled promises
        results = results.filter(result => result.status === 'fulfilled'); 
        // filter on the basis of status code range between 200 to 299
        results = results.filter(result => result.value.status >= 200 && result.value.status <= 299);
        // get the url list of the server which is online
        if(results.length === 0) return Promise.reject("All the servers are offline");
        results = results.map(result => result.value.config.url);
        results = getLowPriorityServer(results, servers);
        return Promise.resolve(results);
    } catch(err){
        return Promise.reject(err);
    }
}

module.exports = {
    findServer,
    getLowPriorityServer,
    createUrlPriorityHash,
    generatePromise
}