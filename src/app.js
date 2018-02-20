import { rand, frand, abs, fabs, __max, __min }  from "./consts";
import '../main.scss'
import { Color } from './Color'
import { Palette } from './Palette'
import { Particle } from './Particle'
import { ParticleContainer } from './ParticleContainer'
import { ParticleScreen } from './ParticleScreen'
import { ParticleParticle } from './ParticleParticle'
import { buildForm } from './form'

var canvasContainer = document.getElementById('canvas-container');
var element = document.getElementById('x');
var go = false;

document.getElementById('start-stop').addEventListener('click', function (event) {
    event.preventDefault();
    go = !go;
    if (go) {
        this.innerHTML = 'Stop';
        window.requestAnimationFrame(draw);
    } else {
        this.innerHTML = 'Start';
    }
}, false);

var container = new ParticleContainer();
var particle = new ParticleParticle(100, container);
container.particle = particle;

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
window.addEventListener('resize', updateSize);

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

var fieldsets = [
    {
        legend: "Debug",
        options: ["stats", "posdir", "timeout"]
    },
    {
        legend: "Fire options",
        options: ["customPe1", "customPe2", "colorSchemes", "cycleColors", "fadeSpeed"]
    },
    {
        legend: "Particles",
        options: ["numParticles", "style", "wall", "events", "gravity"]
    }
    ];

    var options = {
        stats: {
            type: "checkbox",
            label: "Show statistics",
            value: true
        },
        posdir: {
            type: "checkbox",
            label: "Position & dir",
            set: (value) => { screen.debug = !!value; }
        },
        colorSchemes: {
            type: "select",
            label: "Color schemes",
            cssClass: 'palette-selector',
            set: (value) => {
                screen.palette(value);
                container.p.forEach(function (p) {
                    p.setTrueColor(container.pe);
                });
            },
            get: () => {}
        },
        customPe1: {
            type: "color",
            label: "Custom color 1",
            set: (color) => {
                screen.customPe1 = Color.create(color);

                // rebuild custom palette
                Palette.schemes[Palette.schemes.length - 1].setColors(
                    screen.customPe1,
                    screen.customPe2,
                );

            // TODO: if selected scheme is custom, refresh particles colors

            // refresh form
            drawPalettes();
            },
            get: () => {
                return screen.customPe1 ? screen.customPe1.toHexValue() : "#FFFFFF";
            }
        },
        customPe2: {
            type: "color",
            label: "Custom color 2",
            set: (color) => {
                screen.customPe2 = Color.create(color);

                // rebuild custom palette
                Palette.schemes[Palette.schemes.length - 1].setColors(
                    screen.customPe1,
                    screen.customPe2,
                );

            // TODO: if selected scheme is custom, refresh particles colors

            // refresh form
            drawPalettes();
            },
            get: () => {
                return screen.customPe2 ? screen.customPe2.toHexValue() : "#FFFFFF";
            }
        },
        cycleColors: {
            type: "checkbox",
            label: "Cycle between colors",
            set: (value) => { screen.cycleColors = value; options.colorSchemes.input.disabled = value; }
        },
        numParticles: {
            type: "slider",
            label: "Quantity",
            min: 1,
            max: ParticleScreen.MAX_PART,
            set: (value) => particle.nParticles = value,
            get: () => { return particle.nParticles }
        },
        fadeSpeed: {
            type: "slider",
            label: "Fade speed",
            min: 1,
            max: 20,
            set: (value) => { console.log(screen.burnFade, value); screen.burnFade = value | 0 },
            get: () => { return screen.burnFade }
        },
        style: {
            type: "select",
            label: "Style",
            set: (value) => particle.particleStyle = value,
            get: () => { return particle.particleStyle }
        },
        events: {
            type: "slider",
            label: "Events",
            min: 1,
            max: 100,
            set: (value) => particle.RANDEFFECT = value,
            get: () => { return particle.RANDEFFECT }
        },
        gravity: {
            type: "slider",
            label: "Gravity",
            min: 1,
            max: 200,
            set: (value) => particle.GRAV_TIME = value,
            get: () => { return particle.GRAV_TIME }
        },
        timeout: {
            type: "slider",
            label: "Frame rate",
            min: 20,
            max: 500,
            step: 10,
            value: 200
        }
    };

    var form = document.querySelector('form');

    buildForm(fieldsets, options, form);

// Palettes
    (function () {
        var canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 1;
        var ctx = canvas.getContext("2d");

        var selector = options.colorSchemes.input;
        selector.innerHTML = "";
        Palette.schemes.forEach(function (palette, index) {
            ctx.fillStyle = 'transparent';
            ctx.fillRect(0, 0, 256, 32);
            palette.colors.forEach(function (color, i) {
                ctx.fillStyle = `rgb(${color.red} , ${color.green}, ${color.blue})`;
                ctx.fillRect(i, 0, 1, 1);
            });

            var option = new Option(palette.name, index);
            option.style.backgroundImage = 'url(' + canvas.toDataURL() + ')';
            selector.appendChild(option);
        });

        selector.size = Palette.schemes.length;
    })();

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

document.querySelectorAll('input[type=range]').forEach(function (element) {
    element.addEventListener('input', function () {
        element.nextElementSibling.innerHTML = element.value;
    }, false);
});

// reset button
document.getElementById('reset').addEventListener('click', function (event) {
    particle.doStatic(1);
}, false);

ParticleParticle.styles.forEach(function (name, index) {
    var option = new Option(name, index);
    options.style.input.appendChild(option);
});

var frames = 0;
//var cycleFrameDelay = 10;
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

    if (options.stats.value) {
        screen.write(
            10,
            10,
            `Frame: ${frames}
            ${screen.width}×${screen.height}
            Color scheme: ${Palette.schemes[screen.colorScheme].name}
            Particles: ${particle.nParticles}
            Style: ${ParticleParticle.styles[particle.particleStyle]}
            Fade speed: ${screen.burnFade}
            Event speed: ${particle.RANDEFFECT}
            FPS: ${fps}
            `
        );
    }

    if (container.screen.cycleColors && frames % 2 === 0) {
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
        if (options.timeout.value <= 20) {
            // 60fps → 16ms, so drop to animationFrame only
            window.requestAnimationFrame(draw);
        } else {
//            // timeout, then request animation frame
            window.setTimeout(function () {
                window.requestAnimationFrame(draw);
            }, options.timeout.value);
        }
    }
};
