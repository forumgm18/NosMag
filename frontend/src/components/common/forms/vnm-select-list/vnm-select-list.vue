<template lang="pug">
.vnm-select-list(
  
  ref="fsList" 
  @click.stop 
  )
  //- .vnm-select-list
  scroll-bar.vnm-select-list_scroll
    .vnm-select-list_scroll-body(v-if="itemType==='checkbox'")
      check-box.vnm-select-list_item(
        v-for="opt in options"
        :key="opt.id"
        v-model="model"
        :value="opt"
        
      )
        slot(name="optText" :opt="opt" ) {{opt.name}}
    .vnm-select-list_scroll-body(v-else)    
      radio-box.vnm-select-list_item(
        v-for="opt in options"
        :key="opt.id"
        v-model="model"
        :value="opt"
      )
        slot(name="optText" :opt="opt" ) {{opt.name}}

</template>

<script>
  import ScrollBar from 'vue2-scrollbar'
  import checkBox from "~/components/common/forms/check-box/check-box";
  import radioBox from "~/components/common/forms/radio-box/radio-box";

  export default {
    name: 'vnm-select-list',
    components: {ScrollBar, checkBox, radioBox},
    // model: {
    //
    // },
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
    // methods : {
    //   emitValue(val) {
    //     let m = this.value
    //     console.log ('m', m)
    //     this.$emit('input', val)

    //   },
    //   inputHandler(val) {
    //     let m = this.value
    //     console.log ('inputHandler m', m)
    //     this.$emit('input', val)

    //   }
    // }
    // watch: {
    //   value() {
    //     this.$emit('input', this.value)
    //   }
    // }

  }
</script>

<style lang="scss" scoped>
  @import "vnm-select-list";
</style>
