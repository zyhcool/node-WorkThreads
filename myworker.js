const { Worker } = require('worker_threads');
const path = require('path');
const events = require('events');

let MyWorker = {

}
MyWorker.taskqueue = [];
MyWorker.num = 0;


MyWorker.submit = function (filepath, options) {
    this.taskqueue.push({ filepath, options });
    return this.poll();
}

MyWorker.poll = function () {
    if (this.num >= 5) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.poll());
            }, 1);
        })
    }
    let task = this.taskqueue.shift();
    let worker = this.create(task);
    worker.postMessage({ cmd: 'begin' });
    return new Promise((resolve, reject) => {
        worker.on('message', (data) => {
            this.num--;
            console.log(this.num)
            resolve(data);
        });
        worker.on('error', (err) => {
            reject(err)
        })
    })
}

MyWorker.create = function (task) {
    let worker = new Worker(path.resolve(__dirname, task.filepath), task.options);
    this.num++;
    return worker;
}




module.exports = MyWorker;


