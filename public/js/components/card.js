// conditional imports would be great however we're not using webpack
import StickerCard from './sticker.js';
import LineChartCard from './lineChart.js';
import PieChartCard from './pieChart.js';
import ButtonCard from './button.js';
import NumberCard from './number.js';
import FormCard from './form.js';
import TextCard from './text.js';

const template = `
  <div class="card" v-bind:class="{'dragging': dragging}" v-bind:style="style" v-on:mousedown.stop="onMouseDown">
   <template v-if="showChildCard">
     <div v-if="showControls" class="controls">
        <button class="edit" ref="editButton" v-on:click="onEdit">edit</button>
        <button class="delete" v-on:click="onDelete(tile.id)">X</button>
      </div>
      <h2 v-if="tile.title">{{tile.title}} </h2>
      <component v-bind:is="childCard" v-bind:tile="tile" v-bind:blockSize="blockSize" v-bind:messages="messages"></component>
  </template>
    <card-form v-if="showForm" v-bind:editing="editing" v-bind:tile="tile" v-bind:deviceList="deviceList" v-on:save-settings="onSaveSettings" v-on:cancel-save-settings="onCancelSave"></card-form>
  </div>`;

export default Vue.component('card-base', {
  template,
  props: ['tile', 'blockSize', 'deviceList', 'messages', 'editMode'],
  data: function() {
    return {
      editing: false,
      dragging: false,
      mouseMoved: false,
      y: this.tile.position[1],
      x: this.tile.position[0],
      offsetY: 0,
      offsetX: 0
    }
  },
  methods: {
    onMouseDown: function(event) {
      const allowedModes = ['unlocked', 'demo'];
      const excludedNodes = ['INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
      if (!this.dragging && !excludedNodes.includes(event.target.tagName) && allowedModes.includes(this.editMode)) {
        this.dragging = true;
        this.offsetY = event.clientY - this.y;
        this.offsetX = event.clientX - this.x;
        window.addEventListener('mousemove', this.onMouseMove, true);
      }
    },
    onMouseMove: function(event) {
      this.mouseMoved = true;
      this.y = event.clientY - this.offsetY;
      this.x = event.clientX - this.offsetX;
    },
    onMouseUp: function(event) {
      window.removeEventListener('mousemove', this.onMouseMove, true);
      if (this.dragging && this.mouseMoved) {
        const newPosition = {position: [this.x, this.y]};
        const eventData = Object.assign({}, this.tile, newPosition);

        this.$emit('tile-position', eventData);
      }
      this.dragging = false;
      this.mouseMoved = false;
    },
    onEdit: function() {
      this.editing = true;
    },
    onDelete: function(tileId) {
      const message = 'Oh, do you really want to remove this card?';
      const confirm = window.confirm(message);
      if (confirm) {
        this.$emit('tile-delete', tileId);
      }
    },
    onSaveSettings: function(event) {
      this.editing = false;
      this.$emit('tile-settings', event);
    },
    onCancelSave: function() {
      this.editing = false;
      this.tile.saveSuccess = undefined;
    }
  },
  watch: {
    editing: function(value) {
      if (!this.editing && this.saveSuccess === true) {
        // focus on edit button
        this.$nextTick(function(){ this.$refs.editButton.focus() });
      } 
    }
  },
  computed: {
    top: function() {
      return `${this.y}px`;
    },
    left: function() {
      return `${this.x}px`;
    },
    style: function() {
      return { 
        top: this.top, 
        left: this.left,
        width: `${this.blockSize[0] * this.tile.size[0]}px`,
        minHeight: `${this.blockSize[1] * this.tile.size[1]}px`
      };
    },
    childCard: function() {
      return `card-${this.tile.type.toLowerCase()}`;
    },
    showChildCard: function() {
      return this.showForm === false;
    },
    showForm: function() {
      return this.editing || (this.tile.saveSuccess === false);
    },
    showControls: function() {
      const allowedModes = ['unlocked', 'demo'];
      return allowedModes.includes(this.editMode);
    }
  },
  mounted() {
    window.addEventListener('mouseup', this.onMouseUp, false);
  }
});

