<template lang="pug">
.checkbox
  label.checkbox-label
    input(ref="chbx" hidden type="checkbox"  :value="value" v-model="proxyChecked")
    span.checkbox_text-block
      span.checkbox_icon
      span.checkbox_text
        slot
</template>

<script>
export default {
  name: 'check-box',
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: {},
    checked: {
      type: [Boolean, Array],
      default: false
    }
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
@import 'check-box';
</style>
