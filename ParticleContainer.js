
class ParticleContainer
{
    constructor() {
        this.particle = null;
        this.screen = null;

        this.xMouse = 0;
        this.yMouse = 0;
        this.timeStart = 0;
        this.timeLast = 0;
        this.time = 0;

        this.p = [];
        this.pe = [];
        for (var i = 0; i < 256; i++) {
            this.pe[i] = new Color(0,0,0);
        }
        this.cf = 0;
        this.ct = 0;
    }
    frame() {
        this.handleParticleStyle();
        this.handleScreen();
    }

    handleParticleStyle() {
        this.particle.frame();
    }

    handleScreen() {
        this.screen.draw();
    }
}
