let queue = [];
let idle_time = 3000

async function cron() {
    if (queue.length > 0) {
        // 耗时任务
        await sleep(0.1)
        console.log('running', queue.length);
        queue.shift();

        // 继续执行
        cron();
    } else {
        // 任务队列空，停idle_time时间
        setTimeout(() => {
            console.log('after 3s')
            cron();
        }, idle_time);
    }
}
cron();



// 模拟外界用户不断操作（间隔一个时间段操作一次）
setInterval(() => {
    queue.push(1, 2, 3, 4, 5, 6, 7, 8)
}, 1000);



// 耗时函数
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time * 1000);
    })
}