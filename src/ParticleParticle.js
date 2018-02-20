import { ParticleScreen } from "./ParticleScreen"
import { rand, frand, abs, fabs, __max, __min }  from "./consts";

const GRAVITY = 0.1;

class Static
{
    constructor(name, init) {
        this.name = name;
        this.value= init;
    }

    static init(name, value) {
        if (undefined === Static.items[name]) {
            Static.items[name] = new Static(name, value);
        }

        return Static.items[name];
    }
}
Static.items = {};

class ParticleParticle
{
    constructor(numParticles, container)
    {
        this.parent = container;

        this.identityAngle = 3.0;
        this.particleStyle = ParticleParticle.STYLE_NORMAL;
        this.wallStyle = 0;
        this.zMoveSpeed = 2;
        
        this.nParticles = numParticles;
        this.GRAV_TIME = 50;
        this.RANDEFFECT = 75;
        this.altColor = false;
        
        this.noiseBurn = false;
        this.follow = true;
        this.multipleFollow = true;
        this.useGravity = true;
        this.fullscreen = false;
        this.stretch = false;
        this.explode = false;
        this.cube3D = true;
        this.attract = true;
        this.switchMode = false;
        this.shakeUp = false;
        this.freeze = false;
        this.useRandom = true;
        this.comet = false;
        this.emit = false;
        this.followMouse = false;
        this.isMinimized = false;
        this.emitCount = 0;
        this.explodeX = 0;
        this.explodeY = 0;
        //, MouseX, MouseY;
        this.innerRing = false;
        this.popcorn = false;
        
        this.emitRotate = 0;
        this.xgrav = 0.0;
        this.ygrav = 0.0;
        this.burnDown = false;
        
        this.squigglyWiggly = false;
        this.galacticStorm = false;
        this.pixieDust = false;
        
        this.magnetX = 0;
        this.magnetY = 0;
    }

    frame() {
        var parent = this.parent;
        parent.lastTime = parent.time;
        parent.time = Date.now();

        if (this.particleStyle === ParticleParticle.STYLE_STARFIELD) {
            this.frameStarfield();
        } else {
            this.frameGravity();
        }
    }

    clearMode() {
        this.pixieDust = false;
        this.rainbowHole = false;
        this.squigglyWiggly = false;
        this.galacticStorm = false;
        this.explode = false;
        this.innerRing = false;
        this.emit = false;
        this.popcorn = false;
    }

    setMode(mode) {
        this.clearMode();
        switch (mode) {
            case ParticleParticle.STYLE_EXPLOSIVE:
                this.explode = true;
                break;
            case ParticleParticle.STYLE_RINGS:
                this.innerRing = true;
                break;
            case ParticleParticle.STYLE_SPIRALS:
                this.emit = true;
                this.emitRotate = (rand() % 3) - 1;
                break;
            case ParticleParticle.STYLE_POPCORN:
                this.popcorn = true;
                break;
            case ParticleParticle.STYLE_RAINBOWHOLE:
                this.rainbowHole = true;
                break;
            case ParticleParticle.STYLE_WORMS:
                this.suigglyWiggly = true;
                break;
            case ParticleParticle.STYLE_GALATIC_STORM:
                this.galacticStorm = true;
                break;
            case ParticleParticle.STYLE_PIXIE_DUST:
                this.pixieDust = true;
                break;
            case ParticleParticle.STYLE_GEOFF:
                break;
        }
    }

    frameStarfield() {
        // Turn off the Wall of Fire for the starfield
        this.noiseBurn = -1;
        var parent = this.parent;

        var starsinit = Static.init('frameStarfield.starsinit', 0);

        var halfw = parent.screen.width / 2;
        var halfh = parent.screen.height / 2;
        var i128 = 1 / (256 / 2);
        for (var i = 0; i < this.nParticles; i++) {
            parent.p[i].attract = ParticleScreen.ATTRACT_NONE;
            if (!starsinit.value) {
                parent.p[i].color = rand() % 255;
                parent.p[i].setTrueColor(parent.pe);
                //
                parent.p[i].ax = frand(1.0);
                parent.p[i].ay = frand(1.0);
            }

            var lx, ly;
            var iz = 1.0 / (2.0 - parent.p[i].color * i128);
            lx = parent.p[i].ax * iz;
            ly = parent.p[i].ay * iz;
            parent.p[i].color += this.zMoveSpeed;
            if (parent.p[i].color > 255) {
                parent.p[i].color = __max(0, parent.p[i].color - 255);
                parent.p[i].ax = frand(1.0);
                parent.p[i].ay = frand(1.0);
            }

            var x, y;
            iz = 1.0 / (2.0 - parent.p[i].color * i128);
            x = parent.p[i].ax * iz;
            y = parent.p[i].ay * iz;
            if (fabs(x) > 1.0 || fabs(y) > 1.0) {
                parent.p[i].color = 0;
                parent.p[i].ax = frand(1.0);
                parent.p[i].ay = frand(1.0);
            }

            parent.p[i].setTrueColor(parent.pe);
            parent.p[i].dx = (x - lx) * halfw;
            parent.p[i].dy = (y - ly) * halfh;
            parent.p[i].x = lx * halfw + halfw;
            parent.p[i].y = ly * halfh + halfh;
        }

        starsinit.value = 1;
    }

