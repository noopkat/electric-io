export default {
  hsv: {
    hex: convertHsvToHex
  },

  css: {
    hsv: convertCssToHsv
  }
};

/**
 * Source: https://en.m.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 *
 * @param {object} hsv
 * @returns {object}
 */
function convertHsvToRgb(hsv) {
  const chroma = hsv.v * hsv.s;
  const k = hsv.h / 60;
  const x = chroma * (1 - Math.abs((k % 2) - 1));

  let r_ = 0,
    g_ = 0,
    b_ = 0;
  if (0 <= k && k <= 1) {
    r_ = chroma;
    g_ = x;
  } else if (1 < k && k <= 2) {
    r_ = x;
    g_ = chroma;
  } else if (2 < k && k <= 3) {
    g_ = chroma;
    b_ = x;
  } else if (3 < k && k <= 4) {
    g_ = x;
    b_ = chroma;
  } else if (4 < k && k <= 5) {
    r_ = x;
    b_ = chroma;
  } else if (5 < k && k <= 6) {
    r_ = chroma;
    b_ = x;
  }

  const m = hsv.v - chroma;
  return {
    r: r_ + m,
    g: g_ + m,
    b: b_ + m,
    a: hsv.a
  };
}

/**
 * Source: https://en.m.wikipedia.org/wiki/HSL_and_HSV#RGB_to_HSL_and_HSV
 *
 * @param {object} rgb
 * @returns {object}
 */
function convertRgbToHsv(rgb) {
  const min = Math.min(rgb.r, Math.min(rgb.g, rgb.b));
  const max = Math.max(rgb.r, Math.max(rgb.g, rgb.b));

  let h;
  if (max === min) {
    h = 0;
  } else if (max === rgb.r) {
    h = 60 * (0 + (rgb.g - rgb.b) / (max - min));
  } else if (max === rgb.g) {
    h = 60 * (2 + (rgb.b - rgb.r) / (max - min));
  } else if (max === rgb.b) {
    h = 60 * (4 + (rgb.r - rgb.g) / (max - min));
  }

  if (h < 0) {
    h += 360;
  }

  let s;
  if (max === 0) {
    s = 0;
  } else {
    s = (max - min) / max;
  }

  const v = max;

  return {
    h,
    s,
    v,
    a: rgb.a
  };
}

function convertRgbToHex(rgb) {
  const hexChannels = Object.values(rgb).map(channel => {
    const int = channel * 255;
    let hex = Math.round(int).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  });

  return "#" + hexChannels.join("");
}

function convertHsvToHex(hsv) {
  const rgb = convertHsvToRgb(hsv);
  return convertRgbToHex(rgb);
}

function convertCssToRgb(color) {
  document.head.style.color = color;
  const computedColor = getComputedStyle(document.head).color;
  document.head.style.color = "";

  const [r, g, b, a] = computedColor
    .substring(computedColor.indexOf("(") + 1, computedColor.indexOf(")"))
    .replace(" ", "")
    .split(",");
  const rgb = {
    r: parseFloat(r) / 255,
    g: parseFloat(g) / 255,
    b: parseFloat(b) / 255,
    a: a !== undefined ? a : 1
  };
  return rgb;
}

function convertCssToHsv(color) {
  const rgb = convertCssToRgb(color);
  return convertRgbToHsv(rgb);
}
