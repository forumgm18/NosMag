<template lang="pug">
.checkbox
  label.checkbox-label
    input(
      hidden 
      type="checkbox"
      :checked="shouldBeChecked"
      :value="value"
      @change="updateInput"      
      )
    //- input(type="checkbox" hidden v-model="selectItems" :value="{scode: item.scode}")
    span.checkbox_text-block
      v-icon-check(:is-checked="shouldBeChecked")
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
    }
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
