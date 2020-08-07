async function cal(num) {
    const start = Date.now();
    for (let i = 0; i < 10 ** 8; i++) { }
    const time = Date.now() - start;
    return `${time} ms,${num}`;
}

module.exports = cal;