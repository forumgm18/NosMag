<template lang="pug">
  label.check-item
    input(ref="chitm" hidden :type="type"  :value="value" v-model="proxyChecked")
    .check-item-body
      .check-item-icon
        slot(name="icon")
      .check-item-text
        .check-item-title
          slot(name="title")
        .check-item-descr
          slot(name="descr")


</template>

<script>
export default {
  name: 'check-item',
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: {},
    checked: {
      type: [Boolean, Array, String],
      default: false
    },
    type: {
      type: String,
      default: 'checkbox'
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
@import 'check-item';
</style>
