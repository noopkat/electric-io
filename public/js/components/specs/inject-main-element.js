/**
 * Helper function for injecting a test element into the DOM
 * This element can then be used as the mount point when using the [`attachTo`][1] option.
 *
 * [1]: https://vue-test-utils.vuejs.org/api/options.html#attachto
 *
 * @returns {string} a CSS selector that should be used as the value for the `attachTo` option
 */
export function injectMainElement () {
  const id = 'root';
  const mainElement = document.createElement('main');
  mainElement.id = id;
  document.body.appendChild(mainElement);
  return `#${id}`;
}
