import {Color, ColorFormat} from "./Color";
import HSLAColor from "./HSLAColor";
import HSVColor from "./HSVColor";
import HEXColor from "./HEXColor";
import HEXAColor from "./HEXAColor";
import RGBAColor from "./RGBAColor";
import RGBColor from "./RGBColor";
import {hslToRgb, rgbToHsl} from "./utils";

export default class HSLColor extends Color {
    format: ColorFormat = ColorFormat.HSL;

    hue: number;
    saturation: number;
    lightness: number;

    constructor(red: number, green: number, blue: number, hue: number, saturation: number, lightness: number) {
        super(red, green, blue);

        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
    }

    static fromString(colorString: string): HSLColor {
        const hslRegex = /^hsl\(\s*([0-9]{1,3}(?:\.[0-9]+)?),\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*\)$/;
        const match = colorString.match(hslRegex);

        if (!match) throw new Error("Invalid HSL color string");

        const h = parseFloat(match[1]);
        const s = parseFloat(match[2]);
        const l = parseFloat(match[3]);

        if (h < 0 || h > 360) throw new Error("Invalid HSL color string");
        if (s < 0 || s > 100) throw new Error("Invalid HSL color string");
        if (l < 0 || l > 100) throw new Error("Invalid HSL color string");

        const [red, green, blue] = hslToRgb(h, s, l);

        return new HSLColor(red, green, blue, h, s, l);
    }

    static fromRGB(red: number, green: number, blue: number): HSLColor {
        return new HSLColor(red, green, blue, ...rgbToHsl(red, green, blue));
    }

    to(format: ColorFormat): Color {
        switch (format) {
        case ColorFormat.RGB:
            return new RGBColor(this.red, this.green, this.blue);
        case ColorFormat.RGBA:
            return new RGBAColor(this.red, this.green, this.blue, 1);
        case ColorFormat.HEX:
            return new HEXColor(this.red, this.green, this.blue);
        case ColorFormat.HEXA:
            return new HEXAColor(this.red, this.green, this.blue, 1);
        case ColorFormat.HSL:
            return new HSLColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness);
        case ColorFormat.HSLA:
            return new HSLAColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, 1);
        case ColorFormat.HSV:
            return HSVColor.fromHSL(this.hue, this.saturation, this.lightness);
        default:
            throw new Error("Invalid color format");
        }
    }

    addAlpha(alpha: number): HSLAColor {
        return new HSLAColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, alpha);
    }

    toString(): string {
        return `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`;
    }

}