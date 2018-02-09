import { rand, frand, abs, fabs, __max, __min }  from "./consts";
import '../main.scss'
import { Color } from './Color'
import { Palette } from './Palette'
import { Particle } from './Particle'
import { ParticleContainer } from './ParticleContainer'
import { ParticleScreen } from './ParticleScreen'
import { ParticleParticle } from './ParticleParticle'

var canvasContainer = document.getElementById('canvas-container');
var element = document.getElementById('x');
var button = document.getElementById('start-stop');
var go = false;

button.addEventListener('click', function (event) {
    event.preventDefault();
    go = !go;
    if (go) {
        button.innerHTML = 'Stop';
        window.requestAnimationFrame(draw);
    } else {
        button.innerHTML = 'Start';
    }
}, false);

var container = new ParticleContainer();
var particle = new ParticleParticle(2000, container);
container.particle = particle;
particle.particleStyle = ParticleParticle.STYLE_EXPLOSIVE;

var screen = new ParticleScreen(container);
container.screen = screen;
screen.palette(0);
screen.initScreen(element);

var updateSize = function () {
    element.width = element.offsetWidth;
    element.height = element.offsetHeight;

    screen.width = element.width;
    screen.height = element.height;
    screen.WIDTH = element.width;
    screen.HEIGHT = element.height;

    screen.imageData = screen.ctx.getImageData(0, 0, screen.width, screen.height);

    console.log("Update size: %d×%d", screen.width, screen.height);
};

window.setTimeout(updateSize, 200);

var delay = null;
var observer = new MutationObserver(function (list) {
    console.log("mutation");

    if (delay !== null) {
        window.clearTimeout(delay);
    }

    delay = window.setTimeout(function () {
        delay = null;
        updateSize();
    }, 200);
});
observer.observe(canvasContainer, {attributes: true, childList: false});

var lastDim = {
    width: element.width,
    height: element.height
};
var fullScreenChange = function () {
    var fsElement = document.mozFullScreenElement || document.webkitFullscreenElement || document.fullScreenElement;
    var fsEnabled = document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.fullScreenEnabled;

    console.log("fullscreenchange", fsElement, fsEnabled);

    if (fsElement !== canvasContainer && fsElement !== undefined) {
        return;
    }

    if (fsElement) {
        console.log("entering fullscreen");
        lastDim.width = element.offsetWidth;
        lastDim.height = element.offsetHeight;
    } else {
        console.log("leaving fullscreen");
        canvasContainer.style.width = lastDim.width + "px";
        canvasContainer.style.height = lastDim.height + "px";
    }

    delay = window.setTimeout(updateSize, 200);
};
document.addEventListener('mozfullscreenchange', fullScreenChange, false);
document.addEventListener('webkitfullscreenchange', fullScreenChange, false);

// Palettes
var selector = document.getElementById('palette-selector');
var canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 1;
var ctx = canvas.getContext("2d");

var drawPalettes = function () {
    selector.innerHTML = "";
    Palette.schemes.forEach(function (palette, index) {
        var option = drawPalette(index, palette.name, palette.colors);
        selector.appendChild(option);
    });

    selector.size = Palette.schemes.length;
};

var drawPalette = function (index, name, colors) {
    var li = new Option(name, index);

    colors.forEach(function (color, i) {
        ctx.fillStyle = `rgb(${color.red} , ${color.green}, ${color.blue})`;
        ctx.fillRect(i, 0, 1, 1);
    });

    li.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';

    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 256, 32);

    return li;
};

var customPe1, customPe2, cycleColors, numPartSlider, fadeSpeedSlider, eventSlider, gravitySlider, style;

