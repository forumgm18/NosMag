<template lang="pug">
  v-scrollbar.check-list(
    :scrollbar-options="scrollbarSettings" 
    v-on="$listeners"
    )
    template(#default)
      .check-list_scroll-body
        v-check-box.check-list_item(
          v-for="opt in options"
          :key="opt.id"
          :true-value="{checked: true, value: opt}"
          :false-value="{checked: false, value: opt}"
          :value="opt"
          @change="updateInput"
          )
          slot(name="optText" :opt="opt" ) {{opt.name}}
</template>

<script>

  export default {
    name: 'v-check-list',
    model: {
      prop: 'modelValue',
      event: 'change'
    },
    props: {
      options: {
        type: [Array, Object],
        required: true
      },
      value: {
        type: Array,
      },
      modelValue: { },
      multiple: {
        required: false,
        default: true
      },
      // selectAll: {
      //   type: Boolean,
      //   default: false  
      // },
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
    methods: {
      updateInput(val) {
        if (this.modelValue instanceof Array) {
          let newValue = [...this.modelValue]
          if (val.checked) {
            newValue.push(val.value)
          } else {
            newValue.splice(newValue.indexOf(val.value), 1)
          } 
          this.$emit('change', newValue)
        } else {
          this.$emit('change', val)
        }
        
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "check-list";
</style>
