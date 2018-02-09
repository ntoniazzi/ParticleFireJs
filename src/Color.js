class Color
{
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    toHexValue() {
        var red = this.red.toString(16).padStart(2, "0");
        var green = this.green.toString(16).padStart(2, "0");
        var blue = this.blue.toString(16).padStart(2, "0");
        return `#${red}${green}${blue}`;
    }
/*
  setTrueColor(entry) {
    this.red = entry.red;
    this.green = entry.green;
    this.blue = entry.blue;
  }

  get color() {
    return this.red;
  }

  set color(color) {
    this.red = this.green = this.blue = color;
  }
*/
};

export { Color };
