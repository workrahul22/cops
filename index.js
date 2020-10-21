const axios = require('axios');

// Generate multiple promise to perform get operation in parallel
function generatePromise(servers) {
    return servers.map(server => {
        return new Promise((resolve, reject) => {
            axios.get(server.url, {timeout: 5*1000}) // default timeout for the getrequest is 5s
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    });
}


// Create and hash map considering url as key and priority as value
// Use this hash to map the online server with the priority given
function createUrlPriorityHash(servers){
    let hash = {};
    servers.forEach(function(server){
        hash[server.url] = server.priority;
    });
    return hash;
}


// Find the online server which has th lowest priority.
function getLowPriorityServer(onlineServers, servers) {

    // create an hash to compare and find minimum priority server
    let serverHash = createUrlPriorityHash(servers);

    // Initialization of min
    let min = {
        url: onlineServers[0],
        priority: serverHash[onlineServers[0]]
    }

    // find out the minimum priority server
    onlineServers.forEach(server => {
        if(serverHash[server] < min.priority){
            min.url = server;
            min.priority = serverHash[server]
        }
    });
    return min;
}


// fetchServer function to check online server and return with lowest priority
async function findServer(servers){
    try{

        // Generate the array of promises to run in parallel
        let promises = generatePromise(servers);

        // Run all the promises in parallel
        let results = await Promise.allSettled(promises);

        // filter the non fulfilled servers
        results = results.filter(result => result.status === 'fulfilled'); 

        // filter on the basis of status code range between 200 to 299
        results = results.filter(result => result.value.status >= 200 && result.value.status <= 299);

        // if the result length is 0 then we have no server online at this time.
        // we will simply return and reject the promise with "all the server are offline" message
        if(results.length === 0) return Promise.reject("All the servers are offline");

        // map and fine the urls only from the result
        results = results.map(result => result.value.config.url);

        // fetch the low priority server
        results = getLowPriorityServer(results, servers);

        // return the final result with one server which is online and has the lowest priority
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