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
      .check-item-icon(v-if="hasIcon")
        slot(name="icon")
      .check-item-text(:class="{p0: !hasIcon}")
        .check-item-title(v-if="hasTitle")
          slot(name="title")
        .check-item-descr(v-if="hasDescr")
          slot(name="descr")
        .check-item-offer(v-if="hasOffer")
          slot(name="offer")


</template>

<script>
export default {
  name: 'check-item',
  model: {
    prop: "checked",
    event: "change"
  },

  props: {
    value: { },
    checked: {
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
    hasIcon: {
      type: Boolean,
      default: true
    },
    hasTitle: {
      type: Boolean,
      default: true
    },
    hasDescr: {
      type: Boolean,
      default: false
    },
    hasOffer: {
      type: Boolean,
      default: true
    },

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
.p0 {padding: 0;}
</style>
