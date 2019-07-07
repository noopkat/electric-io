import * as jmespath from "jmespath";

/**
 * Extract a value from an object or array.
 *
 * @param {string} path The path to the value to extract from the input value.
 * @param {*} input The input value: an object or array.
 *
 * @remarks
 * [JMESPath](http://jmespath.org/) syntax is supported.
 */
export function evaluatePath(path, input) {
  if (!path) {
    return null;
  }

  try {
    return jmespath.search(input, path);
  } catch (error) {
    if (error.name === "ParserError") {
      // TODO: The user entered a path that is not a valid JMESPath. This should be detected and prevented earlier in the card settings UI.
      // Return no match.
      return null;
    }
    throw error;
  }
}
