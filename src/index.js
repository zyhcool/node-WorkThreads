const ThreadPool = require('./threadPool');
const path = require('path');

const pool = new ThreadPool();
let myworker = pool.submit(path.resolve(__dirname, 'cal.js'), 'hello')
myworker.on('message', (data) => {
    console.log(data)
});

myworker.on('error', (data) => {
    console.log(data)
})




