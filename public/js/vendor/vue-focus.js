// this is a modified version of https://github.com/simplesmiler/vue-focus

'use strict';
  export const version = '2.1.0';

  export const focus = {
    inserted: function(el, binding) {
      if (binding.value) el.focus();
      else el.blur();
    },

    componentUpdated: function(el, binding) {
      if (binding.modifiers.lazy) {
        if (Boolean(binding.value) === Boolean(binding.oldValue)) {
          return;
        }
      }

      if (binding.value) el.focus();
      else el.blur();
    },
  };

  export const mixin = {
    directives: {
      focus: focus,
    },
  };

