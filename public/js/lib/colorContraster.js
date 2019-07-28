import colorNames from "./colorNames.js";

// default export function source: https://stackoverflow.com/a/41491220
// I modified it a little bit and wrote the parsing functions below it.
// this function takes a hex color code and figures out whether whether a dark or light color should be laid over the top of it
// - noopkat

export default function pickTextColorBasedOnBgColor(
  bgColor,
  lightColor,
  darkColor
) {
  if (!bgColor) return "#000000";
  const rgb = parseColor(bgColor);
  if (rgb === null) {
    return null;
  }

  const { r, g, b } = rgb;
  const uicolors = [r / 255, g / 255, b / 255];
  const c = uicolors.map(col => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  const L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? darkColor : lightColor;
}

function parseColor(color) {
  if (color.charAt(0) === "#") return parseHex(color);
  if (color.toLowerCase().indexOf("rgb") === 0) return parseRGB(color);
  else return parseName(color);
}

function parseHex(color) {
  // #ff00de
  // validate and return if invalid
  if (!validHexColor(color)) {
    return null;
  }

  let r, g, b, justColor;

  // need to check here if a 3 digit short hex code is provided
  // We're assuming here that the color will always be
  // (simple string length test would do)
  if (color.length === 4) {
    justColor = color.substring(1, 4);
    r = parseInt(justColor.substring(0, 1).repeat(2), 16); // hextToR
    g = parseInt(justColor.substring(1, 2).repeat(2), 16); // hextToG
    b = parseInt(justColor.substring(2, 3).repeat(2), 16); // hextToR
  } else {
    justColor = color.substring(1, 7);
    r = parseInt(justColor.substring(0, 2), 16); // hexToR
    g = parseInt(justColor.substring(2, 4), 16); // hexToG
    b = parseInt(justColor.substring(4, 6), 16); // hexToB
  }

  return { r, g, b };
}

function parseRGB(color) {
  // rgb(23,255,8)
  const justColor = color.substring(4, color.length - 1).replace(/\s/g, "");
  const colorParts = justColor.split(",").map(n => parseInt(n));
  return { r: colorParts[0], g: colorParts[1], b: colorParts[2] };
}

function parseName(color) {
  // papayawhip or Papaya Whip
  const justColor = color.replace(/\s/g, "").toLowerCase();
  const hexColor = colorNames[justColor];

  if (hexColor === undefined) {
    return null;
  }

  return parseHex(hexColor);
}

function validHexColor(inputHexString) {
  // returns true or false depending on validity of input string
  // I've divided the check into two steps for code readability

  // adding a simple error check in case of an invalid color string
  // check if string is either 4 or 7 characters long and is string
  // added 9 for #RGBA types value (we remove alpha part later using substring)
  // Also, RGBA don't have short code
  // Edit: Removed string check as it doesn't make sense here
  if (![4, 7, 9].includes(inputHexString.length)) {
    return false;
  }

  // Another small check to validate valid HEX input
  // A simple Regular Expression can handle the validation here

  // 1 or more characters between 0-f both cases (captial and small)
  const exp = /^[a-fA-F0-9]+$/;

  return exp.test(inputHexString.substr(1));
}
