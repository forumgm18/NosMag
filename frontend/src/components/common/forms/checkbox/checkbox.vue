<template lang="pug">
  .checkbox
    label.checkbox-label
      //input( hidden type="checkbox"  :value="val" v-model="model" )
      //input(        hidden        type="checkbox"    v-bind:checked="checked"        v-on:change="changeHandler"      )
      //input( hidden        type="checkbox"    :value="value"   v-model="model"           )
      input(hidden type="checkbox" :checked="isChecked" :value="value" @change="updateInput")
      span.checkbox_text-block
        span.checkbox_icon
        span.checkbox_text
          slot
</template>

<script>
export default {
  name: 'checkbox',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    // value: { type: String },
     value: {},

    modelValue: { default: '' },
    // label: { type: String, required: true},
    trueValue: { default: true },
    falseValue: { default: false }
  },
  computed: {
    isChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value)
      }
      // Note that `true-value` and `false-value` are camelCase in the JS
      return this.modelValue === this.trueValue
    }
  },
  methods: {
    updateInput(event) {
      let isChecked = event.target.checked
      if (this.modelValue instanceof Array) {
        let newValue = [...this.modelValue]
        if (isChecked) {
          newValue.push(this.value)
        } else {
          newValue.splice(newValue.indexOf(this.value), 1)
        }
        this.$emit('change', newValue)
      } else {
        this.$emit('change', isChecked ? this.trueValue : this.falseValue)
      }
    }
  }
}
</script>

<style lang="scss">
@import 'checkbox';
</style>
