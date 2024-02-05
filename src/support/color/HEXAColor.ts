import {Color, ColorFormat} from "./Color";
import HEXColor from "./HEXColor";
import HSLAColor from "./HSLAColor";
import RGBColor from "./RGBColor";
import RGBAColor from "./RGBAColor";
import HSVColor from "./HSVColor";

export default class HEXAColor extends Color {
    format: ColorFormat = ColorFormat.HEXA;

    static fromString(colorString: string): HEXAColor {
        return new HEXAColor(...HEXAColor.extract(colorString));
    }

    private static extract(color: string): [number, number, number, number] {
        // extract red, green, blue from hex color
        const hex = color.replace("#", "").trim();

        if (hex.length === 4) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            const a = parseInt(hex[4] + hex[4], 16) / 255;

            return [r, g, b, a];
        }

        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a =  parseInt(hex.slice(6, 8), 16) / 255;

        return [r, g, b, a];
    }

    addAlpha(alpha: number): HEXAColor {
        this.alpha = alpha;
        return this;
    }

    to(format: ColorFormat): Color {
        switch (format) {
        case ColorFormat.HEX:
            return new HEXColor(this.red, this.green, this.blue);
        case ColorFormat.HEXA:
            return new HEXAColor(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.RGB:
            return new RGBColor(this.red, this.green, this.blue);
        case ColorFormat.RGBA:
            return new RGBAColor(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.HSL:
        case ColorFormat.HSLA:
            return HSLAColor.fromRGBa(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.HSV:
            return HSVColor.fromRGB(this.red, this.green, this.blue);
        default:
            throw new Error("Unsupported color format");
        }
    }

    toString(): string {
        return `#${this.red.toString(16).padStart(2, "0")}${this.green.toString(16).padStart(2, "0")}${this.blue.toString(16).padStart(2, "0")}${Math.round(this.alpha * 255).toString(16).padStart(2, "0")}`;
    }

}