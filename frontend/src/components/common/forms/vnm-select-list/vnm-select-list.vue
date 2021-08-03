<template lang="pug">
  //.vnm-select-list(ref="fsList" @click.stop="" :class="{'set-max-height' : options.length > 9}")
  .vnm-select-list
    scroll-bar.vnm-select-list_scroll
      .vnm-select-list_scroll-body
        //label.vnm-select-list_item(      v-for="opt in options"          :key="opt.id"        )
          //input(type="checkbox" v-model="model" :value="opt")
          input(type="checkbox" v-model="model" :value="opt.id")
          span {{opt.name}}
        checkbox.vnm-select-list_item(
          v-for="opt in options"
          :key="opt.id"
          v-model="model"
          :value="opt"
        )
          slot(name="optionLabel") {{opt.name}}

</template>

<script>
  import ScrollBar from 'vue2-scrollbar'
  import checkbox from "~/components/common/forms/checkbox/checkbox";

  export default {
    name: 'vnm-select-list',
    components: {ScrollBar, checkbox},
    // model: {
    //
    // },
    props: {
      options: {
        type: [Array, Object]
      },
      value: {
        type: [Array, Object]
      }
    },
    computed: {
      model: {
        get() {
          return this.value;
        },
        set(val) {
          //this.$emit('input', {id: this.id, values: val});
          this.$emit('input', val);
        },
      },

    },
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