    frameGravity() {
        var parent = this.parent;

        switch (((parent.time - parent.startTime) / this.GRAV_TIME) % 4) {
            case 0: this.xgrav = 0; this.ygrav = GRAVITY; this.burnDown = false; break;
            case 1: this.xgrav = -GRAVITY; this.ygrav = 0; break;
            case 2: this.xgrav = 0; this.ygrav = -GRAVITY; this.burnDown = true; break;
            case 3: this.xgrav = GRAVITY; this.ygrav = 0; break;
        }

        // Randomly cause particle effects to happen.
        if (parent.time > parent.lastTime && this.useRandom) {
            // Randomly change things
            if (rand() % this.RANDEFFECT == 0) {
                // Randomly modify the effects and styles
                switch (rand() % 7) {
                    case 0 :
                        this.shakeUp = true;
                        break;  // Modifier
                    case 1 :
                        this.freeze = true;
                        break;  // Modifier
                    case 2 :
                        this.comet = true;
                        break;
                    case 3 :
                        this.follow = !this.follow;
                        break;  // Modifier
                    case 4 :
                        this.multipleFollow = !this.multipleFollow;
                        break;  // Modifier
                    case 5 :
                        this.noiseBurn = rand() % 3 - 1;
                        break;  // Modifier
                    case 6 :
                        this.useGravity = !this.useGravity;
                        break;  // Modifier
                }
            } // End, Randomly change things
        }

        // Set states based on the Particle Style
        if (this.particleStyle === ParticleParticle.STYLE_NORMAL) {
            // Randomly change things
            if (rand() % (this.RANDEFFECT * 16) === 0) {
                // Randomly cycle through the modes
                switch (rand() % 8) {
                    case 0:
                        this.setMode(ParticleParticle.STYLE_SPIRALS);
                        break;
                    case 1:
                        this.setMode(ParticleParticle.STYLE_EXPLOSIVE);
                        break;
                    case 2:
                        this.setMode(ParticleParticle.STYLE_RINGS);
                        break;
                    case 3:
                        this.setMode(ParticleParticle.STYLE_POPCORN);
                        break;
                    case 4:
                        this.setMode(ParticleParticle.STYLE_RAINBOWHOLE);
                        this.doRainbowHole(1);
                        break;
                    case 5:
                        this.setMode(ParticleParticle.STYLE_WORMS);
                        break;
                    case 6:
                        this.setMode(ParticleParticle.STYLE_GALATIC_STORM);
                        break;
                    case 7:
                        this.setMode(ParticleParticle.STYLE_PIXIE_DUST);
                        break;
                }
            }
        } else {
            this.setMode(this.particleStyle);
        }

        // Check Following the mouse
//        if(this.follow == false && (rand() % 4) == 0) {
//           this.followMouse = true;
//           this.parent.XMouse = rand() % this.parent.screen.width;
//           this.parent.YMouse = rand() % this.parent.screen.height;
//        } else {
//           this.followMouse = false;
//        }

        this.handleGravity();
    }

    handleGravity() {
        if (this.popcorn) {
            this.doPopcorn();
        }

        if (this.innerRing) {
            this.doInnerRing();
        }

        //Shake particles up when left button pressed.
        if (this.shakeUp) {
            this.doShakeUp();
        }

        //Freeze particles when right button pressed.
        if (this.freeze) {
            this.doFreeze();
        }

        //Explode particles when space bar pressed.
        if (this.explode) {
            this.doExplode();
        }

        //Create a comet particle when enter is pressed.
        if (this.comet) {
            this.doComet();
        }

        //Drop particles from center of screen when backspace pressed.
        if (this.emit) {
            this.doEmit();
        }

        // GH-New Modes
        if (this.rainbowHole) {
            this.doRainbowHole();
        }

        if (this.squigglyWiggly) {
            this.doSquigglyWiggly();
        }

        if (this.galacticStorm) {
            this.doGalacticStorm();
        }

        if (this.pixieDust) {
            this.doPixieDust();
        }

        // Test Particle
        if (this.particleStyle == ParticleParticle.STYLE_GEOFF) {
            this.doGeoff();
        }

        // Debug
//        if (this.particleStyle == ParticleParticle.STYLE_STATIC) {
//            this.doStatic();
//        }

        // Attract or Follow the Mouse (left over from Particle Toy?)
        if (this.attract || this.followMouse) {
            this.doAttractFollow();
        }

        // Purpose of this?  To swing particles around in a circular pattern?
        this.identityAngle += 0.01;
        if (this.identityAngle > Math.PI) {
            this.identityAngle -= Math.PI * 2.0;
        }
    }

