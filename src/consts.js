
var rand = function () {
    return (Math.random() * Number.MAX_SAFE_INTEGER) >>> 0;
}
var fabs = Math.abs;
var abs = Math.abs;
var frand = function (range) {
    return ((rand() % 10000) - 5000) * range / 5000;
}
var __max = Math.max;
var __min = Math.min;

export { rand, frand, abs, fabs, __max, __min }