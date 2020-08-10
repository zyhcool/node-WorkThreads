const ThreadPool = require('./threadPool');
const http = require('http')
const { Worker } = require('worker_threads');
const path = require('path');



// 原始
// http.createServer((req, res) => {
//     const start = Date.now();
//     for (let i = 0; i < 10 ** 8; i++) { }
//     const time = Date.now() - start;
//     res.statusCode = 200;
//     res.end(`${time}`);
// }).listen(3000, () => {
//     console.log('listen at 3000')
// })


// 多线程
// http.createServer((req, res) => {
//     let worker = new Worker(path.resolve(__dirname, 'cal.js'), { workerData: 'hello' });
//     worker.postMessage({ cmd: 'begin' })
//     worker.on('message', (data) => {
//         console.log(data);
//         res.statusCode = 200;
//         res.end(`${data}`);
//     })
// }).listen(3000, () => {
//     console.log('listen at 3000')
// })



// 多线程封装
http.createServer(async (req, res) => {
    let data = await ThreadPool.submit(path.resolve(__dirname, 'cal.js'), 'hello')
    res.statusCode = 200;
    res.end(`${data}`);
}).listen(3000, () => {
    console.log('listen at 3000')
})

