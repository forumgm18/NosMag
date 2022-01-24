<template lang="pug">
  .input-field(:class="{'is-error': $v.locValue.$error}")
    input(
      v-model="$v.locValue.$model"
      v-mask="vMask"
      :type="type"
      :placeholder="placeholder"
      
    )
    .input-field-error(v-if="errorText.length") {{errorText}}

</template>

<script>

import { required, email, minValue, maxValue, minLength, maxLength } from 'vuelidate/lib/validators'
import { validatePhone } from '@/utils/main-scripts'
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
    isValid: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    minLength: {
      type: Number,
      default: null
    },
    maxLength: {
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
      if (this.minLength) vObj.minLength = minLength(this.minLength)
      if (this.maxLength) vObj.maxLength = maxLength(this.maxLength)
    }
    if (this.type === 'number') {
      if (this.minValue) vObj.minValue = minValue(this.minValue)
      if (this.maxValue) vObj.maxValue = maxValue(this.maxValue)
    }
    if (this.type === 'tel') {
      vObj.validatePhone = validatePhone
    }
    // console.log('vObj: ', vObj)
    return { locValue: vObj }      
  },

watch: {
    locValue: function(val, oldVal) {
      this.$emit('input', val, oldVal)
      // this.$emit('update:is-error', this.$v.locValue.$error)
      this.$emit('update:isValid', !this.$v.locValue.$error)
      // debugger
    }
  }  

}
</script>

<style lang="scss" >
  @import 'input-field'
</style>