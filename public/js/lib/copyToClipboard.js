/**
 * https://stackoverflow.com/a/33928558/2036825
 *
 * @param {string} text
 */
function copyToClipboard(text) {
  if (
    !(document.queryCommandSupported && document.queryCommandSupported("copy"))
  ) {
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.textContent = text;

  // Prevent scrolling to bottom of page in MS Edge.
  textarea.style.position = "fixed";

  document.body.appendChild(textarea);
  textarea.select();

  try {
    // Security exception may be thrown by some browsers.
    return document.execCommand("copy");
  } catch (error) {
    console.warn("Copying to the clipboard failed.", error);
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export default copyToClipboard;
