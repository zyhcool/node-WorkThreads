const http = require('http')
const { Worker } = require('worker_threads');
const path = require('path');


// 原始
http.createServer((req, res) => {
    const start = Date.now();
    for (let i = 0; i < 10 ** 9; i++) { }
    const time = Date.now() - start;
    res.statusCode = 200;
    res.end(`${time}`);
}).listen(3000, () => {
    console.log('listen at 3000')
})


// 多线程
// http.createServer((req, res) => {
//     let worker = new Worker(path.resolve(__dirname, 'comsum.js'), { workerData: 'hello' });
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
// http.createServer(async (req, res) => {
//     let worker = new Worker(path.resolve(__dirname, 'comsum.js'), { workerData: 'hello' });
//     let time = await gg(worker);
//     res.statusCode = 200;
//     res.end(`${time}`);

// }).listen(3000, () => {
//     console.log('listen at 3000')
// })

// function gg(worker) {
//     return new Promise((resolve, reject) => {
//         worker.on('message', (data) => {
//             resolve(data);
//         });
//         worker.on('error', (err) => {
//             reject(err)
//         })
//     })
// }


// 多线程封装
// http.createServer(async (req, res) => {
//     let myworker = require('./myworker');
//     let time = await myworker.submit('comsum.js', 'hello')
//     console.log(time);
//     res.statusCode = 200;
//     res.end(`${time}`);

// }).listen(3000, () => {
//     console.log('listen at 3000')
// })







