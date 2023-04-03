// Alipay console.time have some error ,hack here
let Timer = window.performance;
let _timerTable = Object.create(null);

console.time = function(label) {
    _timerTable[label] = Timer.now();
}
console.timeEnd = function(label) {
    let startTime = _timerTable[label];
    let duration = Timer.now() - startTime;
    console.log(`${label}: ${duration}ms`);
}
