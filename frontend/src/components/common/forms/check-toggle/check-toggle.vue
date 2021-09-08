<template lang="pug">
  label.check-toggle(
    :style="{ '--off-color': offColor, '--on-color': onColor}"
  )
    input(ref="chbx" hidden type="checkbox"  :value="value" v-model="proxyChecked")
    span.check-toggle_body
      slot(name="checkToggleIcon")
        span.check-toggle_icon
      span.check-toggle_text
        slot
</template>

<script>
export default {
  name: 'check-toggle',
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: {},
    checked: {
      type: [Boolean, Array],
      default: false
    },
    offColor: {
      type: String,
      default:'var(--base-color4)'
    },
    onColor: {
      type: String,
      default:'var(--base-color1)'
    },

  },
  computed: {
    proxyChecked: {
      get() {
        return this.checked;
      },
      set(val) {
        this.$emit("change", val);
      }
    }
  },
}
</script>

<style lang="scss">
@import 'check-toggle';
</style>
