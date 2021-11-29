<template lang="pug">
  .radio-checkbox
    label.radio-checkbox-label(data-checked="value")
      input(
        hidden
        type="checkbox"
        :value="val"
        v-model="model"
        )
      span.radio-checkbox_text-block
        span.radio-checkbox_icon
        span.radio-checkbox_text
          slot
</template>

<script>
export default {
  name: 'RadioCheckbox',
  props: [ 'value', 'val' ],
  computed: {
    model: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
}
</script>

<style lang="scss">
@import 'styles';
</style>
