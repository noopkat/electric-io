export { mixHsv, lerp, ilerp };

/**
 * Linearly interpolate between two colors in HSV space.
 * The colors are given as objects containing 'h', 's', 'v', and 'a' properties.
 *
 * Examples:
 * Returns the 'from' color when 'factor' is 0.0.
 * Returns the 'to' color when 'factor' is 1.0.
 * Returns the midpiont between the 'from' and 'to' colors when 'factor' is 0.5.
 *
 * @param {object} from   The first color.
 * @param {object} to     The second color.
 * @param {number} factor What proportion of each color to mix into the
 *                        final color.
 */
function mixHsv(from, to, factor) {
  // Clamp factor to [0.0,1.0]
  factor = Math.max(0.0, Math.min(1.0, factor));

  // Perform angular hue interpolation
  let delta_h;
  if (from.h < to.h && to.h - from.h > 180.0) {
    delta_h = to.h - from.h - 360.0;
  } else if (to.h < from.h && from.h - to.h > 180.0) {
    delta_h = to.h - from.h + 360.0;
  } else {
    delta_h = to.h - from.h;
  }
  const h = (360.0 + from.h + delta_h * factor) % 360.0;

  // Perform linear saturation, value and alpha interpolation
  const s = lerp(from.s, to.s, factor);
  const v = lerp(from.v, to.v, factor);
  const a = lerp(from.a, to.a, factor);

  return { h, s, v, a: isNaN(a) ? 1.0 : a };
}

/**
 * Linearly interpolate between two numbers 'a' and 'b' with a blend ratio of 't'.
 */
function lerp(a, b, t) {
  return (1.0 - t) * a + t * b;
}

/**
 * Calculate the ratio between 0.0 and 1.0 of how far along the number line 'value' is between 'min' and 'max'.
 */
function ilerp(min, max, value) {
  return (value - min) / (max - min);
}
