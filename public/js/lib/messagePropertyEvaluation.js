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
  return evaluate(path, input).value;
}

/**
 * Test that the argument is a valid path for evaluatePath.
 *
 * @param path {string} The path to validate.
 */
export function pathIsValid(path) {
  return evaluate(path, {}).isValidPath;
}

function evaluate(path, input) {
  if (!path) {
    // Falsy paths are valid.
    // Return null to show an empty card.
    return { value: null, isValidPath: true };
  }

  if (path.substring(path.length - 1) === ".") {
    // jmespath.js has a bug where paths ending in "." aren't rejected by the parser.
    // https://github.com/jmespath/jmespath.js/issues/36
    // Return error.
    return { value: null, isValidPath: false };
  }

  try {
    const value = jmespath.search(input, path);
    return { value: value, isValidPath: true };
  } catch (error) {
    const errorName = (error.name || "").toLowerCase();
    if (
      errorName === "lexererror" ||
      errorName === "parsererror" ||
      errorName === "runtimeerror"
    ) {
      // The user entered a path that is not a valid JMESPath.
      // Return error.
      return { value: null, isValidPath: false };
    }
    throw error;
  }
}
