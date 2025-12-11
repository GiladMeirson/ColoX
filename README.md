<p align="center">
  <img src="assets/logo.png" alt="ColoX Logo" width="300"/>
</p>

<h1 align="center">ColoX</h1>

<p align="center">
  <strong>The Ultimate JavaScript Color Manipulation Library</strong>
</p>

<p align="center">
  <em>Zero dependencies • Lightning fast • Modern API</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/size-<5kb-blue" alt="Size"/>
  <img src="https://img.shields.io/badge/methods-20+-purple" alt="Methods"/>
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License"/>
</p>

---

## 🎨 What is ColoX?

**ColoX** is a powerful, lightweight, and intuitive JavaScript library for advanced color manipulation. Whether you're building design tools, creating dynamic themes, or generating beautiful color palettes — ColoX makes working with colors as simple as working with numbers.

```javascript
const sunset = new Color("#ff6b6b");
const ocean = new Color("#4ecdc4");

// Mix colors like magic
const blend = sunset.mix(ocean, 0.5);

// Generate a complete palette
const palette = sunset.getShades(5);

// Transform with precision
const lighter = sunset.lighten(20);
const darker = sunset.darken(15);
```

---

## ✨ Features

| Feature                         | Description                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------- |
| ⚡ **Zero Dependencies**        | No npm bloat. No security vulnerabilities. Just pure, efficient JavaScript.  |
| 🎨 **Universal Format Support** | HEX, RGB, RGBA, HSL, HSLA — with automatic detection and seamless conversion |
| 🔢 **Color Mathematics**        | Add, subtract, multiply, and mix colors like numbers                         |
| 🌈 **Palette Generation**       | Auto-generate shades, scales, and harmonious palettes                        |
| 🎯 **Precise Control**          | Lighten, darken, saturate, desaturate with exact percentages                 |
| 🚀 **Blazing Fast**             | Optimized algorithms for maximum performance                                 |
| 📦 **Tiny Footprint**           | Less than 5KB gzipped                                                        |

---

## 📦 Installation

### Option 1: Direct Download

Download `ColoX.min.js` from the `JS/` folder and include it in your project:

```html
<script src="path/to/ColoX.min.js"></script>
```

### Option 2: CDN (Coming Soon)

```html
<script src="https://cdn.jsdelivr.net/gh/GiladMeirson/ColoX/JS/ColoX.min.js"></script>
```

### Option 3: NPM (Coming Soon)

```bash
npm install colox
```

---

## 🚀 Quick Start

### Creating Colors

ColoX accepts colors in multiple formats:

```javascript
// From HEX
const red = new Color("#ff0000");
const redShort = new Color("#f00");
const redWithAlpha = new Color("#ff0000cc");

// From RGB/RGBA
const green = new Color("rgb(0, 255, 0)");
const greenAlpha = new Color("rgba(0, 255, 0, 0.8)");
const blueNumeric = new Color(0, 0, 255);
const blueWithAlpha = new Color(0, 0, 255, 0.5);

// From HSL/HSLA
const purple = new Color("hsl(270, 100%, 50%)");
const purpleAlpha = new Color("hsla(270, 100%, 50%, 0.9)");

// From Object
const cyan = new Color({ r: 0, g: 255, b: 255 });
const magenta = new Color({ h: 300, s: 100, l: 50 });
const withAlpha = new Color({ r: 255, g: 0, b: 0, a: 0.5 });
```

---

## 📚 API Reference

### Constructor

```javascript
new Color(input);
```

| Input Type  | Example                                 | Description                 |
| ----------- | --------------------------------------- | --------------------------- |
| HEX String  | `"#ff6b6b"`, `"#f00"`, `"ff6b6b"`       | 3, 4, 6, or 8 character hex |
| RGB String  | `"rgb(255, 107, 107)"`                  | CSS RGB format              |
| RGBA String | `"rgba(255, 107, 107, 0.8)"`            | CSS RGBA format             |
| HSL String  | `"hsl(0, 100%, 71%)"`                   | CSS HSL format              |
| HSLA String | `"hsla(0, 100%, 71%, 0.8)"`             | CSS HSLA format             |
| Numbers     | `255, 107, 107` or `255, 107, 107, 0.8` | R, G, B, [A] values         |
| RGB Object  | `{ r: 255, g: 107, b: 107 }`            | Object with RGB values      |
| HSL Object  | `{ h: 0, s: 100, l: 71 }`               | Object with HSL values      |

---

### 🎨 Color Operations

#### `plus(color)` — Color Addition

Blends two colors by averaging their RGB values.

```javascript
const color1 = new Color("#6366f1");
const color2 = new Color("#ec4899");
const result = color1.plus(color2);
// Result: #a855c5
```

#### `minus(color)` — Color Subtraction

Subtracts one color's RGB values from another.

```javascript
const white = new Color("#ffffff");
const red = new Color("#ff0000");
const result = white.minus(red);
// Result: #00ffff (cyan)
```

#### `mix(color, ratio)` — Color Mixing

Mixes two colors with an adjustable ratio (0 to 1).

```javascript
const blue = new Color("#3b82f6");
const orange = new Color("#f59e0b");
const result = blue.mix(orange, 0.5);
// 0 = 100% first color, 1 = 100% second color
```

#### `multiply(color)` — Color Multiplication

Multiplies colors like Photoshop's multiply blend mode.

