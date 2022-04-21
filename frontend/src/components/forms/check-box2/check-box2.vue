<template lang="pug">
  label.checkbox(:class="{ checked : shouldBeChecked }")
    input(
      hidden 
      type="checkbox"
      :checked="shouldBeChecked"
      :value="value"
      @change="updateInput"      
      )
    span.checkbox_text-block
      v-icon-check(
        :is-checked="shouldBeChecked"
        :base-checked-color="baseCheckedColor"
        :base-not-checked-color="baseNotCheckedColor"
        :base-hover-color="baseHoverColor"
        )
      span.checkbox_text
        slot
</template>

<script>
// import radioCheckMixin from '@/mixins/radio-check.mix'
export default {
  name: 'check-box',
  model: {
    prop: 'modelValue',
    event: 'change'
  },
  props: {
    value: { },
    modelValue: {  default: false },
    trueValue: { default: true },
    falseValue: { default: false },
    baseCheckedColor: {
      type: String,
      default: 'var(--base-color1)'
    },
    baseNotCheckedColor: {
      type: String,
      default: 'var(--base-color4)'
    },
    baseHoverColor: {
      type: String,
      default: 'var(--base-color3)'
    },

  },
  computed: {
    shouldBeChecked() {
      if (this.modelValue instanceof Array) {
        return this.modelValue.includes(this.value)
      }
      // Обратите внимание, что `true-value` и` false-value` являются camelCase в JS
      return this.modelValue === this.trueValue    }
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
@import 'check-box';
</style>
