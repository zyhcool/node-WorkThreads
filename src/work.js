const { parentPort } = require('worker_threads')
const queue = [];

parentPort.on('message', (work) => {
    console.log(work)
    queue.push(work);
})



async function poll() {
    if (queue.length > 0) {
        let work = queue.shift();
        const { workId, filename, args } = work;
        const func = require(filename);
        let result = await func.call(null, ...args);
        parentPort.postMessage({ event: 'success', work: { workId, data: result } });
        poll();
    } else {
        setTimeout(() => {
            poll();
        }, 1000);
    }
}

poll();





