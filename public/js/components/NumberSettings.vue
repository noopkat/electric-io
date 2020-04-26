<template>
  <div>
    <label :for="`deviceId-${tile.id}`">
      Device Id
      <select
        :id="`deviceId-${tile.id}`"
        name="deviceId"
        :value="tile.deviceId"
      >
        <option
          v-for="(device, index) in deviceList"
          :key="`device-list-${index}`"
          :value="device"
        >
          {{ device }}
        </option>
      </select>
    </label>

    <data-property-field
      name="property"
      :value="tile.property"
      :tile-id="tile.id"
    />

    <label :for="`textColorMode-${tile.id}`">
      Text Color
      <select
        :id="`textColorMode-${tile.id}`"
        v-model="textColorMode"
        name="textColorMode"
      >
        <option value="single">
          Single color
        </option>
        <option value="gradient">
          Color gradient
        </option>
      </select>
    </label>

    <input
      :id="`textColor-${tile.id}`"
      v-model="textColor"
      type="hidden"
      name="textColor"
    />
    <input
      :id="`lowTextColor-${tile.id}`"
      v-model="lowTextColor"
      type="hidden"
      name="lowTextColor"
    />
    <input
      :id="`highTextColor-${tile.id}`"
      v-model="highTextColor"
      type="hidden"
      name="highTextColor"
    />

    <template v-if="textColorMode === 'single'">
      <color-picker
        :uid="`textColor-${tile.id}`"
        :color="textColor"
        style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
        @change="updateTextColor"
      />
    </template>

    <template v-if="textColorMode === 'gradient'">
      <div class="settings__number__gradient-container">
        <div class="settings__number__gradient-container__value">
          <label :for="`lowValue-${tile.id}`">Low Value</label>
          <input
            :id="`lowValue-${tile.id}`"
            name="lowValue"
            v-model="lowValue"
            class="settings__number__gradient-container__value__input"
          />
        </div>
        <div class="settings__number__gradient-container__color">
          <button
            type="button"
            class="action-button"
            aria-label="Open color picker for the low value"
            :style="`--c-button-bg: ${lowTextColor}`"
            @click.prevent="editingColor = 'low'"
          >
            color
          </button>
          <div style="float:right">
            <div
              class="card settings__number__gradient-container__colorpicker"
              v-if="editingColor === 'low'"
            >
              <div class="settings__header">
                <button
                  :aria-labelledby="`close-colorpicker-label-${tile.Id}`"
                  class="settings__toggle-btn"
                  @click.prevent="editingColor = null"
                >
                  <span
                    :id="`close-colorpicker-label-${tile.Id}`"
                    aria-hidden="true"
                    class="screen-reader-only"
                    >Close color picker</span
                  >
                  <span aria-hidden="true">×</span>
                </button>
                <h2>Low Value Color</h2>
              </div>
              <color-picker
                key="low"
                :uid="`lowTextColor-${tile.id}`"
                :color="lowTextColor"
                style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
                @change="updateLowTextColor"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="settings__number__gradient-container">
        <div class="settings__number__gradient-container__value">
          <label :for="`highValue-${tile.id}`">High Value</label>
          <input
            :id="`highValue-${tile.id}`"
            name="highValue"
            v-model="highValue"
            class="settings__number__gradient-container__value__input"
          />
        </div>
        <div class="settings__number__gradient-container__color">
          <button
            type="button"
            class="action-button"
            aria-label="Open color picker for the high value"
            :style="`--c-button-bg: ${highTextColor}`"
            @click.prevent="editingColor = 'high'"
          >
            color
          </button>
          <div style="float:right">
            <div
              v-if="editingColor === 'high'"
              class="card settings__number__gradient-container__colorpicker"
            >
              <div class="settings__header">
                <button
                  :aria-labelledby="`close-colorpicker-label-${tile.Id}`"
                  class="settings__toggle-btn"
                  @click.prevent="editingColor = null"
                >
                  <span
                    :id="`close-colorpicker-label-${tile.Id}`"
                    aria-hidden="true"
                    class="screen-reader-only"
                    >Close color picker</span
                  >
                  <span aria-hidden="true">×</span>
                </button>
                <h2>High Value Color</h2>
              </div>
              <color-picker
                key="high"
                :uid="`highTextColor-${tile.id}`"
                :color="highTextColor"
                style="--cp-background-color: transparent; --cp-focus-color: var(--focus-color); --cp-width: var(--card-form-width)"
                @change="updateHighTextColor"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import ColorPicker from "./ColorPicker";
import DataPropertyField from "./DataPropertyField";

export default {
  name: "NumberSettings",

  components: {
    ColorPicker,
    DataPropertyField
  },

  props: {
    tile: {
      type: Object,
      required: true
    },
    deviceList: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      textColorMode: this.tile.textColorMode,
      textColor: this.tile.textColor,
      lowValue: this.tile.lowValue,
      lowTextColor: this.tile.lowTextColor,
      highValue: this.tile.highValue,
      highTextColor: this.tile.highTextColor,
      editingColor: null
    };
  },

  methods: {
    updateTextColor(value) {
      this.textColor = value;
    },
    updateLowTextColor(value) {
      this.lowTextColor = value;
    },
    updateHighTextColor(value) {
      this.highTextColor = value;
    }
  }
};
</script>
