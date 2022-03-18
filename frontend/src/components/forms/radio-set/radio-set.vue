<template lang="pug">
  div(:class="containerClass")
    client-only
      perfect-scrollbar.radioset_scroll( v-once :options="scrollbarSettings" )
        div(:class="scrollBodyClass")
          label( 
            v-for="(opt, ind) in options" 
            :key="ind" 
            :class="itemClass"
            )
            input(
              hidden
              type="radio"
              v-model="modelValue"
              :value="opt"
              :name="inpName"
              @change="updateIcon(`chb${ind}`, $event.target.checked)"
              )
            div(:class="itemBodyClass")
              slot(name="icon")  
                v-icon-check(
                  :ref="`chb${ind}`"
                  v-if="showIcon"
                  :class="slotIconClass"
                  :is-checked="opt === value"
                  )
              slot(name="text" :opt="opt" )
                span(:class="slotTextClass") {{opt.name}}

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
      },
      containerClass: {
        type: String,
        default: 'radioset'
      },
      itemClass: {
        type: String,
        default() {return `${this.containerClass}-item`}
      },
      slotIconClass: {
        type: String,
        // default: 'radioset-item_icon'
        default() {return `${this.itemClass}_icon`}
      },
      slotTextClass: {
        type: String,
        // default: 'radioset-item_text'
        default() {return `${this.itemClass}_text`}
      },
      itemBodyClass: {
        type: String,
        // default: 'radioset-item_body'
        default() {return `${this.itemClass}_body`}
      },
      scrollbarClass: {
        type: String,
        // default: 'radioset_scroll-body'
        default() {return `${this.containerClass}_scroll`}
      },
      scrollBodyClass: {
        type: String,
        // default: 'radioset_scroll-body'
        default() {return `${this.scrollbarClass}_scroll-body`}
      },


    },
    data() {
      return {
        modelValue: null,
        inpName: '',
        checkIcons:[]
      }
    },
    created() {
      this.inpName = `radio-${(100000 * Math.random()).toFixed()}`
      this.modelValue = this.value
      this.checkIcons
    },
    watch: {
      modelValue(newValue) {this.$emit('input', newValue)},
      value(val) {this.modelValue = val}
    },
    methods: {
      updateIcon(iconRef, val) {
        const vv = Object.values(this.$refs)
        vv.forEach(r => r[0].checked = false)
        this.$refs[iconRef][0].checked = val

      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "radio-set";
</style>
