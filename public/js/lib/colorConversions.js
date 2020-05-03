export default {
  hsl: {
    hsv: convertHslToHsv,
    hwb: convertHslToHwb,
    rgb: convertHslToRgb,
    hex: convertHslToHex
  },
  hsv: {
    hsl: convertHsvToHsl,
    hwb: convertHsvToHwb,
    rgb: convertHsvToRgb,
    hex: convertHsvToHex
  },
  hwb: {
    hsl: convertHwbToHsl,
    hsv: convertHwbToHsv,
    rgb: convertHwbToRgb,
    hex: convertHwbToHex
  },
  rgb: {
    hsl: convertRgbToHsl,
    hsv: convertRgbToHsv,
    hwb: convertRgbToHwb,
    hex: convertRgbToHex
  },
  hex: {
    hsl: convertHexToHsl,
    hsv: convertHexToHsv,
    hwb: convertHexToHwb,
    rgb: convertHexToRgb
  },
  css: {
    rgb: convertCssToRgb,
    hsv: convertCssToHsv
  }
};

/**
 * Converts an HSL color object to an HSV color object.
 *
 * Source: https://en.m.wikipedia.org/wiki/HSL_and_HSV#HSL_to_HSV
 *
 * @param {object} hsl
 * @returns {object}
 */
function convertHslToHsv(hsl) {
  const v = hsl.l + hsl.s * Math.min(hsl.l, 1 - hsl.l);
  const s = v === 0 ? 0 : 2 - (2 * hsl.l) / v;

  return {
    h: hsl.h,
    s,
    v,
    a: hsl.a
  };
}

/**
 * Converts an HSV color object to an HSL color object.
 *
 * Source: https://en.m.wikipedia.org/wiki/HSL_and_HSV#HSV_to_HSL
 *
 * @param {object} hsv
 * @returns {object}
 */
function convertHsvToHsl(hsv) {
  const l = hsv.v - (hsv.v * hsv.s) / 2;
  const lMin = Math.min(l, 1 - l);
  const s = lMin === 0 ? 0 : (hsv.v - l) / lMin;

  return {
    h: hsv.h,
    s,
    l,
    a: hsv.a
  };
}

/**
 * @param {object} hwb
 * @returns {object}
 */
function convertHwbToRgb(hwb) {
  const hsv = convertHwbToHsv(hwb);
  return convertHsvToRgb(hsv);
}

/**
 * @param {object} rgb
 * @returns {object}
 */
function convertRgbToHwb(rgb) {
  const hsv = convertRgbToHsv(rgb);
  return convertHsvToHwb(hsv);
}

/**
 * @param {object} hwb
 * @returns {object}
 */
function convertHwbToHsl(hwb) {
  const hsv = convertHwbToHsv(hwb);
  return convertHsvToHsl(hsv);
}

/**
 * @param {object} hsl
 * @returns {object}
 */
function convertHslToHwb(hsl) {
  const hsv = convertHslToHsv(hsl);
  return convertHsvToHwb(hsv);
}

/**
 * @param {object} hsv
 * @returns {object}
 */
function convertHsvToHwb(hsv) {
  return {
    h: hsv.h,
    w: (1 - hsv.s) * hsv.v,
    b: 1 - hsv.v,
    a: hsv.a
  };
}

/**
 * @param {object} hwb
 * @returns {object}
 */
function convertHwbToHsv(hwb) {
  return {
    h: hwb.h,
    s: 1 - hwb.w / (1 - hwb.b),
    v: 1 - hwb.b,
    a: hwb.a
  };
}

/**
 * Source: https://en.m.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB
 *
 * @param {object} hsl
 * @returns {object}
 */
function convertHslToRgb(hsl) {
  const chroma = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const k = hsl.h / 60;
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

  const m = hsl.l - chroma / 2;
  return {
    r: r_ + m,
    g: g_ + m,
    b: b_ + m,
    a: hsl.a
  };
}

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
function convertRgbToHsl(rgb) {
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

  const l = (max + min) / 2;

  let s;
  if (max === 0 || min === 1) {
    s = 0;
  } else {
    s = (max - l) / Math.min(l, 1 - l);
  }

  return {
    h,
    s,
    l,
    a: rgb.a
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

function convertHexToRgb(hex) {
  const rgbChannels = hex
    .replace(/^#/, "")
    .match(/.{2}/g)
    .map(channel => {
      return parseInt(channel, 16) / 255;
    });

  // if (rgbChannels.length === 3) {
  //   rgbChannels.push(1);
  // }

  return {
    r: rgbChannels[0],
    g: rgbChannels[1],
    b: rgbChannels[2],
    a: rgbChannels[3]
  };
}

function convertHslToHex(hsl) {
  const rgb = convertHslToRgb(hsl);
  return convertRgbToHex(rgb);
}

function convertHsvToHex(hsv) {
  const rgb = convertHsvToRgb(hsv);
  return convertRgbToHex(rgb);
}

function convertHwbToHex(hwb) {
  const rgb = convertHwbToRgb(hwb);
  return convertRgbToHex(rgb);
}

function convertHexToHsl(hex) {
  const rgb = convertHexToRgb(hex);
  return convertRgbToHsl(rgb);
}

function convertHexToHsv(hex) {
  const rgb = convertHexToRgb(hex);
  return convertRgbToHsv(rgb);
}

function convertHexToHwb(hex) {
  const rgb = convertHexToRgb(hex);
  return convertRgbToHwb(rgb);
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
    r: r / 255.0,
    g: g / 255.0,
    b: b / 255.0,
    a: isNaN(a) ? 1.0 : a / 255.0
  };
  return rgb;
}

function convertCssToHsv(color) {
  const rgb = convertCssToRgb(color);
  return convertRgbToHsv(rgb);
}
