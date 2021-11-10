<template lang="pug">
  .input-field(:class="{'is-error': $v.locValue.$error}")
    input(
      v-model="$v.locValue.$model"
      v-mask="vMask"
      :type="type"
      :placeholder="placeholder"
      
    )
    .input-field-error {{errorText}}

</template>

<script>

import { required, email, minValue, maxValue, minWidth, maxWidth } from 'vuelidate/lib/validators'

export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    vMask: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    errorText: {
      type: String,
      default: ''
    },
    isError: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: Number,
      default: null
    },
    maxWidth: {
      type: Number,
      default: null
    },
    minValue: {
      type: Number,
      default: null
    },
    maxValue: {
      type: Number,
      default: null
    },

  },
  data() {
    return {
      locValue: this.value,
      validationsObj: null
    }
  },
  // validations: {
  //   locValue: this.validationsObj
  // },  

  validations () {
    const vObj = {}
    if (this.required) vObj.required = required
    if (this.type === 'email') vObj.email = email
    if (this.type === 'text') {
      if (this.minWidth) vObj.minWidth = minWidth(this.minWidth)
      if (this.maxWidth) vObj.maxWidth = maxWidth(this.maxWidth)
    }
    if (this.type === 'number') {
      if (this.minValue) vObj.minValue = minValue(this.minValue)
      if (this.maxValue) vObj.maxValue = maxValue(this.maxValue)
    }
    // console.log('vObj: ', vObj)
    return { locValue: vObj }      
  },

watch: {
    locValue: function(val, oldVal) {
      this.$emit('input', val, oldVal)
      this.$emit('update:is-error', this.$v.locValue.$error)
      
    }
  }  

}
</script>

<style lang="scss" scoped>
  @import 'input-field'
</style>