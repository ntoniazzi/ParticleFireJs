class Color
{
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
  
    toHexValue() {
        return `#${this.red.toString(16)}${this.green.toString(16)}${this.blue.toString(16)}`;
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
