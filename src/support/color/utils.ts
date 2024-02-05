const { abs, min, max, round } = Math;

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        const gray = round(l * 255);
        return [gray, gray, gray];
    } else {

        const c = (1 - abs(2 * l - 1)) * s;
        const x = c * (1 - abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        const [r1, g1, b1] = function (h:number, c: number, x: number): [number, number, number] {
            if (h < 60) return [c, x, 0];
            if (h < 120) return [x, c, 0];
            if (h < 180) return [0, c, x];
            if (h < 240) return [0, x, c];
            if (h < 300) return [x, 0, c];

            return [c, 0, x];
        }(h, c, x);

        r = (r1 + m) * 255;
        g = (g1 + m) * 255;
        b = (b1 + m) * 255;
    }

    // Enhanced rounding and precision control
    const roundPrecise = (num: number, decimals = 2) => Number(round(Number(num + "e" + decimals)) + "e-" + decimals);
    return [roundPrecise(r, 0), roundPrecise(g, 0), roundPrecise(b, 0)];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;

    const cMax = max(r, g, b), cMin = min(r, g, b);
    let h, s;
    const l = (cMax + cMin) / 2;

    if (cMax === cMin) {
        h = s = 0; // achromatic
    } else {
        const delta = cMax - cMin;
        s = delta === 0 ? 0 : delta / (1 - abs(2 * l - 1));

        if (delta === 0) {
            h = 0;
        } else if (cMax === r) {
            h = 60 * (((g - b) / delta) % 6);
        } else if (cMax === g) {
            h = 60 * (((b - r) / delta) + 2);
        } else { // if (cMax === b)
            h = 60 * (((r - g) / delta) + 4);
        }
    }

    if (h < 0) h += 360;
    
    // Enhanced rounding and precision control
    const roundPrecise = (num: number, decimals = 2) => Number(round(Number(num + "e" + decimals)) + "e-" + decimals);
    return [roundPrecise(h, 1), roundPrecise(s * 100, 1), roundPrecise(l * 100, 1)];
}