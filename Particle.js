class Particle
{
    constructor() {
        //Particle position, velocity, and last position.
        this.x = 0.0;
        this.y = 0.0;
        this.dx = 0.0;
        this.dy = 0.0;
        this.lx = 0.0;
        this.ly = 0.0;

        // Particle's attactor location
        this.ax = 0.0;
        this.ay = 0.0;

        //Flag to use attractor or not.
        this.attract = false;

        //Particle color index.
        this.color = 0;
        this.red = 0;
        this.green = 0;
        this.blue = 0;
    }

    setTrueColor(palette) {
        var color = palette[this.color];

        if (undefined === color) {
            return;
        }

        this.red = color.red;
        this.green = color.green;
        this.blue = color.blue;
    }
};
