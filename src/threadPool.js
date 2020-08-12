const { Worker } = require('worker_threads');
const path = require('path');
const { EventEmitter } = require('events');
const log = console.log;

const MAX_THREADS_NUM = 20;
const workPool = {};
let id = 0;

class MyWork extends EventEmitter {
    constructor({ workId, threadId }) {
        super();
        this.workId = workId;
        this.threadId = threadId;
        workPool[workId] = this;
    }
}

class ThreadPool {
    constructor() {
        this.workQueue = [];
        this.totalwork = 0;
        this.lastIndex = 0;
    }

    init() {
        let max = MAX_THREADS_NUM;
        if (this.workQueue.length > 0) {
            return;
        }
        while (max--) {
            this.createThread();
        }
    }

    createThread() {
        const worker = new Worker(path.resolve(__dirname, 'work.js'));
        const node = {
            worker,
            queueLength: 0,
        }
        this.workQueue.push(node);
        log(`worker ${worker.threadId} is working`)
        worker.on('exit', (exitcode) => {
            log(`worker ${worker.threadId} exits`)
            if (exitcode) {
                this.workQueue = this.workQueue.filter((node) => {
                    return node.worker.threadId !== worker.threadId;
                })
                this.createThread();
            }
        })
        worker.on('error', (err) => {
            console.log(err)
        })

        worker.on('message', (result) => {
            // log(`worker ${worker.threadId} receive data`)
            const { event, work } = result;
            const { workId, data, error } = work;
            switch (event) {
                case 'success':
                    const mywork = workPool[workId];
                    mywork.emit('message', data);
                    delete workPool[workId];
                    break;
                case 'error':
                    mywork.emit('error', error);
                    delete workPool[workId];
                    break;
                default:
                    break;
            }
            node.queueLength--;
            this.totalwork--;
        })
    }

    selectThread() {
        if (this.lastIndex >= MAX_THREADS_NUM) {
            this.lastIndex = 0;
        }
        return this.workQueue[this.lastIndex++]
    }


    submit(filename, ...args) {
        this.init();
        let node = this.selectThread();
        const threadId = node.worker.threadId;
        const workId = id++;
        log(`select worker ${threadId}`);
        node.worker.postMessage({ filename, workId, args });
        node.queueLength++;
        this.totalwork++;
        let mywork = new MyWork({ workId, threadId })
        return new Promise((resolve, reject) => {
            mywork.once('message', (value) => {
                resolve(value);
            });
            mywork.once('error', (err) => {
                reject(err);
            })
        })
    }
}




module.exports = new ThreadPool();



