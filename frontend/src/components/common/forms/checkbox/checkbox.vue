<template lang="pug">
  .checkbox
    label.checkbox-label(data-checked="value")
      input(
        hidden
        type="checkbox"
        :value="val"
        v-model="model"
        )
      span.checkbox_text-block
        span.checkbox_icon
        span.checkbox_text
          slot
</template>

<script>
export default {
  name: 'Checkbox',
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
