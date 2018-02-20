import { rand, frand, abs, fabs, __max, __min }  from "./consts";
import { Color } from './Color'
import { Palette } from './Palette'
import { Particle } from './Particle'

const KICK_STRENGTH = 0.5;
//const FADE_SPEED = 4;
const BOUNCE = 0.95;
const BXOFF = 4;
const BX4OFF = BXOFF / 4;
const BYOFF = 2;

class ParticleScreen
{
    constructor(container)
    {
        this.parent = container;

        this.flameSpeed = 0.03;
        this.burnFade = 3;
        this.disableFire = 0;

        this.colorScheme = 0;
        this.randomColor = false;
        this.cycleColors = 0;

        this.width = this.height = 0;

        this.customPe1 = new Color(0,0,0);
        this.customPe2 = new Color(255,255,255);

        this.debug = false;
    }

    initScreen(canvas)
    {
        var parent = this.parent;

        this.canvas = canvas;
        this.width = this.WIDTH = this.canvas.width;
        this.height = this.HEIGHT = this.canvas.height;

        if (this.randomColor) {
            this.colorScheme = rand() % (Palette.schemes.length);
        }

        var i;

        //Create fading lookup table.
        this.half = [];
        for (i = 0; i < 256; i++) {
            this.half[i] = i >> 1;
        }

        // Initialize particles
        for (var i = 0; i < ParticleScreen.MAX_PART; i++) {
            parent.p[i] = new Particle();
            parent.p[i].x = parent.p[i].lx = (ParticleScreen.XOFF + rand() % (this.width - ParticleScreen.XOFF * 2));
            parent.p[i].y = parent.p[i].ly = (ParticleScreen.YOFF + rand() % (this.height - ParticleScreen.YOFF * 2));
            parent.p[i].dx = parent.p[i].dy = 0.0;
            parent.p[i].color = (rand() % 127 + 127) | 0;
        }

        parent.timeStart = parent.lastTime = parent.time = Date.now();
        parent.particle.follow = rand() & 1;
        parent.particle.multipleFollow = rand() & 1;
        parent.particle.noiseBurn = rand() & 1;
        parent.particle.useGravity = rand() & 1;

        this.ctx = this.canvas.getContext('2d');
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    }

    palette(schemeIndex)
    {
        this.colorScheme = schemeIndex;
        var palette = Palette.schemes[schemeIndex];
        var parent = this.parent;
        palette.colors.forEach(function (color, i) {
            parent.pe[i].red = color.red;
            parent.pe[i].green = color.green;
            parent.pe[i].blue = color.blue;
        });
    }

    draw()
    {
        var data = this.imageData.data;
        var pitch = 4 * this.WIDTH;
        var temp = 0;
        var BURNFADE = this.burnFade;

        this.drawParticles();

        if (true) {
            var lptr;
            // Burn down
//            var TCBURNIT2 = function (n) {
//                temp = (
//                        data[lptr + n + pitch] +
//                        data[lptr + n - 4] +
//                        data[lptr + n] +
//                        data[lptr + n + 4] -
//                        BURNFADE
//                        ) >> 2;
//                data[lptr + n + pitch] = temp < 0 ? 0 : temp;
//            };

            // Burn up
            var TCBURNIT = function () {
                /*
                 * Some kind of convolution centered on the pixel above:
                 * ([ 0 0 0
                 *   0 1 0
                 *   1 1 1 ] - BURNFADE) / 4
                 */
                // for each component (red, green and blue)
                for (var comp = 0; comp < 4; comp++) {
                    temp = (
                        data[lptr + comp - pitch] +
                        data[lptr + comp - 4] +
                        data[lptr + comp] +
                        data[lptr + comp + 4] -
                        BURNFADE
                    ) >> 2;
                    data[lptr + comp - pitch] = temp < 0 ? 0 : temp;
                }
            };

            // burn down or burn up
            var x, y, HEIGHT = this.height, WIDTH = this.width;
            var lpitch = pitch;
            var lwidth = this.WIDTH * 4;
            var xlwidth = lwidth - BX4OFF;

            if (this.parent.particle.burnDown) {
                // burn DOWN
//                for (y = HEIGHT - BYOFF - 2; y > BYOFF - 1; y--) {
//                    lptr = (lpitch * y) + BX4OFF;
//                    for (x = BX4OFF; x < xlwidth; x++) {
//                        TCBURNIT2(0);
//                        TCBURNIT2(1);
//                        TCBURNIT2(2);
//                         TCBURNIT2(3);
//                        lptr++;
//                    }
//                }
            } else {
                // burn UP
                for (y = BYOFF + 1; y < HEIGHT - BYOFF + 1; y++) {
                    lptr = (4 * WIDTH * y) + BXOFF;
                    for (x = BX4OFF; x < WIDTH - BX4OFF; x++) {
                        // alpha
                        data[lptr+3] = 255;
                        TCBURNIT();

                        lptr+=4;
                    }
                }
            }
        }

        this.ctx.putImageData(this.imageData, 0, 0);

        if (this.debug) {
            var parent = this.parent;

            for (var i = 0; i < parent.particle.nParticles; i++) {
                // position
                this.ctx.beginPath();
                this.ctx.arc(
                    parent.p[i].x,
                    parent.p[i].y,
                    5,
                    0,
                    2 * Math.PI
                );
                this.ctx.strokeStyle = "red";
                this.ctx.stroke();
                this.ctx.closePath();

                // direction
                this.ctx.beginPath();
                this.ctx.moveTo(
                    parent.p[i].x,
                    parent.p[i].y
                );
                this.ctx.lineTo(
                    parent.p[i].x + parent.p[i].dx * 10,
                    parent.p[i].y + parent.p[i].dy * 10
                );
                this.ctx.strokeStyle = "lime";
                this.ctx.stroke();
                this.ctx.closePath();

                // last pos
    //            this.ctx.beginPath();
    //            this.ctx.moveTo(
    //                parent.p[i].lx,
    //                parent.p[i].ly
    //            );
    //            this.ctx.lineTo(
    //                parent.p[i].x,
    //                parent.p[i].y
    //            );
    //            this.ctx.strokeStyle = "blue";
    //            this.ctx.stroke();
    //            this.ctx.closePath();
            }
        }
    }

