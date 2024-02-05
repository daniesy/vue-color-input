import {Color, ColorFormat} from "./Color";
import HEXAColor from "./HEXAColor";
import HSLColor from "./HSLColor";
import HSLAColor from "./HSLAColor";
import RGBAColor from "./RGBAColor";
import RGBColor from "./RGBColor";
import HSVColor from "./HSVColor";

export default class HEXColor extends Color {

    format: ColorFormat = ColorFormat.HEX;

    static fromString(colorString: string): HEXColor {
        return new HEXColor(...HEXColor.extract(colorString));
    }

    private static extract(color: string): [number, number, number] {
    // extract red, green, blue from hex color
        const hex = color.replace("#", "").trim();

        if (hex.length === 3) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);

            return [r, g, b];
        }

        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        return [r, g, b];
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
            throw new Error("Unsupported color format");
        }
    }

    addAlpha(alpha: number): RGBAColor {
        return new RGBAColor(this.red, this.green, this.blue, alpha);
    }

    toString(): string {
        const red = this.red.toString(16).padStart(2, "0");
        const green = this.green.toString(16).padStart(2, "0");
        const blue = this.blue.toString(16).padStart(2, "0");

        return `#${red}${green}${blue}`;
    }
}
