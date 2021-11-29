<template lang="pug">
  .input-field(:class="{'is-error': isError}")
    input(
      v-model="locValue"
      v-mask="vMask"
      :type="type"
      :placeholder="placeholder"
      
    )
    .input-field-error {{errorText}}

</template>

<script>
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
  },
  data() {
    return {
      locValue: this.value
    }
  },
  watch: {
    locValue: function(val, oldVal) {
      this.$emit('input', val, oldVal)
    }
  }  

}
</script>

<style lang="scss" scoped>
  @import 'input-field'
</style>