var fs = document.getElementById('fullsrcreen');
fs.addEventListener('click', function () {
    if (!document.mozFullScreen && !document.webkitFullScreen) {
        if (canvasContainer.mozRequestFullScreen) {
            canvasContainer.mozRequestFullScreen();
        } else {
            canvasContainer.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else {
            document.webkitCancelFullScreen();
        }
    }
}, false);

[].slice.call(document.querySelectorAll('input[type=range]')).forEach(function (element) {
    element.addEventListener('input', function () {
        element.nextElementSibling.innerHTML = element.value;
    }, false);
});

// Events
var form = document.querySelector('form');
form.addEventListener('change', function (event) {
    var input = event.target;

    switch (input) {
        case selector:
            // color scheme
            screen.palette(input.value);
            container.p.forEach(function (p) {
                p.setTrueColor(container.pe);
            });

            break;

        case customPe1:
        case customPe2:
            var index = input.dataset.index | 0;
            var value = parseInt(input.value.substr(1), 16);
            var color = new Color(
                value >> 16 & 255,
                value >> 8 & 255,
                value & 255,
            );

            screen[index === 1 ? 'customPe1' : 'customPe2'] = color;

            // rebuild custom palette
            Palette.schemes[Palette.schemes.length - 1].setColors(
                screen.customPe1,
                screen.customPe2,
            );

            // TODO: if selected scheme is custom, refresh particles colors

            // refresh form
            drawPalettes();

            break;

        case eventSlider:
            particle.RANDEFFECT = input.value | 0;

            break;

        case gravitySlider:
            particle.GRAV_TIME = input.value | 0;

            break;

        case cycleColors:
            screen.cycleColors = input.checked;
            selector.disabled = input.checked;

            break;

        case numPartSlider:
            particle.nParticles = input.value | 0;

            break;

        case fadeSpeedSlider:
            screen.burnFade = input.value | 0;

            break;

        case style:
            particle.particleStyle = input.value | 0;

            break;
    }
}, false);

customPe1 = document.getElementById('custom-color-1');
customPe1.value = screen.customPe1.toHexValue();

customPe2 = document.getElementById('custom-color-2');
customPe2.value = screen.customPe2.toHexValue();

cycleColors = document.getElementById('cycle-colors');
cycleColors.checked = screen.cycleColors;

numPartSlider = document.getElementById('num-particles');
numPartSlider.value = particle.nParticles;
numPartSlider.min = 1;
numPartSlider.max = ParticleScreen.MAX_PART;

fadeSpeedSlider = document.getElementById('fade-speed');
fadeSpeedSlider.value = screen.burnFade;
fadeSpeedSlider.min = 1;
fadeSpeedSlider.max = 20;

eventSlider = document.getElementById('events');
eventSlider.value = particle.RANDEFFECT;
eventSlider.min = 1;
eventSlider.max = 100;

gravitySlider = document.getElementById('gravity');
gravitySlider.value = particle.GRAV_TIME;
gravitySlider.min = 1;
gravitySlider.max = 200;

style = document.getElementById('style');
ParticleParticle.styles.forEach(function(name, index) {
    var option = new Option(name, index);
    style.appendChild(option);
});

//selector.addEventListener('click', function (event) {
//    if (!event.target.matches('li')) {
//        return;
//    }
//
//    event.stopPropagation();
//    screen.palette(event.target.dataset.index);
//
//    container.p.forEach(function (p) {
//        p.setTrueColor(container.pe);
//    });
//}, false);

var frames = 0;
var cycleFrameDelay = 10;
var cycleT = 1.1;
var lastTime = Date.now();
var fps;
var sample = 20;
var draw = function () {
    container.frame();

    if (frames % sample === 0) {
        // calc FPS
        var time = Date.now();
        var diff = time - lastTime;
        fps = Math.round(sample / diff * 1000);
        lastTime = time;
    }
    frames++;

    screen.write(10, 10, `Frame: ${frames}
${screen.width}×${screen.height}
Color scheme: ${Palette.schemes[screen.colorScheme].name}
Particles: ${particle.nParticles}
Style: ${ParticleParticle.styles[particle.particleStyle]}
Fade speed: ${screen.burnFade}
Event speed: ${particle.RANDEFFECT}
FPS: ${fps}
`);

    if (container.screen.cycleColors && frames % 2 == 0) {
        cycleT += 0.01;
        if (cycleT >= 1.0) {
            container.cf = container.screen.colorScheme;
            if (container.screen.randomColor) {
                container.screen.colorScheme = rand() % (Palette.schemes.length);
            } else {
                container.screen.colorScheme++;

                if (container.screen.colorScheme >= Palette.schemes.length) {
                    container.screen.colorScheme = 0;
                }
            }

            container.screen.palette(container.screen.colorScheme);//rand() % (NUMSCHEMES + 1) - 1);
            container.ct = container.screen.colorScheme;
            cycleT = 0.0;
        }

        var ct = Palette.schemes[container.ct].colors;
        var cf = Palette.schemes[container.cf].colors;
        var t = cycleT, it = 1.0 - t;

        for (var i = 1; i < 255; i++) {
            container.pe[i].red   = cf[i].red   * it + ct[i].red   * t;
            container.pe[i].green = cf[i].green * it + ct[i].green * t;
            container.pe[i].blue  = cf[i].blue  * it + ct[i].blue  * t;
        }
    }

    if (go) {
        window.requestAnimationFrame(draw);
    }
};

drawPalettes();
