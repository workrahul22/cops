# cops 

## Getting Started

- Install Package
  ```Javascript
    $ npm install cops
  ```
- Example
  ```Javascript
    const cops = require('ps-demo');
    
    const servers = [
      { url: "http://doesNotExist.boldtech.co",priority: 1},
      { url: "http://boldtech.co", priority: 7},
      { url: "http://offline.boldtech.co", priority: 2},
      { url: "http://google.com", priority: 4}
    ];
    
    cops.findServer(servers)
      .then(console.log)
      .catch(console.log)
  ```

## Run Unit Test
  ```Javascript
    $ git clone https://github.com/workrahul22/cops.git
    $ cd cops
    $ npm install
    $ npm run test
  ```

## Npm Registry Link
  https://www.npmjs.com/package/ps-demo

