<template>
  <div class="cp-picker" :data-cp-active-format="activeFormat">
    <div
      ref="colorSpace"
      class="cp-color-space"
      @mousedown="pointerOriginatedInColorSpace = true"
      @touchstart="pointerOriginatedInColorSpace = true"
    >
      <div
        class="cp-color-space__marker"
        data-cp-marker-controls-format="hsv"
        data-cp-marker-x-controls-channel="s"
        data-cp-marker-y-controls-channel="v"
        tabindex="0"
        aria-label="Marker"
        @keydown="moveMarkerWithArrows"
      ></div>
    </div>

    <div class="cp-columns cp-preview-row">
      <div class="cp-slider-group cp-column cp-column--grow">
        <label class="cp-slider" :for="`hue-slider-${uid}`">
          <span class="cp-slider__label cp-visually-hidden">Hue</span>

          <input
            class="cp-slider__input cp-slider__input--hue"
            :id="`hue-slider-${uid}`"
            data-cp-input-hsl="h"
            type="range"
          />
        </label>

        <label class="cp-slider" :for="`alpha-slider-${uid}`">
          <span class="cp-slider__label cp-visually-hidden">Alpha</span>

          <input
            class="cp-slider__input cp-slider__input--alpha cp-tiled-background"
            :id="`alpha-slider-${uid}`"
            data-cp-input-hsl="a"
            type="range"
          />
        </label>
      </div>

      <div class="cp-color-preview cp-column cp-tiled-background"></div>

      <div class="cp-column">
        <button class="cp-copy-button" @click="copyColor">
          <span class="cp-visually-hidden">Copy</span>

          <svg
            class="cp-clipboard-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
          >
            <path
              d="M5 0v2H1v13h12v-3h-1v2H2V5h10v3h1V2H9V0zm1 1h2v2h3v1H3V3h3z"
            />
            <path
              d="M10 7v2h5v2h-5v2l-3-3zM3 6h5v1H3zm0 2h3v1H3zm0 2h3v1H3zm0 2h5v1H3z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="cp-color-format-row cp-columns cp-columns--bottom">
      <div class="cp-column">
        <label class="cp-select" :for="`cp-format-select-${uid}`">
          <span class="cp-select__label cp-visually-hidden"
            >Select color format</span
          >

          <select
            class="cp-select__input"
            :id="`cp-format-select-${uid}`"
            :value="activeFormat"
            @input="selectActiveFormat"
          >
            <option
              v-for="format in supportedColorFormats"
              :value="format"
              :key="format"
              >{{ format }}</option
            >
          </select>
        </label>
      </div>

      <div class="cp-column cp-column--grow">
        <div data-cp-format-group="hsl">
          <div class="cp-columns cp-columns--center">
            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsl-h-${uid}`">
                <span class="cp-text-field__label">H</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsl-h-${uid}`"
                  data-cp-input-hsl="h"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsl-s-${uid}`">
                <span class="cp-text-field__label">S</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsl-s-${uid}`"
                  data-cp-input-hsl="s"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsl-l-${uid}`">
                <span class="cp-text-field__label">L</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsl-l-${uid}`"
                  data-cp-input-hsl="l"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsl-a-${uid}`">
                <span class="cp-text-field__label">A</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsl-a-${uid}`"
                  data-cp-input-hsl="a"
                  type="text"
                />
              </label>
            </div>
          </div>
        </div>

        <div data-cp-format-group="hsv">
          <div class="cp-columns cp-columns--center">
            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsv-h-${uid}`">
                <span class="cp-text-field__label">H</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsv-h-${uid}`"
                  data-cp-input-hsv="h"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsv-s-${uid}`">
                <span class="cp-text-field__label">S</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsv-s-${uid}`"
                  data-cp-input-hsv="s"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsv-v-${uid}`">
                <span class="cp-text-field__label">V</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsv-v-${uid}`"
                  data-cp-input-hsv="v"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hsv-a-${uid}`">
                <span class="cp-text-field__label">A</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hsv-a-${uid}`"
                  data-cp-input-hsv="a"
                  type="text"
                />
              </label>
            </div>
          </div>
        </div>

        <div data-cp-format-group="hwb">
          <div class="cp-columns cp-columns--center">
            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hwb-h-${uid}`">
                <span class="cp-text-field__label">H</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hwb-h-${uid}`"
                  data-cp-input-hwb="h"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hwb-w-${uid}`">
                <span class="cp-text-field__label">W</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hwb-w-${uid}`"
                  data-cp-input-hwb="w"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hwb-b-${uid}`">
                <span class="cp-text-field__label">B</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hwb-b-${uid}`"
                  data-cp-input-hwb="b"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hwb-a-${uid}`">
                <span class="cp-text-field__label">A</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hwb-a-${uid}`"
                  data-cp-input-hwb="a"
                  type="text"
                />
              </label>
            </div>
          </div>
        </div>

        <div data-cp-format-group="rgb">
          <div class="cp-columns cp-columns--center">
            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-rgb-r-${uid}`">
                <span class="cp-text-field__label">R</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-rgb-r-${uid}`"
                  data-cp-input-rgb="r"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-rgb-g-${uid}`">
                <span class="cp-text-field__label">G</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-rgb-g-${uid}`"
                  data-cp-input-rgb="g"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-rgb-b-${uid}`">
                <span class="cp-text-field__label">B</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-rgb-b-${uid}`"
                  data-cp-input-rgb="b"
                  type="text"
                />
              </label>
            </div>

            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-rgb-a-${uid}`">
                <span class="cp-text-field__label">A</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-rgb-a-${uid}`"
                  data-cp-input-rgb="a"
                  type="text"
                />
              </label>
            </div>
          </div>
        </div>

        <div data-cp-format-group="hex">
          <div class="cp-columns cp-columns--center">
            <div class="cp-column cp-column--grow">
              <label class="cp-text-field" :for="`color-hex-${uid}`">
                <span class="cp-text-field__label">Hexadecimal</span>
                <input
                  class="cp-text-field__input"
                  :id="`color-hex-${uid}`"
                  data-cp-input-hex
                  type="text"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import copyToClipboard from "../lib/copyToClipboard.js";
