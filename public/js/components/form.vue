<template>
  <div class="cardForm">
    <h2>Settings</h2>

    <form v-on:submit.prevent="onSubmit">
      <input name="id" type="hidden" v-bind:value="tile.id"/>

      <label>Title
        <input v-focus="editing" type="text" name="title" v-bind:value="tile.title"/>
      </label>

      <form-fields :tile="tile" :deviceList="deviceList" />

      <input type="submit" value="save" />
    </form>
  </div>
</template>

<script>
// focus management mixin
import { focus } from '../vendor/vue-focus.js';
import FormFields from './formFields';
import { Script } from 'vm';

export default {
  name: 'card-form',
  directives: { focus },
  components: { FormFields },
  template,
  props: ['tile', 'deviceList', 'editing'],
  methods: {
    onSubmit: function(event) {
      let eventData = {};
      const formData = new FormData(event.target);
      formData.forEach((value, name) => {
        eventData[name] = value;
      });
      this.$emit('save-settings', eventData);
    }
  }
}
</script>