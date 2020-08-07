const { Worker } = require('worker_threads');
const path = require('path');
const { EventEmitter } = require('events');

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
        worker.on('exit', (exitcode) => {
            if (exitcode) {
                this.workQueue.filter((node) => {
                    return node.worker.threadId !== worker.threadId;
                })
                this.createThread();
            }
        })

        worker.on('message', (result) => {
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
        node.worker.postMessage({ filename, workId, args });
        node.queueLength++;
        this.totalwork++;
        return new MyWork({ workId, threadId });
    }
}




module.exports = ThreadPool;



