<template lang="pug">
  client-only
    perfect-scrollbar.radioset(
      v-once :options="scrollbarSettings"
      
      )
      .radioset_scroll-body
        label.radioset_item( v-for="(opt, ind) in options" :key="ind" )
          input.radioset_input(
            hidden
            type="radio"
            v-model="modelValue"
            :value="opt"
            :name="inpName"
            )
          .radioset_body  
            slot(name="optText" :opt="opt" )
              .radioset_icon
                //- svg.icon.icon-radio
                  use(href="#icon-radio")  
                //- svg.icon.icon-radio.checked
                  use(href="#icon-radio")  
              span.radioset_text {{opt.name}}

</template>

<script>
  export default {
    name: 'v-radio-list',
    props: {
      options: {
        type: [Array, Object],
        required: true
      },
      value: {
        // type: Array,
        required: true
      },
      showIcon: {type:Boolean, default: true},
      scrollbarSettings: {
        type: Object,
        default() { 
          return {
            suppressScrollX: true,
            minScrollbarLength: 30,
          }
        }  
      }
    },
    data() {
      return {
        modelValue: null,
        inpName: ''
      }
    },
    created() {
      this.inpName = `radio-${(100000 * Math.random()).toFixed()}`
      this.modelValue = this.value
    },
    watch: {
      modelValue(newValue) {this.$emit('input', newValue)}
    },

  }
</script>

<style lang="scss" scoped>
  @import "radio-set";
</style>
