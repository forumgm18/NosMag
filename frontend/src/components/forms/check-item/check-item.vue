<template lang="pug">
  label.check-item
    input(
      ref="chitm" 
      hidden 
      :checked="isChecked"
      :type="type"  
      :value="value" 
      v-model="proxyChecked"
      )
    .check-item-body
      .check-item-content
        .check-item-icon
          slot(name="icon")
        .check-item-text
          .check-item-title
            slot(name="title")
          .check-item-descr
            slot(name="descr")
      .check-item-footer(v-if="hasFooter")
        slot(name="footer")


</template>

<script>
export default {
  name: 'check-item',
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: {
      // type: [Boolean, Array, String],
      // default: false
    },
    checked: {
      // type: [Boolean, Array, String],
      // type: Boolean,
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'checkbox'
    },
    hasFooter: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    proxyChecked: {
      get() {
        return this.checked
      },
      set(val) {
        this.$emit("change", val)
      }
    }
  },
  mounted() {
    if (this.isChecked) this.proxyChecked = this.value
  }
}
</script>

<style lang="scss">
@import 'check-item';
</style>
