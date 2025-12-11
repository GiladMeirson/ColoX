class Color {
    constructor(...args) {
        this.alpha = 1;

        // --- STRING INPUT ---
        if (args.length === 1 && typeof args[0] === "string") {
            let str = args[0].trim().toLowerCase();

            // HEX formats (#rgb, #rgba, #rrggbb, #rrggbbaa)
            if (/^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(str)) {
                let hexContent = str.startsWith("#") ? str.slice(1) : str;

                // Extract alpha (hex → normalized 0..1)
                if (hexContent.length === 4) {
                    // #RGBA → RRGGBBAA
                    this.alpha = parseInt(hexContent[3] + hexContent[3], 16) / 255;
                    hexContent = hexContent.substring(0, 3);
                } else if (hexContent.length === 8) {
                    this.alpha = parseInt(hexContent.substring(6, 8), 16) / 255;
                    hexContent = hexContent.substring(0, 6);
                }

                this.initFromHex(hexContent);
                return;
            }

            // RGB / RGBA
            if (str.startsWith("rgb")) {
                const parsed = Color.parseRgbString(str);
                this.alpha = parsed.a !== undefined ? Color.normalizeAlpha(parsed.a) : 1;
                this.initFromRgb(parsed.r, parsed.g, parsed.b);
                return;
            }

            // HSL / HSLA
            if (str.startsWith("hsl")) {
                const parsed = Color.parseHslString(str);
                this.alpha = parsed.a !== undefined ? Color.normalizeAlpha(parsed.a) : 1;
                this.initFromHsl(parsed.h, parsed.s, parsed.l);
                return;
            }

            throw new Error("Unsupported color string: " + str);
        }

        // --- NUMERIC INPUT (r,g,b,a?) ---
        if ((args.length === 3 || args.length === 4) && args.every(n => typeof n === "number")) {
            this.alpha = args.length === 4 ? Color.normalizeAlpha(args[3]) : 1;
            this.initFromRgb(args[0], args[1], args[2]);
            return;
        }

        // --- OBJECT INPUT ---
        if (args.length === 1 && typeof args[0] === "object") {
            const obj = args[0];

            if ("r" in obj && "g" in obj && "b" in obj) {
                this.alpha = "a" in obj ? Color.normalizeAlpha(obj.a) : 1;
                this.initFromRgb(obj.r, obj.g, obj.b);
                return;
            }

            if ("h" in obj && "s" in obj && "l" in obj) {
                this.alpha = "a" in obj ? Color.normalizeAlpha(obj.a) : 1;
                this.initFromHsl(obj.h, obj.s, obj.l);
                return;
            }

            throw new Error("Unsupported object format");
        }

        throw new Error("Invalid constructor arguments");
    }

    // ========================================================
    // INITIALIZERS
    // ========================================================

    initFromRgb(r, g, b) {
        this.rgb = { r, g, b };
        this.hex = Color.rgbToHex(this.rgb);
        this.hsl = Color.rgbToHsl(this.rgb);
        this.type = "rgb";
    }

    initFromHsl(h, s, l) {
        this.hsl = { h, s, l };
        this.rgb = Color.hslToRgb(this.hsl);
        this.hex = Color.rgbToHex(this.rgb);
        this.type = "hsl";
    }

    initFromHex(hexContent) {
        this.hex = "#" + hexContent;
        this.rgb = Color.hexToRgb(this.hex);
        this.hsl = Color.rgbToHsl(this.rgb);
        this.type = "hex";
    }

    // ========================================================
    // STATIC HELPERS
    // ========================================================

    static normalizeAlpha(a) {
        if (typeof a === "number") return Math.max(0, Math.min(1, a));
        return parseInt(a, 16) / 255;
    }

    static hexToRgb(hex) {
        let h = hex.replace("#", "");
        if (h.length === 3) {
            h = h.split("").map(x => x + x).join("");
        }
        const num = parseInt(h, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    static rgbToHex({ r, g, b }) {
        const toHex = n => n.toString(16).padStart(2, "0");
        return "#" + toHex(r) + toHex(g) + toHex(b);
    }

    static parseRgbString(str) {
        const m = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d\.]+))?\)/i);
        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : undefined };
    }

    static parseHslString(str) {
        const m = str.match(/hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%(?:\s*,\s*([\d\.]+))?\)/i);
        return { h: +m[1], s: +m[2], l: +m[3], a: m[4] !== undefined ? +m[4] : undefined };
    }

    static rgbToHsl({ r, g, b }) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s;
        let l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
                case g: h = ((b - r) / d + 2); break;
                case b: h = ((r - g) / d + 4); break;
            }
            h *= 60;
        }

        return { h: Math.round(h), s: +(s * 100).toFixed(2), l: +(l * 100).toFixed(2) };
    }

    static hslToRgb({ h, s, l }) {
        s /= 100; l /= 100;
        const C = (1 - Math.abs(2 * l - 1)) * s;
        const X = C * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - C / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) [r, g, b] = [C, X, 0];
        else if (60 <= h && h < 120) [r, g, b] = [X, C, 0];
        else if (120 <= h && h < 180) [r, g, b] = [0, C, X];
        else if (180 <= h && h < 240) [r, g, b] = [0, X, C];
        else if (240 <= h && h < 300) [r, g, b] = [X, 0, C];
        else [r, g, b] = [C, 0, X];

        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }
    static random() {
        let h = Math.floor(Math.random()*360);
        let s = 40 + Math.random()*60; // בין 40% ל-100%
        let l = 30 + Math.random()*50; // בין 30 ל-80
        return new Color({h, s, l});
    }        
    static randomList(count = 5) {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push(Color.random());
        }
        return arr;
    }

    // ========================================================
    // COLOR OPERATIONS
    // ========================================================

    plus(other) {
        const r = Math.round((this.rgb.r + other.rgb.r) / 2);
        const g = Math.round((this.rgb.g + other.rgb.g) / 2);
        const b = Math.round((this.rgb.b + other.rgb.b) / 2);
        return new Color({ r, g, b, a: (this.alpha + other.alpha) / 2 });
    }

    minus(other) {
        const clamp = v => Math.max(0, Math.min(255, v));
        const r = clamp(this.rgb.r - other.rgb.r);
        const g = clamp(this.rgb.g - other.rgb.g);
        const b = clamp(this.rgb.b - other.rgb.b);
        return new Color({ r, g, b, a: this.alpha });
    }

    mix(other, ratio = 0.5) {
        ratio = Math.max(0, Math.min(1, ratio));
        const r = Math.round(this.rgb.r * (1 - ratio) + other.rgb.r * ratio);
        const g = Math.round(this.rgb.g * (1 - ratio) + other.rgb.g * ratio);
        const b = Math.round(this.rgb.b * (1 - ratio) + other.rgb.b * ratio);
        const a = this.alpha * (1 - ratio) + other.alpha * ratio;
        return new Color({ r, g, b, a });
    }

    multiply(other) {
        const r = Math.round((this.rgb.r / 255) * (other.rgb.r / 255) * 255);
        const g = Math.round((this.rgb.g / 255) * (other.rgb.g / 255) * 255);
        const b = Math.round((this.rgb.b / 255) * (other.rgb.b / 255) * 255);
        return new Color({ r, g, b, a: this.alpha * other.alpha });
    }

    lighten(percent) {
        const hsl = { ...this.hsl };
        hsl.l = Math.min(100, hsl.l + percent);
        return new Color({ ...hsl, a: this.alpha });
    }

    darken(percent) {
        const hsl = { ...this.hsl };
        hsl.l = Math.max(0, hsl.l - percent);
        return new Color({ ...hsl, a: this.alpha });
    }

    saturate(percent) {
        const hsl = { ...this.hsl };
        hsl.s = Math.min(100, hsl.s + percent);
        return new Color({ ...hsl, a: this.alpha });
    }

    desaturate(percent) {
        const hsl = { ...this.hsl };
        hsl.s = Math.max(0, hsl.s - percent);
        return new Color({ ...hsl, a: this.alpha });
    }

    getShades(count = 5, spread = 30) {
        if (count < 2) count = 2;

        const baseL = this.hsl.l;
        const h = this.hsl.h;
        const s = this.hsl.s;

        const result = [];

        for (let i = 0; i < count; i++) {
            // t = -1 .. 1
            const t = (i - (count - 1) / 2) / ((count - 1) / 2);

            // Example: if spread = 30 → ±30% blend range
            let l = baseL + t * spread;

            // clamp
            l = Math.max(0, Math.min(100, l));

            result.push(new Color({
                h,
                s,
                l,
                a: this.alpha
            }));
        }

        return result;
    }
    getScale(count = 5) {
        if (count < 2) count = 2;

        const h = this.hsl.h;
        const s = this.hsl.s;

        const result = [];

        // Full range from 10% → 90%
        const minL = 10;
        const maxL = 90;

        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);       // 0..1
            const l = minL + t * (maxL - minL);

            result.push(new Color({
                h,
                s,
                l,
                a: this.alpha
            }));
        }

        return result;
    }

    toHex() {
        return this.hex;
    }

    toHex8() {
        const a = Math.round(this.alpha * 255)
            .toString(16)
            .padStart(2, "0");

        return this.hex + a;
    }

    toRgbString() {
        const { r, g, b } = this.rgb;
        return `rgb(${r}, ${g}, ${b})`;
    }

    toRgbaString() {
        const { r, g, b } = this.rgb;
        return `rgba(${r}, ${g}, ${b}, ${this.alpha})`;
    }

    toHslString() {
        const { h, s, l } = this.hsl;
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    toHslaString() {
        const { h, s, l } = this.hsl;
        return `hsla(${h}, ${s}%, ${l}%, ${this.alpha})`;
    }
    toString(format = "auto") {
        // Explicit format
        if (format === "hex") return this.toHex();
        if (format === "hex8") return this.toHex8();
        if (format === "rgb") return this.toRgbString();
        if (format === "rgba") return this.toRgbaString();
        if (format === "hsl") return this.toHslString();
        if (format === "hsla") return this.toHslaString();

        // AUTO mode — choose by type
        switch (this.type) {
            case "hex":
                return this.alpha === 1 ? this.toHex() : this.toHex8();

            case "rgb":
                return this.alpha === 1 ? this.toRgbString() : this.toRgbaString();

            case "hsl":
                return this.alpha === 1 ? this.toHslString() : this.toHslaString();
        }

        // fallback if type unknown
        return this.alpha === 1 ? this.toHex() : this.toHex8();
    }
}

