import {Color} from "./Color";

import HEXColor from "./HEXColor";
import HEXAColor from "./HEXAColor";
import RGBColor from "./RGBColor";
import RGBAColor from "./RGBAColor";
import HSLColor from "./HSLColor";
import HSLAColor from "./HSLAColor";
import HSVColor from "./HSVColor";

import {colorNames} from "@/support/color/colorNames";

const isHex = (color: string) => {
    return /^#[0-9A-F]{3}$/i.test(color) || /^#[0-9A-F]{6}$/i.test(color);
};

const isHexa = (color: string) => {
    return /^#[0-9A-F]{4}$/i.test(color) || /^#[0-9A-F]{8}$/i.test(color);
};

const isRGB = (color: string): boolean => {
    const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;
    const match = color.match(rgbRegex);

    if (!match) return false;

    // Check if r, g, b values are between 0 and 255
    const isValidChannel = (channel: number) => channel >= 0 && channel <= 255;
    if (!isValidChannel(+match[1]) || !isValidChannel(+match[2]) || !isValidChannel(+match[3])) return false;

    return true;
};

const isRGBa = (color: string): boolean => {
    const rgbaRegex = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((0(\.\d+)?)|1(\.0+)?)\)$/;
    const match = color.match(rgbaRegex);

    if (!match) return false;

    // Check if r, g, b values are between 0 and 255
    const isValidChannel = (channel: number) => channel >= 0 && channel <= 255;
    if (!isValidChannel(+match[1]) || !isValidChannel(+match[2]) || !isValidChannel(+match[3])) return false;

    // If all checks passed, it's a valid RGBA string
    return true;
};

const isHSL = (color: string): boolean => {
    const hslRegex = /^hsl\(\s*([0-9]{1,3}(?:\.[0-9]+)?),\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*\)$/;
    const match = color.match(hslRegex);

    if (!match) return false;

    // Check if h, s, and l values are within the expected ranges
    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]);
    const l = parseFloat(match[3]);

    if (h < 0 || h > 360) return false;
    if (s < 0 || s > 100) return false;
    if (l < 0 || l > 100) return false;

    // If all checks passed, it's a valid HSL string
    return true;
};

const isHSLa = (color: string): boolean => {
    const hslaRegex = /^hsla\(\s*([0-9]{1,3}(?:\.[0-9]+)?),\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*((0(\.\d+)?)|1(\.0+)?)\s*\)$/;
    const match = color.match(hslaRegex);

    if (!match) return false;

    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]);
    const l = parseFloat(match[3]);
    const a = parseFloat(match[4]);

    if (h < 0 || h > 360) return false;
    if (s < 0 || s > 100) return false;
    if (l < 0 || l > 100) return false;
    if (a < 0 || a > 1) return false;

    return true;
};

const isHSV = (color: string): boolean => {
    const hsvRegex = /^hsv\(\s*([0-9]{1,3}(?:\.[0-9]+)?),\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*,\s*([0-9]{1,3}(?:\.[0-9]+)?)%\s*\)$/;
    const match = color.match(hsvRegex);

    if (!match) return false;

    const h = parseFloat(match[1]);
    const s = parseFloat(match[2]);
    const v = parseFloat(match[3]);

    if (h < 0 || h > 360) return false;
    if (s < 0 || s > 100) return false;
    if (v < 0 || v > 100) return false;

    return true;
};

export const fromString = (colorString: string): Color => {
    if (colorNames[colorString]) {
        return HEXColor.fromString(colorNames[colorString]);
    }
    if (isHex(colorString)) {
        return HEXColor.fromString(colorString);
    }
    if (isHexa(colorString)) {
        return HEXAColor.fromString(colorString);
    }
    if (isRGB(colorString)) {
        return RGBColor.fromString(colorString);
    }
    if (isRGBa(colorString)) {
        return RGBAColor.fromString(colorString);
    }
    if (isHSL(colorString)) {
        return HSLColor.fromString(colorString);
    }
    if (isHSLa(colorString)) {
        return HSLAColor.fromString(colorString);
    }
    if (isHSV(colorString)) {
        return HSVColor.fromString(colorString);
    }

    if (colorString === "transparent") {
        return new HEXColor(0, 0, 0);
    }

    throw new Error("Unsupported color format");
};

export const isValidColor = (colorString: string): boolean => {
    if (colorString === "transparent") {
        return true;
    }

    if (colorNames[colorString]) {
        return true;
    }

    if (isHex(colorString)) {
        return true;
    }

    if (isHexa(colorString)) {
        return true;
    }

    if (isRGB(colorString)) {
        return true;
    }

    if (isRGBa(colorString)) {
        return true;
    }

    if (isHSL(colorString)) {
        return true;
    }

    if (isHSLa(colorString)) {
        return true;
    }

    if (isHSV(colorString)) {
        return true;
    }

    return false;
};