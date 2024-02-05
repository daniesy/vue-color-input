import {Color, ColorFormat} from "./Color";
import HSLAColor from "./HSLAColor";
import HSLColor from "./HSLColor";
import HSVColor from "./HSVColor";
import HEXColor from "./HEXColor";
import HEXAColor from "./HEXAColor";
import RGBAColor from "./RGBAColor";

export default class RGBColor extends Color {
    format: ColorFormat = ColorFormat.RGB;

    static fromString(colorString: string): RGBColor {
        const [r, g, b] = colorString.replace("rgb(", "").replace(")", "").split(",").map((v) => parseFloat(v.trim()));
        return new RGBColor(r, g, b);
    }

    addAlpha(alpha: number): RGBAColor {
        return new RGBAColor(this.red, this.green, this.blue, alpha);
    }

    to(format: ColorFormat): Color {
        switch (format) {
        case ColorFormat.HEX:
            return new HEXColor(this.red, this.green, this.blue);
        case ColorFormat.HEXA:
            return new HEXAColor(this.red, this.green, this.blue, 1);
        case ColorFormat.RGB:
            return new RGBColor(this.red, this.green, this.blue);
        case ColorFormat.RGBA:
            return new RGBAColor(this.red, this.green, this.blue, 1);
        case ColorFormat.HSL:
            return HSLColor.fromRGB(this.red, this.green, this.blue);
        case ColorFormat.HSLA:
            return HSLAColor.fromRGBa(this.red, this.green, this.blue, 1);
        case ColorFormat.HSV:
            return HSVColor.fromRGB(this.red, this.green, this.blue);
        default:
            throw new Error("Invalid color format");
        }
    }

    toString(): string {
        return `rgb(${this.red},${this.green},${this.blue})`;
    }

}