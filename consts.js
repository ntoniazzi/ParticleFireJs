const ATTRACT_NONE = 0;
const ATTRACT_GRAVITY = 1;
const ATTRACT_ANGLE = 2;

const STYLE_NORMAL = 0;
const STYLE_STARFIELD = 1;
const STYLE_EXPLOSIVE = 2;
const STYLE_RINGS = 3;
const STYLE_SPIRALS = 4;
const STYLE_POPCORN = 5;
const STYLE_RAINBOWHOLE = 6;
const STYLE_WORMS = 7;
const STYLE_GALATIC_STORM = 8;
const STYLE_PIXIE_DUST = 9;
const STYLE_GEOFF = 10;
const STYLE_STATIC = 11;
const NUMSTYLES = 12;

const XOFF = 5;
const YOFF = 3;

const BURN = true;

const MAX_PART = 10000;
const KICK_STRENGTH = 0.5;
const FADE_SPEED = 4;
const GRAVITY = 0.1;
const BOUNCE = 0.95;

const BXOFF = 4;
const BX4OFF = BXOFF / 4;
const BYOFF = 2;

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
