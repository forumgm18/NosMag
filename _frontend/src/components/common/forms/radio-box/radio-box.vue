<template lang="pug">
.radiobox
  label.radiobox-label
    input(:class="{notchecked: !isChecked }" hidden type="radio" :checked="isChecked" :value="value" @change="updateInput")
    span.radiobox_text-block
      span(v-if="showIcon").radiobox_icon
      span.radiobox_text
        slot
</template>

<script>
 import {isEqual} from 'lodash'
export default {
  name: 'radio-box',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    // value: { type: String },
     value: {},
    modelValue: { default: '' },
    showIcon: {type:Boolean, default: true}
    // trueValue: { default: true },
    // falseValue: { default: false },
  },
  computed: {
    isChecked() {
      if (this.modelValue instanceof Object) {
        return isEqual(this.modelValue, this.value)
      }

      return this.modelValue === this.value
    }
  },
  methods: {
    updateInput(event) {
      let isChecked = event.target.checked
      if (this.modelValue instanceof Object) {
        let newValue = isChecked ? Object.assign({},this.value) : {}
        this.$emit('change', newValue)
      } else {
        // this.$emit('change', event.target.value)
        this.$emit('change', this.value)
      }

      
    }
  }
}
</script>

<style lang="scss">
@import 'radio-box';
</style>
