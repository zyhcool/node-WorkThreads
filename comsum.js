const { parentPort, workerData } = require('worker_threads');

parentPort.once('message', (data) => {
    console.log(data)
    const { cmd } = data;
    if (cmd === 'begin') {
        const start = Date.now();
        for (let i = 0; i < 10 ** 9; i++) { }
        const time = Date.now() - start;
        parentPort.postMessage(time);
    }
})

// const start = Date.now();
// for (let i = 0; i < 10 ** 9; i++) { }
// const time = Date.now() - start;
// parentPort.postMessage(time);