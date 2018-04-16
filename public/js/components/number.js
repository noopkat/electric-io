const template = `<p class="number" v-bind:style="numberStyle">{{ number }}</p>`;

export default Vue.component('card-number', {
  template,
  props: {
    tile: {
      default: () => ({})
    }, 
    blockSize: {
      default: () => ([])
    }, 
    messages: {
      default: () => ([])
    }
  },
  data: function() {
    return {
      number: 0  
    }
  },
  watch: {
    messages: function() {
      const lastMessage = this.messages.pop();
      this.number = lastMessage ? lastMessage[this.tile.property].toFixed(1) : 0;
    }
  },
  computed: {
    numberStyle: function() {
      return {color: this.tile.textColor}
    }
  }
});

