export enum ColorFormat {
    HEX = "HEX",
    HEXA = "HEXa",
    RGB = "RGB",
    RGBA = "RGBa",
    HSL = "HSL",
    HSLA = "HSLa",
    HSV = "HSV",
}

export abstract class Color {
  abstract format: ColorFormat;

  public red: number;
  public green: number;
  public blue: number;
  public alpha: number;

  constructor(red: number, green: number, blue: number, alpha: number = 1) {
      this.red = red;
      this.green = green;
      this.blue = blue;
      this.alpha = alpha; 
  }

  abstract addAlpha(alpha: number): Color;
  abstract toString(): string;
  abstract to(format: ColorFormat): Color;
  clone(): Color {
      return this.to(this.format);
  }

}

