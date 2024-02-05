import {Color, ColorFormat} from "./Color";
import HSLColor from "./HSLColor";
import HEXColor from "./HEXColor";
import HEXAColor from "./HEXAColor";
import RGBAColor from "./RGBAColor";
import RGBColor from "./RGBColor";
import HSVColor from "./HSVColor";
import {hslToRgb, rgbToHsl} from "./utils";

export default class HSLAColor extends Color {
    format: ColorFormat = ColorFormat.HSLA;

    public _hue: number;
    public _saturation: number;
    public _lightness: number;

    constructor(red: number, green: number, blue: number, hue: number, saturation: number, lightness: number, alpha: number = 1) {
        super(red, green, blue);

        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
        this.alpha = alpha;
    }

    static fromString(colorString: string): HSLAColor {
        const hslaRegex = /^hsla\(\s*([0-9]{1,3}(?:\.[0-9]+)?),\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9](?:\.[0-9]+)?)\s*\)$/;
        const match = colorString.match(hslaRegex);

        if (!match) throw new Error("Invalid HSLA color string");

        const h = parseFloat(match[1]);
        const s = parseFloat(match[2]);
        const l = parseFloat(match[3]);
        const a = parseFloat(match[4]);

        if (h < 0 || h > 360) throw new Error("Invalid HSLA color string");
        if (s < 0 || s > 100) throw new Error("Invalid HSLA color string");
        if (l < 0 || l > 100) throw new Error("Invalid HSLA color string");
        if (a < 0 || a > 1) throw new Error("Invalid HSLA color string");

        const [r, g, b] = hslToRgb(h, s, l);
    
        return new HSLAColor(r, g, b, h, s, l, a);
    }

    static fromRGBa(red: number, green: number, blue: number, alpha: number): HSLAColor {
        return new HSLAColor(red, green, blue, ...rgbToHsl(red, green, blue), alpha);
    }

    set hue(value: number) {
        this._hue = value;
        [this.red, this.green, this.blue] = hslToRgb(this._hue, this._saturation, this._lightness);
    }
    get hue(): number {
        return this._hue;
    }
    set saturation(value: number) {
        this._saturation = value;
        [this.red, this.green, this.blue] = hslToRgb(this._hue, this._saturation, this._lightness);
    }
    get saturation(): number {
        return this._saturation;
    }

    set lightness(value: number) {
        this._lightness = value;
        [this.red, this.green, this.blue] = hslToRgb(this._hue, this._saturation, this._lightness);
    }
    get lightness(): number {
        return this._lightness;
    }
    get hasAlpha(): boolean {
        return this.alpha !== 1;
    }
    to(format: ColorFormat): Color {
        switch (format) {
        case ColorFormat.HEX:
            return this.hasAlpha ? new HEXAColor(this.red, this.green, this.blue, this.alpha) : new HEXColor(this.red, this.green, this.blue);
        case ColorFormat.HEXA:
            return new HEXAColor(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.RGB:
            return this.hasAlpha ? new RGBAColor(this.red, this.green, this.blue, this.alpha) : new RGBColor(this.red, this.green, this.blue);
        case ColorFormat.RGBA:
            return new RGBAColor(this.red, this.green, this.blue, this.alpha);
        case ColorFormat.HSL:
            return this.hasAlpha ? new HSLAColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, this.alpha) : new HSLColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness);
        case ColorFormat.HSLA:
            return new HSLAColor(this.red, this.green, this.blue, this.hue, this.saturation, this.lightness, this.alpha);
        case ColorFormat.HSV:
            return HSVColor.fromHSL(this.hue, this.saturation, this.lightness);
        default:
            throw new Error("Invalid color format");
        }
    }
    addAlpha(alpha: number): HSLAColor {
        this.alpha = alpha;
        return this;
    }

    toString(): string {
        return `hsla(${this.hue},${this.saturation}%,${this.lightness}%,${this.alpha})`;
    }
}