```javascript
const color1 = new Color("#ff6b6b");
const color2 = new Color("#4ecdc4");
const result = color1.multiply(color2);
```

---

### 🌟 Color Adjustments

#### `lighten(percent)` — Increase Lightness

```javascript
const color = new Color("#6366f1");
const lighter = color.lighten(20);
// Increases lightness by 20%
```

#### `darken(percent)` — Decrease Lightness

```javascript
const color = new Color("#6366f1");
const darker = color.darken(20);
// Decreases lightness by 20%
```

#### `saturate(percent)` — Increase Saturation

```javascript
const color = new Color("#6366f1");
const vibrant = color.saturate(30);
// Increases saturation by 30%
```

#### `desaturate(percent)` — Decrease Saturation

```javascript
const color = new Color("#6366f1");
const muted = color.desaturate(30);
// Decreases saturation by 30%
```

---

### 🌈 Palette Generation

#### `getShades(count, spread)` — Generate Shades

Creates a palette of shades around the base color.

```javascript
const color = new Color("#6366f1");
const shades = color.getShades(5, 30);
// Returns array of 5 Color objects
// spread controls the lightness range (default: 30)
```

#### `getScale(count)` — Generate Scale

Creates a full lightness scale from dark to light.

```javascript
const color = new Color("#6366f1");
const scale = color.getScale(9);
// Returns array of 9 Color objects from 10% to 90% lightness
```

---

### 🎲 Static Methods

#### `Color.random()` — Generate Random Color

```javascript
const randomColor = Color.random();
// Returns a random, visually pleasing color
```

#### `Color.randomList(count)` — Generate Multiple Random Colors

```javascript
const colors = Color.randomList(5);
// Returns array of 5 random Color objects
```

---

### 📤 Output Methods

#### Convert to String Formats

```javascript
const color = new Color("#6366f1");

color.toHex(); // "#6366f1"
color.toHex8(); // "#6366f1ff" (with alpha)
color.toRgbString(); // "rgb(99, 102, 241)"
color.toRgbaString(); // "rgba(99, 102, 241, 1)"
color.toHslString(); // "hsl(239, 84%, 67%)"
color.toHslaString(); // "hsla(239, 84%, 67%, 1)"
```

#### `toString(format)` — Flexible Output

```javascript
const color = new Color("#6366f1");

color.toString(); // Auto-detects best format
color.toString("hex"); // "#6366f1"
color.toString("hex8"); // "#6366f1ff"
color.toString("rgb"); // "rgb(99, 102, 241)"
color.toString("rgba"); // "rgba(99, 102, 241, 1)"
color.toString("hsl"); // "hsl(239, 84%, 67%)"
color.toString("hsla"); // "hsla(239, 84%, 67%, 1)"
```

---

### 🔧 Properties

Each Color instance has access to these properties:

```javascript
const color = new Color("#6366f1");

color.rgb; // { r: 99, g: 102, b: 241 }
color.hsl; // { h: 239, s: 84.12, l: 66.67 }
color.hex; // "#6366f1"
color.alpha; // 1 (0 to 1)
color.type; // "hex" (original input type)
```

---

## 💡 Use Cases

### 🎨 Design Systems

Generate consistent color scales for your design tokens:

```javascript
const primary = new Color("#6366f1");
const scale = primary.getScale(9);

// Use in CSS variables
scale.forEach((color, i) => {
  document.documentElement.style.setProperty(
    `--primary-${(i + 1) * 100}`,
    color.toHex()
  );
});
```

### 🌓 Dark Mode Themes

Create dark variants automatically:

```javascript
const lightBg = new Color("#ffffff");
const darkBg = lightBg.darken(90);
const accent = new Color("#6366f1");
const darkAccent = accent.darken(20).saturate(10);
```

### 🎮 Interactive UI

Real-time color manipulation for user interactions:

```javascript
button.addEventListener("mouseenter", () => {
  const baseColor = new Color(getComputedStyle(button).backgroundColor);
  button.style.backgroundColor = baseColor.lighten(10).toRgbString();
});
```

### 🖼️ Generative Art

Create dynamic color palettes:

```javascript
const baseHue = Math.random() * 360;
const palette = [];

for (let i = 0; i < 5; i++) {
  palette.push(
    new Color({
      h: (baseHue + i * 30) % 360,
      s: 70 + Math.random() * 30,
      l: 40 + Math.random() * 40,
    })
  );
}
```

---

## 🏗️ Project Structure

```
colorsVec/
├── assets/
│   └── logo.png          # Project logo
├── JS/
│   ├── main.js           # Full source code
│   └── ColoX.min.js      # Minified production build
├── Pages/
│   ├── index.html        # Interactive demo page
│   └── style.css         # Demo styling
└── README.md             # You are here!
```

---

## 🌐 Browser Support

ColoX works in all modern browsers:

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Opera 47+

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. 🐛 Report bugs
2. 💡 Suggest features
3. 🔧 Submit pull requests

---

## 📄 License

MIT License - feel free to use ColoX in personal and commercial projects.

---

## 🙏 Acknowledgments

Built with ❤️ for the developer community.

---

<p align="center">
  <strong>Ready to transform your color workflow?</strong>
  <br/>
  <a href="Pages/index.html">Try the Interactive Demo →</a>
</p>

<p align="center">
  <sub>Made with 🎨 by developers, for developers</sub>
</p>