import {
  HslColor,
  HsvColor,
  HwbColor,
  RgbColor,
  HexColor
} from "../lib/colorFormats.js";
import convert from "../lib/colorConversions.js";

export default {
  name: "ColorPicker",
  props: ["uid", "color", "format"],

  data() {
    return {
      activeFormat: "rgb",
      colors: {
        hsl: {},
        hsv: {},
        hwb: {},
        rgb: {},
        hex: ""
      }
    };
  },

  created() {
    this.supportedColorFormats = ["hsl", "hsv", "hwb", "rgb", "hex"];

    // This map holds data relevant for color input fields.
    this.colorInputs = new Map()
      .set("hsl", new HslColor())
      .set("hsv", new HsvColor())
      .set("hwb", new HwbColor())
      .set("rgb", new RgbColor())
      .set("hex", new HexColor());
  },

  mounted() {
    this.initColorInputs();
    this.trackPointerOrigin();
    this.initMarkerPointerNav();
    this.enhanceRangeInputs();

    document.head.style.color = this.color;
    const rgbValue = getComputedStyle(document.head).color;
    const functionArgument = rgbValue
      .substring(rgbValue.indexOf("(") + 1, rgbValue.indexOf(")"))
      .replace(" ", "");
    const channelValues = functionArgument.split(",");
    const rgb = {
      r: channelValues[0] / 255,
      g: channelValues[1] / 255,
      b: channelValues[2] / 255,
      a: channelValues.length === 4 ? channelValues[3] : 1
    };

    this.setColorValue(rgb, "rgb");
  },

  methods: {
    /**
     * Sets the active color format. If the format is not support, a valid default value will be set
     * instead.
     *
     * @param {string} format
     */
    setActiveFormat(format) {
      if (this.supportedColorFormats.includes(format)) {
        this.activeFormat = format;
      } else {
        this.activeFormat = "hsl";
      }
    },

    getColorValue(format, channel = undefined) {
      if (channel === undefined) {
        return this.colors[format];
      }

      return this.colors[format][channel];
    },

    setColorValue(value, format, channel = undefined) {
      if (channel === undefined) {
        this.colors[format] = value;
      } else {
        this.colors[format][channel] = value;
      }

      this.updateColors(format);
      this.emitColorInputEvent();
    },

    /**
     * Initializes all color inputs and their respective DOM nodes.
     *
     * - Registers event listeners to react to color changes in input fields.
     * - Sets the input’s color format (e.g. HSL) and channel (e.g. “s” for saturation).
     * - Sets additional input attributes (e.g. `min`, `max`, and `step` for range/number inputs).
     */
    initColorInputs() {
      for (const colorInput of this.colorInputs.values()) {
        this.initColorInput(colorInput);

        if (colorInput.channelInputs.size > 0) {
          for (const channel of colorInput.channelInputs.values()) {
            this.initChannel(channel, colorInput.format);
          }
        }
      }
    },

    initColorInput(colorInput) {
      if (colorInput.nodes === undefined) {
        colorInput.nodes = [];
      }

      // Store references to all used color inputs
      const selector = `[data-cp-input-${colorInput.format}=""]`;
      const colorInputNodes = this.$el.querySelectorAll(selector);
      colorInputNodes.forEach(colorInputNode => {
        colorInput.nodes.push(colorInputNode);
      });

      for (const inputNode of colorInput.nodes) {
        inputNode.addEventListener(
          "change",
          this.handleColorInputChange.bind(this)
        );

        if (colorInput.format !== undefined) {
          inputNode.setAttribute("data-cp-color-format", colorInput.format);
        }
      }
    },

    initChannel(channel, colorFormat) {
      if (channel.nodes === undefined) {
        channel.nodes = [];
      }

      // Store references to all used color channel inputs
      const selector = `[data-cp-input-${colorFormat}="${channel.name}"]`;
      const channelNodes = this.$el.querySelectorAll(selector);
      channelNodes.forEach(channelNode => {
        channel.nodes.push(channelNode);
      });

      for (const channelNode of channel.nodes) {
        const eventType = channelNode.type === "range" ? "input" : "change";
        channelNode.addEventListener(
          eventType,
          this.handleColorInputChange.bind(this)
        );

        if (colorFormat !== undefined) {
          channelNode.setAttribute("data-cp-color-format", colorFormat);
        }

        channelNode.setAttribute("data-cp-color-channel", channel.name);

        if (channelNode.type === "range" || channelNode.type === "number") {
          channelNode.setAttribute("min", channel.min);
          channelNode.setAttribute("max", channel.max);
          channelNode.setAttribute("step", channel.step);
        }
      }
    },

    /**
     * Generic event handler for updating the internal color data when the value of a color input
     * changes.
     *
     * For example, if the value in the input for an HSL color’s saturation channel changes, the
     * appropriate color will be updated and all colors of other color formats will be
     * re-calculated.
     *
     * @param {Event} event
     */
    handleColorInputChange(event) {
      const inputNode = event.currentTarget;

      if (!(inputNode instanceof HTMLInputElement)) {
        return;
      }

      const colorFormat = inputNode.getAttribute("data-cp-color-format");
      const colorInput = this.colorInputs.get(colorFormat);

      const channelName = inputNode.getAttribute("data-cp-color-channel");

      if (channelName !== null) {
        const channel = colorInput.channelInputs.get(channelName);
        const value = channel.convertToNumber(inputNode.value);

        if (isNaN(value)) {
          return;
        }

        this.setColorValue(value, colorFormat, channelName);
      } else {
        this.setColorValue(inputNode.value, colorFormat);
      }
    },

    /**
     * Updates all color inputs if their underlying color data changed.
     */
    updateColorInputs() {
      for (const colorInput of this.colorInputs.values()) {
        this.updateColorInput(colorInput);

        if (colorInput.channelInputs.size > 0) {
          for (const channelInput of colorInput.channelInputs.values()) {
            this.updateChannelInput(channelInput, colorInput.format);
          }
        }
      }
    },

    updateColorInput(colorInput) {
      const color = this.getColorValue(colorInput.format);

      for (const colorInputNode of colorInput.nodes) {
        colorInputNode.value = color;
        this.$el.style.setProperty(`--${colorInput.format}`, color);
      }
    },

    updateChannelInput(channel, colorFormat) {
      const color = this.getColorValue(colorFormat);
      const newValue = channel.convertToCssValue(color[channel.name]);

      for (const inputNode of channel.nodes) {
        if (inputNode.value !== newValue) {
          inputNode.value = newValue;
        }
      }

      this.$el.style.setProperty(`--${colorFormat}-${channel.name}`, newValue);
    },

    /**
     * @param {string} sourceFormat
     */
    updateColors(sourceFormat) {
      this.cascadeColorChanges(sourceFormat);
      this.updateColorInputs();
    },

    /**
     * Re-calculates all colors based on a changed color.
     *
     * For example, if an HSL color was changed, this method re-calculates the RGB, HSV, etc.
     * colors.
     *
     * @param {string} sourceFormat
     */
    cascadeColorChanges(sourceFormat) {
      const sourceColor = this.getColorValue(sourceFormat);
      const targetFormats = this.supportedColorFormats.filter(
        format => format !== sourceFormat
      );

      for (const targetFormat of targetFormats) {
        const color = convert[sourceFormat][targetFormat](sourceColor);
        this.colors[targetFormat] = color;
      }
    },

    /**
     * Emits a custom `cpInput` event with the following data in the `details` property:
     *
     * - format: The active color format (i.e. colorPicker.activeFormat)
     * - rawValue: The raw color value as it’s represented internally
     * - cssValue: A CSS color value matching the active color format (e.g. hsla(270, 80%, 50%, 1))
     *
     * This event is fired for every change to the internal color data.
     */
    emitColorInputEvent() {
      const colorInput = this.colorInputs.get(this.activeFormat);
      const rawValue = this.getColorValue(this.activeFormat);
      const cssValue = colorInput.convertToCssColor(rawValue);

      this.$emit("change", cssValue);
    },

    trackPointerOrigin() {
      if (this.$refs.colorSpace === null) {
        return;
      }

      this.pointerOriginatedInColorSpace = false;

      document.addEventListener("mouseup", () => {
        this.pointerOriginatedInColorSpace = false;
      });

      document.addEventListener("touchend", () => {
        this.pointerOriginatedInColorSpace = false;
      });
    },

    initMarkerPointerNav() {
      if (this.$refs.colorSpace !== null) {
        document.addEventListener("mousemove", this.moveMarkerWithMouse, {
          passive: false
        });
        document.addEventListener("touchmove", this.moveMarkerWithTouch, {
          passive: false
        });
      }
    },

    /**
     * @param {MouseEvent} event
     */
    moveMarkerWithMouse(event) {
      if (event.buttons !== 1 || this.pointerOriginatedInColorSpace === false) {
        return;
      }

      this.moveMarker(event.clientX, event.clientY);
    },

    /**
     * @param {TouchEvent} event
     */
    moveMarkerWithTouch(event) {
      if (this.pointerOriginatedInColorSpace === false) {
        return;
      }

      this.moveMarker(event.touches[0].clientX, event.touches[0].clientY);
    },

    /**
     * @param {number} clientX
     * @param {number} clientY
     */
    moveMarker(clientX, clientY) {
      // Stop touch events from dragging the page.
      event.preventDefault();

      const rect = this.$refs.colorSpace.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newHsvS = clamp(x / rect.width, 0, 1);
      const newHsvV = clamp(1 - y / rect.height, 0, 1);

      this.setColorValue(newHsvS, "hsv", "s");
      this.setColorValue(newHsvV, "hsv", "v");
    },

    /**
     * Controls the saturation and value portions of the color in HSV representation.
     *
     * @param {KeyboardEvent} event
     */
    moveMarkerWithArrows(event) {
      const marker = event.currentTarget;

      if (
        !["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(
          event.key
        ) ||
        !(marker instanceof HTMLElement)
      ) {
        return;
      }

      event.preventDefault();

      const format = marker.getAttribute("data-cp-marker-controls-format");
      const xAxisChannel = marker.getAttribute(
        "data-cp-marker-x-controls-channel"
      );
      const yAxisChannel = marker.getAttribute(
        "data-cp-marker-y-controls-channel"
      );
      const direction = ["ArrowLeft", "ArrowDown"].includes(event.key) ? -1 : 1;
      const channel = ["ArrowLeft", "ArrowRight"].includes(event.key)
        ? xAxisChannel
        : yAxisChannel;
      const step = event.shiftKey ? 10 : 1;

      const newValue =
        this.getColorValue(format, channel) + direction * step * 0.01;
      this.setColorValue(clamp(newValue, 0, 1), format, channel);
    },

    /**
     * Copies the current color (determined by the active color format).
     *
     * For example, if the active color format is HSL, the copied text will be a valid CSS color in
     * HSL format.
     */
    copyColor() {
      const colorInput = this.colorInputs.get(this.activeFormat);
      const color = this.getColorValue(colorInput.format);
      const colorString = colorInput.convertToCssColor(color);
      copyToClipboard(colorString);
    },

    /**
     * Cycles through the active color formats.
     */
    selectActiveFormat(event) {
      const newFormat = event.target.value;
      if (this.supportedColorFormats.includes(newFormat)) {
        this.activeFormat = newFormat;
      }
    },

    /**
     * Enhances the keyboard interaction with all range inputs on a page by adding the ability to
     * increment/decrement an input’s value in greater steps when holding down the shift key.
     *
     * In its initial state, a factor of 10 will be applied to all steps.
     */
    enhanceRangeInputs() {
      const inputs = this.$el.querySelectorAll('input[type="range"]');
      inputs.forEach(input => {
        input.addEventListener("keydown", this.changeInputValue, {
          passive: true
        });
      });
    },

    /**
     * This event listener adds the ability to navigate
     * a range input in larger steps by holding down Shift
     * while pressing the arrow keys.
     *
     * @param {KeyboardEvent} event
     */
    changeInputValue(event) {
      const input = event.currentTarget;

      if (
        !["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(
          event.key
        ) ||
        !event.shiftKey ||
        !(input instanceof HTMLInputElement && input.type === "range")
      ) {
        return;
      }

      const step = input.step !== "" ? parseFloat(input.step) : 1;
      const stepFactor = 10;
      const direction = ["ArrowLeft", "ArrowDown"].includes(event.key) ? -1 : 1;
      const wideStep = step * stepFactor;
      const value = parseFloat(input.value) + direction * wideStep;
      const min = input.min !== "" ? parseFloat(input.min) : 0;
      const max = input.max !== "" ? parseFloat(input.max) : 100;
      const newValue = clamp(value, min, max);

      // Remove one step because the default action needs to be able to set a new value for it to fire
      // events, too.
      input.value = String(newValue - direction * step);
    }
  }
};

/**
 * Clamps the given value between the min and max boundaries.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number} - `value` if `min <= value <= max`
 *                   - `min` if `value < min`
 *                   - `max` if `value > max`
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}
</script>
