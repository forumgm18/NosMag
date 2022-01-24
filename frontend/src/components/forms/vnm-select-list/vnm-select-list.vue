<template lang="pug">
  perfect-scrollbar.vnm-select-list(
    v-once :options="scrollbarSettings" 
    ref="fsList" 
    @click.stop 
    )
    template(#default v-if="itemType==='checkbox'" )
      .vnm-select-list_scroll-body
        check-box.vnm-select-list_item(
          v-for="opt in options"
          :key="opt.id"
          v-model="model"
          :value="opt"
        )
          slot(name="optText" :opt="opt" ) {{opt.name}}

    template(#default v-else )
      .vnm-select-list_scroll-body
        radio-box.vnm-select-list_item(
          v-for="opt in options"
          :key="opt.id"
          v-model="model"
          :value="opt"
          :show-icon="showIcon"
        )
          
          slot(name="optText" :opt="opt" ) {{opt.name}}

</template>

<script>
  import checkBox from "~/components/forms/check-box/check-box"
  import radioBox from "~/components/forms/radio-box/radio-box"

  export default {
    name: 'vnm-select-list',
    components: {checkBox, radioBox,
    },
    props: {
      options: {
        type: [Array, Object],
        required: true
      },
      value: {
        type: [Array, Object]
      },
      multiple: {
        required: false,
        default: true
      },
      itemType: {
        type: String,
        default: 'checkbox'
      },
      selectAll: {
        type: Boolean,
        default: false  
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

      // id: {}
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set(val) {
          //this.$emit('input', {id: this.id, values: val});
          this.$emit('input', val);
          // this.$emit('change', val);
          // this.emitValue(val);
        },
      },

    },

  }
</script>

<style lang="scss" scoped>
  @import "vnm-select-list";
</style>
