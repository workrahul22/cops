const chai = require('chai');
const index = require('../index');
const expect = chai.expect;

var servers = [
    { url: "http://doesNotExist.boldtech.co",priority: 1},
    { url: "http://boldtech.co", priority: 7},
    { url: "http://offline.boldtech.co", priority: 2},
    { url: "http://google.com", priority: 4}
];

var onlineServer = ["http://boldtech.co", "http://google.com"];


// Test to check createUrlPriorityHash function
it("createUrlPriorityHash function", function(done) {
    let hash = index.createUrlPriorityHash(servers)
    expect(hash).to.be.an('object');
    done();
});




// Test to check getLowPriorityServer function
it("getLowPriorityServer function", function(done) {
    let server = index.getLowPriorityServer(onlineServer, servers)
    expect(server).to.be.an('object');
    done();
});



// Test to check the findServer function
it("findServer function", function(done) {
    index.findServer(servers)
    .then(result => {
        done();
    })
    .catch((err) => {
        done(err);
    })
}, 10000);