    drawParticles() {
        var data = this.imageData.data;
        var WIDTH = this.width;
        var HEIGHT = this.height;
        var pitch = 4 * WIDTH;
        var parent = this.parent;
        var d, e, dir, x, y, dx, dy;
        var adx, ady, dist, dist2, ang, angd;
        var x, y, data2;

        for (var i = 0; i < parent.particle.nParticles; i++) {
            if (parent.particle.altColor) {
                parent.p[i].color -= 1;
                if (parent.p[i].color <= 128) {
                    parent.p[i].color += 32;
                }
            }

            parent.p[i].lx = parent.p[i].x;
            parent.p[i].ly = parent.p[i].y;
            if (parent.p[i].attract & ParticleScreen.ATTRACT_GRAVITY) {
                parent.p[i].dx += parent.particle.xgrav;
                parent.p[i].dy += parent.particle.ygrav;
            }

            if (parent.p[i].attract & ParticleScreen.ATTRACT_ANGLE) {
                adx = parent.p[i].ax - parent.p[i].x;
                ady = parent.p[i].ay - parent.p[i].y;
                dist = Math.sqrt(adx * adx + ady * ady);
                dist2 = Math.sqrt(parent.p[i].dx * parent.p[i].dx + parent.p[i].dy * parent.p[i].dy);
                if (dist == 0.0) {
                    dist = 2.0;
                }
                if (dist2 == 0.0) {
                    dist2 = 2.0;
                }

                if (parent.p[i].dx == 0.0 && parent.p[i].dy == 0.0) {
                    ang = parent.particle.identityAngle;
                } else {
                    ang = Math.atan2(parent.p[i].dy, parent.p[i].dx);
                }
                //
                if (adx == 0.0 && ady == 0.0) {
                    angd = parent.particle.identityAngle - ang;
                } else {
                    angd = Math.atan2(ady, adx) - ang;
                }
                //
                if (angd > Math.PI) {
                    angd -= Math.PI * 2.0;
                }
                if (angd < -Math.PI) {
                    angd += Math.PI * 2.0;
                }
                ang += angd * 0.05;

                parent.p[i].dx = Math.cos(ang) * dist2;
                parent.p[i].dy = Math.sin(ang) * dist2;
            }

            parent.p[i].x += parent.p[i].dx;
            parent.p[i].y += parent.p[i].dy;

            // edge collisions.
            if (parent.p[i].x < ParticleScreen.XOFF) {
                parent.p[i].x = ParticleScreen.XOFF;
                parent.p[i].dx = fabs(parent.p[i].dx) * BOUNCE;
                parent.p[i].dy += frand(KICK_STRENGTH);
                if (parent.particle.altColor) {
                    parent.p[i].color = __min(254, parent.p[i].color + 32);
                }
            }

            if (parent.p[i].x >= WIDTH - ParticleScreen.XOFF) {
                parent.p[i].x = WIDTH - ParticleScreen.XOFF - 1;
                parent.p[i].dx = -fabs(parent.p[i].dx) * BOUNCE;
                parent.p[i].dy += frand(KICK_STRENGTH);
                if (parent.particle.altColor) {
                    parent.p[i].color = __min(254, parent.p[i].color + 32);
                }
            }

            if (parent.p[i].y < ParticleScreen.YOFF) {
                parent.p[i].y = ParticleScreen.YOFF;
                parent.p[i].dy = fabs(parent.p[i].dy) * BOUNCE;
                parent.p[i].dx += frand(KICK_STRENGTH);
                if (parent.particle.altColor) {
                    parent.p[i].color = __min(254, parent.p[i].color + 32);
                }
            }

            if (parent.p[i].y >= HEIGHT - ParticleScreen.YOFF) {
                parent.p[i].y = HEIGHT - ParticleScreen.YOFF - 1;
                parent.p[i].dy = -fabs(parent.p[i].dy) * BOUNCE;
                parent.p[i].dx += frand(KICK_STRENGTH);
                if (parent.particle.altColor) {
                    parent.p[i].color = __min(254, parent.p[i].color + 32);
                }
            }

            x = parent.p[i].lx | 0;
            y = parent.p[i].ly | 0;
            dx = (parent.p[i].x | 0) - x;
            dy = (parent.p[i].y | 0) - y;

            // console.log("Draw %d particle at [%o,%o] [%o,%o]", i, x, y, dx, dy);

            // Make sure LAST coords are inside bounds too.
            if (x < ParticleScreen.XOFF || y < ParticleScreen.YOFF || x >= WIDTH - ParticleScreen.XOFF || y >= HEIGHT - ParticleScreen.YOFF) {
                continue;
            }

            if (false) {
                data2 = (y * WIDTH + x) * 4;
                data[data2 + 0] = parent.p[i].red | 0;
                data[data2 + 1] = parent.p[i].green | 0;
                data[data2 + 2] = parent.p[i].blue | 0;
                data[data2 + 3] = 255;

                continue;
            }

            // console.log("Particle %d: [%o,%o] @ %o", i, x, y, data2);

            //Bresenham style line drawer.
            if (abs(dx) > abs(dy)) {
                //X major.
                if (dx < 0) {
                    x += dx;
                    y += dy;
                    dx = -dx;
                    dy = -dy;
                }

                var j;
                d = j = -dx;
                e = abs(dy);
                data2 = (x << 2) + y * pitch;
                // data2 = (y * WIDTH + x) * pitch;

                if (dy < 0) {
                    dir = -pitch;
                } else {
                    dir = pitch;
                }

                var tc = [
                    parent.p[i].red,
                    parent.p[i].green,
                    parent.p[i].blue,
                    255
                ];

                // Draw start and end pixels.
                while (dx >= 0) {
                    for (var px = 0; px < 3; px++) {
                        data[data2 - pitch + px] = __max(data[data2 - pitch + px], tc[px] >> 1);
                        data[data2 + px] = __max(data[data2 + px], tc[px]);
                        data[data2 + pitch + px] = __max(data[data2 + pitch + px], tc[px] >> 1);
                    }
                    // alpha
                    data[data2 - pitch + px] = 255;
                    data[data2 + px] = 255;
                    data[data2 + pitch + px] = 255;

                    d += e;
                    if (d >= 0) {
                        d += j;
                        data2 += dir;
                    }
                    data2 += 4;
                    dx--;
                }
            } else {
                // Y Major.
                if (dy < 0) {
                    x += dx;
                    y += dy;
                    dx = -dx;
                    dy = -dy;
                }

                var j;
                d = j = -dy;
                e = abs(dx);
                data2 = (x << 2) + y * pitch;

                if (dx < 0) {
                    dir = -4;
                } else {
                    dir = 4;
                }

                var tc = [
                    parent.p[i].red,
                    parent.p[i].green,
                    parent.p[i].blue,
                    255
                ];

                //Draw start and end pixels.
                while (dy >= 0) {
                    for (var px = 0; px < 3; px++) {
                        data[data2 - dir + px] = __max(data[data2 - dir + px], tc[px] >> 1);
                        data[data2 + px] = __max(data[data2 + px], tc[px]);
                        data[data2 + pitch + px] = __max(data[data2 + pitch + px], tc[px] >> 1);
                    }
                    // alpha
                    data[data2 - pitch + px] = 255;
                    data[data2 + px] = 255;
                    data[data2 + pitch + px] = 255;

                    d += e;
                    if (d >= 0) {
                        d += j;
                        data2 += dir;
                    }
                    data2 += pitch;
                    dy--;
                }
            }
        }
    }

    write(x, y, text) {
        var ctx = this.ctx;
        ctx.fillStyle = "white";
        ctx.font = '12px sans-serif';
        y += 12;

        text.split("\n").forEach(function (line) {
            ctx.fillText(line, x, y);

            y += 12;
        });
    }
}

// constants
ParticleScreen.XOFF = 5;
ParticleScreen.YOFF = 3;

ParticleScreen.ATTRACT_NONE = 0;
ParticleScreen.ATTRACT_GRAVITY = 1;
ParticleScreen.ATTRACT_ANGLE = 2;

ParticleScreen.MAX_PART = 10000;

export { ParticleScreen }
