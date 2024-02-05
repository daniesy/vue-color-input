import {Color, ColorFormat} from "./Color";
import HSLAColor from "./HSLAColor";
import HSLColor from "./HSLColor";
import HEXColor from "./HEXColor";
import RGBAColor from "./RGBAColor";
import RGBColor from "./RGBColor";

export default class HSVColor extends Color {
    format: ColorFormat = ColorFormat.HSV;

    constructor(red: number, green: number, blue: number, public hue: number, public saturation: number, public value: number) {
        super(red, green, blue);

        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
    }

    to(format: ColorFormat): Color {
        switch (format) {
        case ColorFormat.HEX:
            return new HEXColor(this.red, this.green, this.blue);
        case ColorFormat.RGB:
            return new RGBColor(this.red, this.green, this.blue);
        case ColorFormat.RGBA:
            return new RGBAColor(this.red, this.green, this.blue, 1);
        case ColorFormat.HSL:
            return HSLColor.fromRGB(this.red, this.green, this.blue);
        case ColorFormat.HSLA:
            return HSLAColor.fromRGBa(this.red, this.green, this.blue, 1);
        case ColorFormat.HSV:
            return new HSVColor(this.red, this.green, this.blue, this.hue, this.saturation, this.value);
        default:
            throw new Error("Invalid color format");
        }
    }

    static fromString(colorString: string): HSVColor {
    // convert a hsv string to the HSVColor class
        const hsvRegex = /^hsv\(\s*([0-9]{1,3}(?:\.[0-9]+)?),\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*\)$/;
        const match = colorString.match(hsvRegex);

        if (!match) throw new Error("Invalid HSV color string");

        const h = parseFloat(match[1]);
        const s = parseFloat(match[2]);
        const v = parseFloat(match[3]);

        if (h < 0 || h > 360) throw new Error("Invalid HSV color string");
        if (s < 0 || s > 100) throw new Error("Invalid HSV color string");
        if (v < 0 || v > 100) throw new Error("Invalid HSV color string");

        const [r, g, b] = HSVColor.extract(h, s, v);

        return new HSVColor(r, g, b, h, s, v);
    }

    static extract(hue: number, saturation: number, value: number): [number, number, number] {
        const h = hue / 360, s = saturation / 100, v = value / 100;

        let r: number, g: number, b: number;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        default: r = v, g = p, b = q; break;
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    static fromRGB(red: number, green: number, blue: number): HSVColor {
    // convert r,g,b to h,s,v
        const r = red / 255, g = green / 255, b = blue / 255;
    
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h;

        const v = max;
        const d = max - min;
        const s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                h = 0;
            }
            h /= 6;
        }

        return new HSVColor(red, green, blue, Math.round(h * 360), Math.round(s * 100), Math.round(v * 100));
    }

    static fromHSL(hue: number, saturation: number, lightness: number): HSVColor {
        saturation /= 100;
        lightness /= 100;

        let v = lightness + saturation * Math.min(lightness, 1 - lightness);
        let sv = !v ? 0 : 2 * (1 - lightness / v);

        v *= 100;
        sv *= 100;

        const [red, green, blue] = HSVColor.extract(hue, sv, v);
        return new HSVColor(red, green, blue, hue, sv, v);
    }

    addAlpha(alpha: number): RGBAColor {
        return new RGBAColor(this.red, this.green, this.blue, alpha);
    }

    toString(): string {
        return `hsv(${this.hue},${this.saturation}%,${this.value}%)`;
    }

}