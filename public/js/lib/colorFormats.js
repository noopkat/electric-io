class Color {
  constructor(format) {
    this._format = format;
    this._channelInputs = new Map();
  }

  get format() {
    return this._format;
  }

  get channelInputs() {
    return this._channelInputs;
  }
}

class HslColor extends Color {
  constructor() {
    super("hsl");

    this._channelInputs
      .set("h", new CssHueAngle("h"))
      .set("s", new CssPercentage("s"))
      .set("l", new CssPercentage("l"))
      .set("a", new CssAlphaChannel("a"));
  }

  convertToCssColor(value) {
    return convertHslToCssColor(this, value);
  }
}

class HsvColor extends Color {
  constructor() {
    super("hsv");

    this._channelInputs
      .set("h", new CssHueAngle("h"))
      .set("s", new CssPercentage("s"))
      .set("v", new CssPercentage("v"))
      .set("a", new CssAlphaChannel("a"));
  }

  convertToCssColor(value) {
    return convertHsvToCssColor(this, value);
  }
}

class HwbColor extends Color {
  constructor() {
    super("hwb");

    this._channelInputs
      .set("h", new CssHueAngle("h"))
      .set("w", new CssPercentage("w"))
      .set("b", new CssPercentage("b"))
      .set("a", new CssAlphaChannel("a"));
  }

  convertToCssColor(value) {
    return convertHwbToCssColor(this, value);
  }
}

class RgbColor extends Color {
  constructor() {
    super("rgb");

    this._channelInputs
      .set("r", new CssRgbChannel("r"))
      .set("g", new CssRgbChannel("g"))
      .set("b", new CssRgbChannel("b"))
      .set("a", new CssAlphaChannel("a"));
  }

  convertToCssColor(value) {
    return convertRgbToCssColor(this, value);
  }
}

class HexColor extends Color {
  constructor() {
    super("hex");
  }

  convertToCssColor(value) {
    return convertHexToCssColor(this, value);
  }
}

class ColorChannel {
  constructor(name) {
    this._name = name;
    this.nodes = [];
  }

  get name() {
    return this._name;
  }

  get min() {
    return 0;
  }

  get max() {
    return 100;
  }

  get step() {
    return 1;
  }

  convertToCssValue(value) {
    return value;
  }

  convertToNumber(value) {
    return value;
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Syntax_3
 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
class CssHueAngle extends ColorChannel {
  get max() {
    return 360;
  }

  convertToCssValue(value) {
    return roundToPrecision(value);
  }

  convertToNumber(value) {
    return convertHueAngleToNumber(value);
  }
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Syntax_3
 * https://developer.mozilla.org/en-US/docs/Web/CSS/percentage
 */
class CssPercentage extends ColorChannel {
  convertToCssValue(value) {
    return convertNumberToPercent(value);
  }

  convertToNumber(value) {
    return convertPercentToNumber(value);
  }
}

/**
 * A number in the interval [0, 1].
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Syntax_3
 */
class CssAlphaChannel extends ColorChannel {
  get max() {
    return 1;
  }

  get step() {
    return 0.01;
  }

  convertToCssValue(value) {
    return roundToPrecision(value);
  }

  convertToNumber(value) {
    return convertAlphaToNumber(value);
  }
}

/**
 * A number in the interval [0, 255].
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Syntax_2
 */
class CssRgbChannel extends ColorChannel {
  get max() {
    return 255;
  }

  convertToCssValue(value) {
    return convertNumberTo8Bit(value);
  }

  convertToNumber(value) {
    return convert8BitToNumber(value);
  }
}

/**
 * @param {number} value
 * @returns {number}
 */
function roundToPrecision(value, decimalPrecision = 3) {
  const p = Math.pow(10, decimalPrecision - 1);
  return Math.round(value * p) / p;
}

/**
 * @param {string} value
 * @returns {number}
 */

function convertAlphaToNumber(value) {
  if (value.endsWith("%")) {
    return convertPercentToNumber(value);
  }

  if (value.endsWith(".")) {
    return NaN;
  }

  return parseFloat(value);
}

/**
 * @param {number} value
 * @returns {string}
 */
function convertNumberToPercent(value) {
  return `${roundToPrecision(value * 100)}%`;
}

/**
 * @param {string} value
 * @returns {number}
 */
function convertHueAngleToNumber(value) {
  if (value.endsWith(".")) {
    return NaN;
  }

  return parseFloat(value);
}

/**
 * @param {string} value
 * @returns {number}
 */
function convertPercentToNumber(value) {
  value = value.replace(/%$/, "");
  return parseFloat(value) / 100;
}

/**
 * @param {string} value
 * @returns {number}
 */
function convert8BitToNumber(value) {
  return parseFloat(value) / 255;
}

/**
 * @param {number} value
 * @returns {number}
 */
function convertNumberTo8Bit(value) {
  return roundToPrecision(value * 255);
}

function convertHslToCssColor(colorInput, color, includeAlpha = true) {
  const colorFunction = colorInput.format + (includeAlpha ? "a" : "");

  const functionArgument = Object.entries(color)
    .filter(([channelName, _]) => includeAlpha || channelName !== "a")
    .map(([channelName, value]) => {
      return colorInput.channelInputs.get(channelName).convertToCssValue(value);
    })
    .join(", ");

  const cssColor = `${colorFunction}(${functionArgument})`;
  return cssColor;
}

function convertHsvToCssColor(colorInput, color, includeAlpha = true) {
  return convertHslToCssColor(colorInput, color, includeAlpha);
}

function convertHwbToCssColor(colorInput, color, includeAlpha = true) {
  return convertHslToCssColor(colorInput, color, includeAlpha);
}

function convertRgbToCssColor(colorInput, color, includeAlpha = true) {
  return convertHslToCssColor(colorInput, color, includeAlpha);
}

function convertHexToCssColor(colorInput, color, includeAlpha = true) {
  return includeAlpha ? color : color.slice(0, -2);
}

export { HslColor, HsvColor, HwbColor, RgbColor, HexColor };
