import {Color, ColorFormat} from "./Color";
import HSLColor from "./HSLColor";
import HEXColor from "./HEXColor";
import HEXAColor from "./HEXAColor";
import RGBColor from "./RGBColor";
import HSLAColor from "./HSLAColor";
import HSVColor from "./HSVColor";

export default class RGBAColor extends Color {
    format: ColorFormat = ColorFormat.RGBA;

    static fromString(colorString: string): RGBColor {
        const [r, g, b, a] = colorString.replace("rgba(", "").replace(")", "").split(",").map((v) => parseFloat(v.trim()));
        return new RGBAColor(r, g, b, a);
    }
    addAlpha(alpha: number): RGBAColor {
        this.alpha = alpha;
        return this;
    }
    to(format: ColorFormat): Color {
        switch (format) {
        case ColorFormat.HEX:
            return new HEXColor(this.red, this.green, this.blue);
        case ColorFormat.HEXA:
            return new HEXAColor(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.RGBA:
            return new RGBAColor(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.RGB:
            return new RGBColor(this.red, this.green, this.blue);
        case ColorFormat.HSL:
            return HSLColor.fromRGB(this.red, this.green, this.blue);
        case ColorFormat.HSLA:
            return HSLAColor.fromRGBa(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.HSV:
            return HSVColor.fromRGB(this.red, this.green, this.blue);
        default:
            throw new Error("Invalid color format");
        }
    }

    toString(): string {
        return `rgba(${this.red},${this.green},${this.blue},${this.alpha})`;
    }

}