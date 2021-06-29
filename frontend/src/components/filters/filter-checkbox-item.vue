<template lang="pug">
  .filter-item
    label.checkbox(data-checked="value")
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
  name: 'FilterCheckboxItem',
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

<style scoped>

</style>
