import { Color } from "./Color";

class Palette
{
    constructor(name, color1, color2) {
        this.name = name;
        this.colors = [];

        this.setColors(color1, color2);
    }

    setColors(color1, color2) {
        for (var i = 0; i < 256; i++) {
            if (i < 128) {
                var t = i / 127.0;
                this.colors[i] = new Color(
                    color1.red * t | 0,
                    color1.green * t | 0,
                    color1.blue * t | 0
                );
            } else {
                var t = (i - 127) / 128.0;
                var it = 1.0 - t;
                this.colors[i] = new Color(
                    (color1.red * it + color2.red * t) | 0,
                    (color1.green * it + color2.green * t) | 0,
                    (color1.blue * it + color2.blue * t) | 0
                );
            }
        }
    }
}

Palette.schemes = [
  new Palette("Fiery Orange", new Color(255, 128, 0), new Color(255, 255, 0)),
  new Palette("Skyish Teal", new Color(0, 128, 255), new Color(0, 255, 255)),
  new Palette("Velvet Blue", new Color(64, 64, 128), new Color(192, 192, 255)),
  new Palette("Slimy Green", new Color(32, 128, 32), new Color(160, 255, 160)),
  new Palette("Burning Pink", new Color(255, 64, 64), new Color(255, 192, 192)),
  new Palette("Flaming Metal", new Color(128, 0, 41), new Color(255, 192, 128)),
  new Palette("Custom", new Color(0, 0, 0), new Color(255, 255, 255)),
];

export { Palette };