    doPopcorn() {
        console.log('pop corn');

        var firstInit = Static.init('doPopcorn.firstInit', 0);

        var parent = this.parent;
        if (this.particleStyle != ParticleParticle.STYLE_POPCORN || firstInit.value == 0 || (this.particleStyle == ParticleParticle.STYLE_POPCORN && rand() % 50 == 0)) {
            firstInit.value = 1; // Do this at least once

            for (var n = rand() % 15 + 5; n; n--) {
                // 6.0 + 1.0
                var velocity = fabs(frand(6.0)) + 1.0;
                var ex, ey;
                var sunburst = rand() & 1;
                var pnt = rand() % this.nParticles;
                //
                ex = parent.p[pnt].x;
                ey = parent.p[pnt].y;
                //
                var pvel, angle;
                for (var ii = this.nParticles / 20; ii; ii--) {
                    var i = rand() % this.nParticles;
//                    parent.p[i].attract = ParticleScreen.ATTRACT_GRAVITY;
                    parent.p[i].x = ex;
                    parent.p[i].y = ey;
                    if (sunburst) {
                        pvel = velocity * 0.5;
                    } else {
                        pvel = fabs(frand(velocity));
                    }
                    angle = frand(Math.PI);
                    parent.p[i].dx = Math.cos(angle) * pvel;
                    parent.p[i].dy = Math.sin(angle) * pvel;
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
            }

            this.popcorn = false;
        }
    }

    doInnerRing() {
        console.log('inner ring');

        var parent = this.parent;

        var firstInit = Static.init('doInnerRing.firstInit', 0);

        if (this.articleStyle != ParticleParticle.STYLE_RINGS || firstInit.value == 0 || (this.particleStyle == ParticleParticle.STYLE_RINGS && rand() % 1000 == 0) ) {
            firstInit.value = 1; // Do this at least once

            var velocity = fabs(frand(10.0)) + 2.0;
            var pvel, angle;
            var exprob = (rand() % 3) + 1;
            var size = fabs(frand(0.5)) + 0.4;
            var w2 = parent.screen.WIDTH * size * 0.5;
            var h2 = parent.screen.HEIGHT * size * 0.5;
            var sunburst = rand() & 1;
            var rot = rand() % 4;
            var rx = parent.screen.WIDTH / 2.0 + frand(parent.screen.WIDTH / 2.0 - w2);
            var ry = parent.screen.HEIGHT / 2.0 + frand(parent.screen.HEIGHT / 2.0 - h2);
            for (var i = 0; i < this.nParticles; i++) {
                if (i % exprob == 0) {
                    angle = frand(Math.PI);
                    parent.p[i].x = rx + Math.sin(angle) * h2;
                    parent.p[i].y = ry - Math.cos(angle) * h2;
                    if (sunburst) {
                        pvel = velocity * 0.5;
                    } else {
                        pvel = fabs(frand(velocity));
                    }

                    if (rot == 1) {
                        pvel = 0.0;    //Frozen ring.
                    }
                    if (rot == 2) {
                        angle += Math.PI * 0.5;    //0 produces no rotation.
                    }
                    if (rot == 3) {
                        angle -= Math.PI * 0.5;
                    }
                    parent.p[i].dx = -Math.sin(angle) * pvel;
                    parent.p[i].dy = Math.cos(angle) * pvel;
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
            }
            this.innerRing = false;
        }
    }

    doShakeUp() {
        console.log('shake up');

        var parent = this.parent;
        for (var i = 0; i < this.nParticles; i++) {
            parent.p[i].dx -= this.xgrav * 40;
            parent.p[i].dy -= this.ygrav * 40;
        }

        this.shakeUp = false;
    }

    doFreeze() {
        console.log('freeze');

        var parent = this.parent;

        for (var i = 0; i < this.nParticles; i++) {
            parent.p[i].dx = 0.0;
            parent.p[i].dy = 0.0;
        }
        this.freeze = false;
    }

    doStatic(init) {
        var parent = this.parent;

        var firstInit = Static.init('doStatic.firstInit', 0);
        
        if (init || firstInit.value == 0) {
            firstInit.value = 1;

            var w = parent.screen.width;
            var h = parent.screen.height;
            var t = this.nParticles;

            var u = Math.sqrt(w * h / t);   // square length
            var m = Math.ceil(w / u);       // columns
            var n = Math.ceil(t / m);       // rows
            var offsetX = Math.floor(w / (m + 1));      // offset
            var offsetY = Math.floor(h / (n + 1));

            var y = offsetY;
            var x = offsetX;
            for (var i = 0; i < t; i++) {
                parent.p[i].x = x;
                parent.p[i].y = y;
                
                var tx = x - w/2, ty = y - h/2;
                var d = Math.sqrt(tx * tx + ty * ty);

                parent.p[i].dx = - tx / d;
                parent.p[i].dy = - ty / d;
                parent.p[i].color = 180;
                parent.p[i].setTrueColor(parent.pe);

                x += offsetX;
                if (x >= w) {
                    x = offsetX;
                    y += offsetY;
                }
            }
        }

//        for(var i = 0; i < t; i++) {
//            parent.p[i].dx = 0.0;
//            parent.p[i].dy = 0.0;
//
//            if (this.altColor) {
//                parent.p[i].color = rand() % 84 + 170;
//            }
//
//            parent.p[i].setTrueColor(parent.pe);
//        }
    }

    doExplode() {
        var parent = this.parent;
        
        var firstInit = Static.init('doExplode.firstInit', 0);
        
        if (this.particleStyle !== ParticleParticle.STYLE_EXPLOSIVE || firstInit.value == 0 || (this.particleStyle == ParticleParticle.STYLE_EXPLOSIVE && rand() % 50 == 0)) {
            console.log('explode');

            firstInit.value = 1; // Do this at least once

            var velocity = fabs(frand(9.0)) + 3.0;
            var ex, ey;
            var sunburst = rand() & 1;
            if (this.explodeX == 0 || this.explodeY == 0) {
                ex = (ParticleScreen.XOFF + rand() % (parent.screen.WIDTH - ParticleScreen.XOFF * 2));
                ey = (ParticleScreen.YOFF + rand() % (parent.screen.HEIGHT - ParticleScreen.YOFF * 2));
            } else {
                ex = __min(__max(this.explodeX, ParticleScreen.XOFF), parent.screen.WIDTH - ParticleScreen.XOFF - 1);
                ey = __min(__max(this.explodeY, ParticleScreen.YOFF), parent.screen.HEIGHT - ParticleScreen.YOFF - 1);
            }
            this.explodeX = this.explodeY = 0;
            var pvel, angle;
            var exprob = (rand() % 3) + 1;
            for (var i = 0; i < this.nParticles; i++) {
                // pourquoi je dois l'ajouter ici?
//                parent.p[i].attract = ParticleScreen.ATTRACT_GRAVITY;
                if (i % exprob == 0) {
                    parent.p[i].x = ex;
                    parent.p[i].y = ey;
                    if (sunburst) {
                        pvel = velocity * 0.5;
                    } else {
                        pvel = fabs(frand(velocity));
                    }
                    angle = frand(Math.PI);
                    parent.p[i].dx = Math.cos(angle) * pvel;
                    parent.p[i].dy = Math.sin(angle) * pvel;
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }

                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
            }
            this.explode = false;
        }
    }

    doComet() {
        console.log('comet');

        var parent = this.parent;
        var velocity = fabs(frand(8.0));
        var ex = (ParticleScreen.XOFF + rand() % (parent.screen.WIDTH - ParticleScreen.XOFF * 2));
        var ey = (ParticleScreen.YOFF + rand() % (parent.screen.HEIGHT - ParticleScreen.YOFF * 2));
        var angle = frand(Math.PI);
        for (var i = 0; i < this.nParticles; i++) {
            parent.p[i].x = ex + frand(1.0);
            parent.p[i].y = ey + frand(1.0);
            parent.p[i].dx = Math.cos(angle) * velocity;
            parent.p[i].dy = Math.sin(angle) * velocity;
            if (this.altColor) {
                parent.p[i].color = rand() % 84 + 170;
            }

            parent.p[i].setTrueColor(parent.pe);
        }
        this.comet = false;
    }

    doEmit() {
        console.log('emit');
        var parent = this.parent;
        
        var firstInit = Static.init('doEmit.firstInit', 0);

        if (this.particleStyle != ParticleParticle.STYLE_SPIRALS || firstInit.value == 0 || (this.particleStyle == ParticleParticle.STYLE_SPIRALS && rand()%500 == 0) ) {
            firstInit.value = 1; // Do this at least once
            var i;
            this.emitCount = this.nParticles;

            if (this.emitCount > 0) {
                var angscale = (Math.PI * 2.0) / (this.nParticles / 4.0);
                if (this.emitRotate < 0) {
                    angscale = -angscale;
                }
                i = this.emitCount;
                if (!this.firstInit) {
                    this.emitCount = __max(this.emitCount - __max(this.nParticles / 100, 1), 0);
                }

                while (i-- > this.emitCount) {
                    parent.p[i].x = (parent.screen.WIDTH / 2);
                    parent.p[i].y = (parent.screen.HEIGHT / 2);
                    if (this.emitRotate != 0) {
                        parent.p[i].dx = Math.sin(i * angscale) * 4.0;
                        parent.p[i].dy = -Math.cos(i * angscale) * 4.0;
                    } else {
                        parent.p[i].dx = 0.0;
                        parent.p[i].dy = 0.0;
                    }

                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }

                    parent.p[i].setTrueColor(parent.pe);
                }
                this.emit = false;
            }
        }
    }

    doAttractFollow() {
        var parent = this.parent;
        var i;

        var tt = (this.multipleFollow ? 63 : 0x7fff);

        for (i = 0; i < this.nParticles; i++) {
            if (this.follow && i & tt) {
                if (this.followMouse && ((i & tt) == 0)) {
                    parent.p[i].ax = parent.xMouse;
                    parent.p[i].ay = parent.yMouse;
                } else {
                    parent.p[i].ax = parent.p[i & ~tt].x;
                    parent.p[i].ay = parent.p[i & ~tt].y;
                }
                parent.p[i].attract = ParticleScreen.ATTRACT_ANGLE | (this.useGravity ? ParticleScreen.ATTRACT_GRAVITY : 0);
            } else {
                if (this.followMouse) {
                    parent.p[i].ax = parent.xMouse;
                    parent.p[i].ay = parent.yMouse;
                    parent.p[i].attract = ParticleScreen.ATTRACT_ANGLE | (this.useGravity ? ParticleScreen.ATTRACT_GRAVITY : 0);
                } else {
                    parent.p[i].attract = ParticleScreen.ATTRACT_NONE | (this.useGravity ? ParticleScreen.ATTRACT_GRAVITY : 0);
                }
                parent.p[i].setTrueColor(parent.pe);    //Make leaders constantly change true color.
            }
        }
    }

    doRainbowHole(initNow) {
        console.log('rainbow hole');
        
        var parent = this.parent;
        
        var init = Static.init('doRainbowHole.init', 0);        // Has this style been init'd?
        var velocity = Static.init('doRainbowHole.velocity', 0);
        
        // Randomly re-init the pepper
        //	if (rand()%175 == 0 || !init)
        if (!init.value || initNow || (this.particleStyle == ParticleParticle.STYLE_RAINBOWHOLE && rand()%1000 == 0)) {
            // Create velocity
            velocity.value = __max(fabs(frand(6.0)), 1.0);

            // Randomly pick new magnet point
            this.magnetX = parent.screen.WIDTH/2 + rand() % 100 - 50;
        
            // If we are burning up
            if (!this.burnDown) {
                this.magnetY = __min(parent.screen.HEIGHT/2 + rand()%80 - 40 + (parent.screen.HEIGHT/4), parent.screen.HEIGHT-20);
            } else {
                this.magnetY = __max(parent.screen.HEIGHT/2 + rand()%80 - 40 - (parent.screen.HEIGHT/4), 20);
            }
                
            // Cycle through the particles
            for (var i = 0; i < this.nParticles; i++) {
                // Randomly place the particles on the screen
                parent.p[i].x = rand() % parent.screen.WIDTH;
                parent.p[i].y = rand() % parent.screen.HEIGHT;

                // Point to the movement direction at the Magnet point
                var dist = this.distance(parent.p[i].x, parent.p[i].y, this.magnetX, this.magnetY);
                parent.p[i].dx = ( (this.magnetX - parent.p[i].x) / dist) * velocity.value;
                parent.p[i].dy = ( (this.magnetY - parent.p[i].y) / dist) * velocity.value;

                // Randomly set color
                if (this.altColor) {
                    parent.p[i].color = rand() % 84 + 170;
                }
            
                parent.p[i].setTrueColor(parent.pe);
            }

            init.value = 1;     // Make sure we've init'd the style
        } else {
            if (rand()%10 == 0) {
                // Move the magnet to the right or left
                this.magnetX += rand()%10 - 5;
                if (this.magnetX < 30) {
                    this.magnetX = 30;
                } else if (this.magnetX > parent.screen.WIDTH-30) {
                    this.magnetX = parent.screen.WIDTH-30;
                }
                // MagnetX = parent.screen.WIDTH/2 + rand()%100 - 50;

                // Cycle through the particles
                for (var i = 0; i < this.nParticles; i++) {
                    // Point to the movement direction at the Magnet point
                    var dist = this.distance(parent.p[i].x, parent.p[i].y, this.magnetX, this.magnetY);
                    parent.p[i].dx = ( (this.magnetX - parent.p[i].x) / dist) * velocity.value;
                    parent.p[i].dy = ( (this.magnetY - parent.p[i].y) / dist) * velocity.value;

                    // Randomly set color
                    //if(AltColor) parent.p[i].color = rand() % 254;
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
            }
        }
    }
    
    distance(x1, y1, x2, y2) {
        var dist;
        var tx, ty;         // Temp
    
        // Check Special Cases //
        if (x1 == x2) {
            return fabs(y1 - y2);
        }
        if (y1 == y2) {
            return fabs(x1 - x2);
        }

        tx = x1 - x2;   // Set initial x distances //
        ty = y1 - y2;   // Dont need to abs() them since their going to be squared //

        dist = Math.sqrt((tx * tx) + (ty * ty));    // Dist. Formula //

        return dist;
    } /// vtMath::Distance()

    doSquigglyWiggly(init) {
        console.log('squiggly wiggly');
        var parent = this.parent;

        var firstInit = Static.init('doSquigglyWiggly.firstInit', 0);
        var velocity, angle;

        // If we're initing the routine
        if (init || !firstInit.value || rand() % 1500 == 0) {
            // Cycle through the particles
            for (var i=0; i < this.nParticles; i++) {
                // Random position of the particle
                parent.p[i].x = rand() % (parent.screen.WIDTH-20) + 10;
                parent.p[i].y = rand() % (parent.screen.HEIGHT-20) + 10;
                //
                if (this.altColor) {
                    parent.p[i].color = rand() % 84 + 170;
                }
                //
                parent.p[i].setTrueColor(parent.pe);
            }
        }

        // Create velocity
        velocity = __max(fabs(frand(6.0)), 1.0);

        for (var i=0; i < this.nParticles; i++) {
            // If this is a leader particle
            if (i % 5 === 0) {
                // Randomly change direction
                if (rand() % 100) {
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                }
            } else {
                // Follower particle
                var leader = i - i%5;   // Save the leader particle

                // Move this particle automatically the DX/DY of the leader so that it keeps pace.  This way the particles movement will all be about circling
                parent.p[i].x += parent.p[i].dx;
                parent.p[i].y += parent.p[i].dy;

                // Circle around the leader, twice the velocity?
    //			int lx = parent.p[leader].x, ly = parent.p[leader].y;

                // Set circular delta
                angle = frand(Math.PI);
                parent.p[i].dx = cos(angle) * velocity;
                parent.p[i].dy = sin(angle) * velocity;
                //
                if (this.altColor) {
                    parent.p[i].color = rand() % 84 + 170;
                }
                //
                parent.p[i].setTrueColor(parent.pe);
            }
        }
    }

    doGalacticStorm(init) {
        console.log('galactic storm');
        var parent = this.parent;
        
        var firstInit = Static.init('doGalacticStorm.firstInit', 0);
        var velocity, angle;

        var leaderPartition = 25;       // Partition between leaders (number of followers to leaders)

        // Create velocity
        velocity = fabs(frand(6.0));
        velocity = __max(velocity, 1.0);

        // Init the particles, either the first time we start the routine, or when we are told to
        if (init || !firstInit.value || rand() % 1500 == 0) {
            // Cycle through particles
            for (var i=0; i < this.nParticles; i++) {
                // If this is a leader particle
                if (i % leaderPartition == 0) {
                    // Random position of the particle
                    parent.p[i].x = rand() % (parent.screen.WIDTH-20) + 10;
                    parent.p[i].y = rand() % (parent.screen.HEIGHT-20) + 10;

                    // Random directions
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                    //
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
                // Dont need to do anything for the non-leaders, as they are updated every frame
            }
            
            firstInit.value = 1;
        }

        // Cycle through particles
        for (var i=0; i < this.nParticles; i++) {
            // If this is a leader particle
            if (i % leaderPartition == 0) {
                // Randomly change direction
                if (rand() % 10000) {
                    // Random directions
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                }
            } else {
                // Follower particle
                // Save the leader particle
                var leader = i - (i % leaderPartition);

                // Move this particle automatically the DX/DY of the leader so that it keeps pace.  This way the particles movement will all be about circling
                parent.p[i].x += parent.p[i].dx;
                parent.p[i].y += parent.p[i].dy;

                // Circle around the leader, twice the velocity?
    //			int lx = parent.p[leader].x, ly = parent.p[leader].y;

                // Set circular delta
                angle = frand(Math.PI);
    //			parent.p[i].dx = cos(angle) * velocity;
                parent.p[i].dx = Math.sin(angle) * velocity;
                parent.p[i].dy = Math.sin(angle) * velocity;
                //
                if (this.altColor) {
                    parent.p[i].color = rand() % 84 + 170;
                }
                //
                parent.p[i].setTrueColor(parent.pe);
            }
        }
    }

    doPixieDust(init) {
        console.log('pixie dust');

        var firstInit = Static.init('doPixieDust.firstInit', 0);
        
        var parent = this.parent;
        var velocity, angle;

        var leaderPartition = 5;        // Partition between leaders (number of followers to leaders)
        var randDist = 5.0;         // Random distance from the leader particle

        var lastLeader;
        var buffer, bufferRand;

        // Create velocity
        velocity = fabs(frand(10.0));
        velocity = __max(velocity, 1.0);

        // Init the particles, either the first time we start the routine, or when we are told to
        if (init || !firstInit.value || rand() % 1500 == 0) {
            // Cycle through particles
            for (var i=0; i < this.nParticles; i++) {
                // If this is a leader particle
                if (i % leaderPartition == 0) {
                    lastLeader = i;

                    // Random position of the particle
                    parent.p[i].x = rand() % (parent.screen.WIDTH-20) + 10;
                    parent.p[i].y = rand() % (parent.screen.HEIGHT-20) + 10;

                    // Random directions
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                    //
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
                // Followers
    /*			else
                {
                    // Save the leader particle
    //				int leader = i - (i % leaderPartition);
                    int leader = lastLeader;

                    // Set this particle to the position of its leader, with an offset
                    float buffer_x, buffer_y;
                    buffer_x = frand (randDist) - randDist/2.0;
                    buffer_y = frand (randDist) - randDist/2.0;

                    parent.p[i].x = parent.p[leader].x + buffer_x;
                    parent.p[i].y = parent.p[leader].y + buffer_y;
                }*/
            }

            // Make sure the first init has been marked
            firstInit.value = 1;
        }

        // Cycle through particles
        for (var i=0; i < this.nParticles; i++) {
            // If this is a leader particle
            if (i % leaderPartition == 0) {
                lastLeader = i;

                // Randomly change direction
                if (rand() % 50 == 0) {
                    // Random directions
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                    //
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    //
                    parent.p[i].setTrueColor(parent.pe);
                }
            } else {
                // Follower particle

                // Save the leader particle
                var leader = lastLeader;

                // Move this particle automatically the DX/DY of the leader so that it keeps pace.  This way the particles movement will all be about circling
                bufferRand = frand(randDist);
                buffer = bufferRand - (randDist/2.0);
                if (buffer < 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = -randDist/4.0;
                } else if (buffer > 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = randDist/4.0;
                }
                //
    //			parent.p[i].x = parent.p[leader].x + buffer + parent.p[leader].dx;
                parent.p[i].x = parent.p[leader].x + buffer;
                //
                bufferRand = frand(randDist);
                buffer = bufferRand - (randDist/2.0);
                if (buffer < 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = -randDist/4.0;
                } else if (buffer > 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = randDist/4.0;
                }
                //
    //			parent.p[i].y = parent.p[leader].y + buffer + parent.p[leader].dx;
                parent.p[i].y = parent.p[leader].y + buffer;

                // Set circular delta
                angle = frand(Math.PI);
                parent.p[i].dx = parent.p[leader].dx / 3.0;//0;
                parent.p[i].dy = parent.p[leader].dy / 3.0;//0;
    /*			parent.p[i].dx = 0;
                parent.p[i].dy = 0;*/

                //
                if (this.altColor) {
                    parent.p[i].color = rand() % 84 + 170;
                }
                //
                parent.p[i].setTrueColor(parent.pe);
            }
        }
    }

    // Atomic particles
    doGeoff(init) {
        console.log('geoff');

        var firstInit = Static.init('doGeoff.firstInit', 0);
        
        var velocity, angle;

        var leaderPartition = 5;        // Partition between leaders (number of followers to leaders)
        var randDist = 5.0;         // Random distance from the leader particle

        var lastLeader;
        var buffer, bufferRand;

        // Create velocity
        velocity = fabs(frand(10.0));
        velocity = __max(velocity, 1.0);

        // Init the particles, either the first time we start the routine, or when we are told to
        if (init || !firstInit.value || rand() % 1500 == 0) {
            // Cycle through particles
            for (var i=0; i < this.nParticles; i++) {
                // If this is a leader particle
                if (i % leaderPartition == 0) {
                    lastLeader = i;

                    // Random position of the particle
                    parent.p[i].x = rand() % (parent.screen.WIDTH-20) + 10;
                    parent.p[i].y = rand() % (parent.screen.HEIGHT-20) + 10;

                    // Random directions
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                    //
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    parent.p[i].setTrueColor(parent.pe);
                }
                // Followers
    /*			else
                {
                    // Save the leader particle
    //				var leader = i - (i % leaderPartition);
                    var leader = lastLeader;

                    // Set this particle to the position of its leader, with an offset
                    var buffer_x, buffer_y;
                    buffer_x = frand (randDist) - randDist/2.0;
                    buffer_y = frand (randDist) - randDist/2.0;

                    parent.p[i].x = parent.p[leader].x + buffer_x;
                    parent.p[i].y = parent.p[leader].y + buffer_y;
                }*/
            }

            // Make sure the first init has been marked
            firstInit.value = 1;
        }

        // Cycle through particles
        for (var i=0; i < this.nParticles; i++) {
            if (i % leaderPartition == 0) {
                // If this is a leader particle

                lastLeader = i;

                // Randomly change direction
                if (rand() % 50 == 0) {
                    // Random directions
                    parent.p[i].dx = frand(1.0) * velocity;
                    parent.p[i].dy = frand(1.0) * velocity;
                    //
                    if (this.altColor) {
                        parent.p[i].color = rand() % 84 + 170;
                    }
                    parent.p[i].setTrueColor(parent.pe);
                }
            } else {
                // Follower particle

                // Save the leader particle
                var leader = lastLeader;

                // Move this particle automatically the DX/DY of the leader so that it keeps pace.  This way the particles movement will all be about circling
                bufferRand = frand(randDist);
                buffer = bufferRand - (randDist/2.0);
                if (buffer < 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = -randDist/4.0;
                } else if (buffer > 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = randDist/4.0;
                }

    //			parent.p[i].x = parent.p[leader].x + buffer + parent.p[leader].dx;
                parent.p[i].x = parent.p[leader].x + buffer;
                //
                bufferRand = frand(randDist);
                buffer = bufferRand - (randDist/2.0);
                if (buffer < 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = -randDist/4.0;
                } else if (buffer > 0.0 && fabs(buffer) < randDist/4.0) {
                    buffer = randDist/4.0;
                }
                //
    //			parent.p[i].y = parent.p[leader].y + buffer + parent.p[leader].dx;
                parent.p[i].y = parent.p[leader].y + buffer;

                // Set circular delta
                angle = frand(Math.PI);
                parent.p[i].dx = parent.p[leader].dx / 3.0;//0;
                parent.p[i].dy = parent.p[leader].dy / 3.0;//0;
    /*			parent.p[i].dx = 0;
                parent.p[i].dy = 0;*/

                //
                if (this.altColor) {
                    parent.p[i].color = rand() % 84 + 170;
                }
                //
                parent.p[i].setTrueColor(parent.pe);
            }
        }
    }
}

ParticleParticle.STYLE_NORMAL = 0;
ParticleParticle.STYLE_STARFIELD = 1;
ParticleParticle.STYLE_EXPLOSIVE = 2;
ParticleParticle.STYLE_RINGS = 3;
ParticleParticle.STYLE_SPIRALS = 4;
ParticleParticle.STYLE_POPCORN = 5;
ParticleParticle.STYLE_RAINBOWHOLE = 6;
ParticleParticle.STYLE_WORMS = 7;
ParticleParticle.STYLE_GALATIC_STORM = 8;
ParticleParticle.STYLE_PIXIE_DUST = 9;
ParticleParticle.STYLE_GEOFF = 10;
ParticleParticle.STYLE_STATIC = 11;

ParticleParticle.styles = [];
ParticleParticle.styles[ParticleParticle.STYLE_NORMAL] = "Normal";
ParticleParticle.styles[ParticleParticle.STYLE_STARFIELD] = "Starfield";
ParticleParticle.styles[ParticleParticle.STYLE_EXPLOSIVE] = "Explosive";
ParticleParticle.styles[ParticleParticle.STYLE_RINGS] = "Rings";
ParticleParticle.styles[ParticleParticle.STYLE_SPIRALS] = "Spirals";
ParticleParticle.styles[ParticleParticle.STYLE_POPCORN] = "Popcorn";
ParticleParticle.styles[ParticleParticle.STYLE_RAINBOWHOLE] = "Rainbow Hole";
ParticleParticle.styles[ParticleParticle.STYLE_WORMS] = "Worms";
ParticleParticle.styles[ParticleParticle.STYLE_GALATIC_STORM] = "Galactic Storm";
ParticleParticle.styles[ParticleParticle.STYLE_PIXIE_DUST] = "Pixie Dust";
ParticleParticle.styles[ParticleParticle.STYLE_GEOFF] = "Geoff";
ParticleParticle.styles[ParticleParticle.STYLE_STATIC] = "Static";

export { ParticleParticle }
