import {fromString} from "@/support/color/Factory";
import type {Color} from "@/support/color/Color";

export class GradientStop {
    private _color: string;
    private _parsedColor: Color;
    position: number;

    constructor(color: string, position: number) {
        this._color = color;
        this._parsedColor = fromString(color);
        this.position = position;
    }

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
        this._parsedColor = fromString(value);
    }

    get parsedColor(): Color {
        return this._parsedColor;
    }

    set parsedColor(value: Color) {
        this._parsedColor = value;
        this._color = value.toString();
    }

    static fromString(value: string): GradientStop {
        const positionMatch = value.match(/\s(\d+%)\s*$/);
        let position: number = 0;
        let color: string;

        if (positionMatch) {
            position = parseInt(positionMatch[1]);
            color = value.slice(0, value.lastIndexOf(" "));
        } else {
            color = value.trim();
        }

        return new GradientStop(color, position);
    }

    toString(): string {
        if (this.position) {
            return `${this.color.toString()} ${this.position}%`;
        } else {
            return this.color.toString();
        }
    }
}

export class Gradient {
    constructor(public type: string, public direction: string, public stops: GradientStop[]) {}

    static fromString(value: string): Gradient {
        const match = value.match(/^([\w-]+)\((.*)\)$/);
        if (!match) {
            throw new Error("Invalid gradient");
        }

        const type = match[1];
        const content = match[2].split(/\s*,\s*(?![^(]*\))/); // This part is updated

        const direction = type === "linear-gradient" ? content[0] : "90deg";
        const stops = type === "linear-gradient" ? content.slice(1) : content;

        return new Gradient(type, direction, stops.map(step => GradientStop.fromString(step)));
    }

    get hasDirection(): boolean {
        return this.type === "linear-gradient";
    }

    addStep(position: number) {
        const color = this.getColorAtPosition(position);
        this.stops.push(new GradientStop(color, position));
        this.stops.sort((a, b) => a.position - b.position);

        this.normalizeColors();
    }

    removeStep(index: number) {
        if (! this.canRemoveSteps) {
            return;
        }
        this.stops.splice(index, 1);
    }

    normalizeColors() {
        const format = this.stops[0].parsedColor.format;

        this.stops.forEach(stop => {
            if (stop.parsedColor.format !== format) {
                stop.parsedColor = stop.parsedColor.to(format);
            }
        });
    }

    toString(): string {
        if (this.type === "linear-gradient") {
            return `${this.type}(${this.direction}, ${this.stops.join(", ")})`;
        } else {
            return `${this.type}(${this.stops.join(", ")})`;
        }
    }

    get preview(): string {
        return `linear-gradient(90deg, ${this.stops.join(", ")})`;
    }

    get canRemoveSteps(): boolean {
        return this.stops.length > 2;
    }

    private parseColor(color: string): [number, number, number] {
        const div = document.createElement("div");
        div.style.display = "none";
        div.style.color = color;
        document.body.appendChild(div);
        const computed = getComputedStyle(div).color!;
        const match = computed.match(/\d+/g)!;
        return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
    }

    private interpolateColors(start: [number, number, number], end: [number, number, number], t: number): [number, number, number] {
        return [
            Math.round(start[0] + (end[0] - start[0]) * t),
            Math.round(start[1] + (end[1] - start[1]) * t),
            Math.round(start[2] + (end[2] - start[2]) * t)
        ];
    }

    private getColorAtPosition(position: number): string {
        for (let i = 0; i < this.stops.length - 1; i++) {
            const start = this.stops[i];
            const end = this.stops[i + 1];

            if (position >= start.position && position <= end.position) {
                const t = (position - start.position) / (end.position - start.position);
                const startColor = this.parseColor(start.color);
                const endColor = this.parseColor(end.color);
                const interpolated = this.interpolateColors(startColor, endColor, t);
                return `rgb(${interpolated[0]},${interpolated[1]},${interpolated[2]})`;
            }
        }
        return "transparent"; // Default if not found (unlikely)
    }
}