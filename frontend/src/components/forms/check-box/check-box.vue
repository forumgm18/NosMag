<template lang="pug">
  label.checkbox(:class="{ checked : shouldBeChecked || isChecked }")
    input(
      hidden 
      type="checkbox"
      :checked="shouldBeChecked || isChecked"
      :value="value"
      @change="updateInput"      
      )
    span.checkbox_text-block
      span.checkbox_icon
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
    value: {
      // type: String,
    },
    modelValue: {
      default: false
    },
    // label: {
    //   type: String,
    //   required: true
    // },
    // Мы установили `true-value` и `false-value` в true и false по-умолчанию, таким образом
    // мы всегда можем использовать их вместо проверки на то, установлены они или нет.
    // Также здесь мы можем использовать camelCase, дефис разделяющий имя атрибута
    // все равно будет работать
    trueValue: {
      default: true
    },
    falseValue: {
      default: false
    },
    isChecked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    shouldBeChecked() {
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.includes(this.value)
      }
      // Обратите внимание, что `true-value` и` false-value` являются camelCase в JS
      return this.modelValue === this.trueValue    
    }
  },
  methods: {
    updateInput(event) {
      let isChecked = event.target.checked      
      if (Array.isArray(this.modelValue)) {
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
