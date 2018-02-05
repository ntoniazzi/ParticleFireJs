class ParticleParticle
{
    constructor(numParticles, container) {
        this.parent = container;
        this.identityAngle = 3.0;
        this.particleStyle = 0;
        this.zMoveSpeed = 2;
        this.nParticles = numParticles;
        this.GRAV_TIME = 40;
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

        this.starsinit = false;
        this.firstInit = 0;
    }

    frame() {
        var parent = this.parent;
        parent.lastTime = parent.time;
        parent.time = Date.now();

        if (this.particleStyle === STYLE_STARFIELD) {
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
            case STYLE_EXPLOSIVE:
                this.explode = true;
                break;
            case STYLE_RINGS:
                this.innerRing = true;
                break;
            case STYLE_SPIRALS:
                this.emit = true;
                this.emitRotate = (rand() % 3) - 1;
                break;
            case STYLE_POPCORN:
                this.popcorn = true;
                break;
            case STYLE_RAINBOWHOLE:
                this.rainbowHole = true;
                break;
            case STYLE_WORMS:
                this.suigglyWiggly = true;
                break;
            case STYLE_GALATIC_STORM:
                this.galacticStorm = true;
                break;
            case STYLE_PIXIE_DUST:
                this.pixieDust = true;
                break;
            case STYLE_GEOFF:
                break;
        }
    }

    frameStarfield() {
        // Turn off the Wall of Fire for the starfield
        this.noiseBurn = -1;
        var parent = this.parent;
        
        var halfw = parent.screen.width / 2;
        var halfh = parent.screen.height / 2;
        var i128 = 1 / (256 / 2);
        for (var i = 0; i < this.nParticles; i++) {
            parent.p[i].attract = ATTRACT_NONE;
            if (!this.starsinit) {
                parent.p[i].color = rand() % 255;
                parent.p[i].setTrueColor(parent.pe);
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

        this.starsinit = 1;
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
        if (this.particleStyle === STYLE_NORMAL) {
            if (rand() % (this.RANDEFFECT * 16) === 0) {
                switch (rand() % 8) {
                    case 0:
                        this.setMode(STYLE_SPIRALS);
                        break;
                    case 1:
                        this.setMode(STYLE_EXPLOSIVE);
                        break;
                    case 2:
                        this.setMode(STYLE_RINGS);
                        break;
                    case 3:
                        this.setMode(STYLE_POPCORN);
                        break;
                    case 4:
                        this.setMode(STYLE_RAINBOWHOLE);
                        this.doRainbowHole(1);
                        break;
                    case 5:
                        this.setMode(STYLE_WORMS);
                        break;
                    case 6:
                        this.setMode(STYLE_GALATIC_STORM);
                        break;
                    case 7:
                        this.setMode(STYLE_PIXIE_DUST);
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
        if (this.particleStyle == STYLE_GEOFF) {
            this.doGeoff();
        }
        
        // Debug
        if (this.particleStyle == STYLE_STATIC) {
            this.doStatic();
        }

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
        
        var parent = this.parent;
        if (this.particleStyle != STYLE_POPCORN || this.firstInit == 0 || (this.particleStyle == STYLE_POPCORN && rand() % 50 == 0)) {
            this.firstInit = 1; // Do this at least once

            for (var n = rand() % 15 + 5; n; n--) {
                // 6.0 + 1.0
                var velocity = fabs(frand(4.0)) + 4.0;
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
//                    parent.p[i].attract = ATTRACT_GRAVITY;
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
        
        if (this.articleStyle != STYLE_RINGS || this.firstInit == 0 || (this.particleStyle == STYLE_RINGS && rand() % 1000 == 0) ) {
            this.firstInit = 1; // Do this at least once

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

    doStatic() {
        var parent = this.parent;

        if (this.firstInit == 0) {
            this.firstInit = 1;
            
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
                parent.p[i].dx = 0.0;
                parent.p[i].dy = 0.0;
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
//        console.log('explode');
        
        var parent = this.parent;
        if (this.particleStyle !== STYLE_EXPLOSIVE || this.firstInit == 0 || (this.particleStyle == STYLE_EXPLOSIVE && rand() % 50 == 0)) {
            this.firstInit = 1; // Do this at least once

            var velocity = fabs(frand(5.0)) + 3.0;
            var ex, ey;
            var sunburst = rand() & 1;
            if (this.explodeX == 0 || this.explodeY == 0) {
                ex = (XOFF + rand() % (parent.screen.WIDTH - XOFF * 2));
                ey = (YOFF + rand() % (parent.screen.HEIGHT - YOFF * 2));
            } else {
                ex = __min(__max(this.explodeX, XOFF), parent.screen.WIDTH - XOFF - 1);
                ey = __min(__max(this.explodeY, YOFF), parent.screen.HEIGHT - YOFF - 1);
            }
            this.explodeX = this.explodeY = 0;
            var pvel, angle;
            var exprob = (rand() % 3) + 1;
            for (var i = 0; i < this.nParticles; i++) {
                // pourquoi je dois l'ajouter ici?
//                parent.p[i].attract = ATTRACT_GRAVITY;
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
        var ex = (XOFF + rand() % (parent.screen.WIDTH - XOFF * 2));
        var ey = (YOFF + rand() % (parent.screen.HEIGHT - YOFF * 2));
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
        if (this.particleStyle != STYLE_SPIRALS || this.firstInit == 0 || (this.particleStyle == STYLE_SPIRALS && rand()%500 == 0) ) {
            this.firstInit = 1; // Do this at least once
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
                parent.p[i].attract = ATTRACT_ANGLE | (this.useGravity ? ATTRACT_GRAVITY : 0);
            } else {
                if (this.followMouse) {
                    parent.p[i].ax = parent.xMouse;
                    parent.p[i].ay = parent.yMouse;
                    parent.p[i].attract = ATTRACT_ANGLE | (this.useGravity ? ATTRACT_GRAVITY : 0);
                } else {
                    parent.p[i].attract = ATTRACT_NONE | (this.useGravity ? ATTRACT_GRAVITY : 0);
                }
                parent.p[i].setTrueColor(parent.pe);    //Make leaders constantly change true color.
            }
        }
    }

    doRainbowHole() {
        console.log('rainbow hole');
    }

    doSquigglyWiggly() {
        console.log('squiggly wiggly');
    }

    doGalacticStorm() {
        console.log('galactic storm');
    }

    doPixieDust(init) {
        console.log('pixie dust');
        
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
        if (init || !this.firstInit || rand() % 1500 == 0) {
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
            this.firstInit = 1;
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
        
        var velocity, angle;

        var leaderPartition = 5;        // Partition between leaders (number of followers to leaders)
        var randDist = 5.0;         // Random distance from the leader particle

        var lastLeader;
        var buffer, bufferRand;

        // Create velocity
        velocity = fabs(frand(10.0));
        velocity = __max(velocity, 1.0);

        // Init the particles, either the first time we start the routine, or when we are told to
        if (init || !this.firstInit || rand() % 1500 == 0) {
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
            this.firstInit = 1;
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
