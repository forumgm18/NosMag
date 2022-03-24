<template lang="pug">
  v-dropdown.filter-item.scrollbar-size-2(
    :distance="0"
    placement="bottom-start"
    auto-min-size
    popper-class="filter-item_popper-container"
    :class="{ 'is-selected': locValue && locValue.length}"
    :tabindex="0"
    )
    .filter-item_title(:class="{ 'is-selected': locValue && locValue.length}" :tabindex="1")
      span.text {{name}}
      span.count(v-if="locValue && locValue.length") {{locValue.length}}
      .filter-item_close(
        v-close-popper
        v-if="locValue && locValue.length === 0"
        )
        svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
      .filter-item_close(
        v-else
        @click.stop.prevent="clearAll()"
      )
        svg.icon.icon-btn-close <use href="#icon-btn-close"/>

    template( #popper )
      v-listbox(
        v-if="options && type != $options.FILTER_PRICE"
        ref="listBox"
        :options="options" 
        :select-all.sync="selectAll"
        :has-select-all="true"
        :list-box-height="options && options.length > 9 ? '20em': false"
        v-model="locValue"
        :tabindex="3"
        )
        template(#text="{opt}" ) 
          span.filter-option_item-color(
            v-if="opt.code && (opt.code === 'multicolor' || opt.code === 'bw')"
            :class="{'is-border': opt.border,  multicolor: opt.code === 'multicolor', 'black-white is-border' : opt.code === 'bw'}"
            )
          span.filter-option_item-color( 
            v-else-if="opt.code" 
            :class="{'is-border': opt.border}" 
            :style="`background-color: ${opt.code}`" 
            )
          span.filter-option_item-text {{opt.name}}
          //- span.filter-option_item-text {{opt}}

</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        default() {return null}
      },
      // id:{},
      type:{},
      name:{},
      value: {
        type: Array,
        default() {return null}
      }
    },
    FILTER_LIST: 'list',
    FILTER_PRICE: 'price',
    FILTER_COLOR: 'color',
    data() {
      return {
        selectAll: false,
        selectAllHover: false
      }
    },
    computed: {
      locValue: {
        get(){ return this.value },
        set(val) {
          this.$emit('input', val) 
          }
      }
    },
    methods: {
      clearAll(){ 
        this.locValue = []
        this.selectAll = false
        this.$refs.listBox && this.$refs.listBox.clearAll()
        },
      selectAllMouseEnter(){ this.selectAllHover = true },
      selectAllMouseLeave(){ this.selectAllHover = false },
      keyUpSelectAll() {

      },
      keyDownSelectAll() {

      },
      selectAllSetFocus() {
        // debugger
        console.log('selectAllSetFocus')
        // this.$refs.selectAll.focus()
        this.$refs.selectAllInput.focus()
      }
    }
  }
</script>

<style lang="scss">
  // .filter-item{
  //   &_popper-container{
  //     font-size: 14px;
  //     margin-top: calc(-1*var(--m));
  //     margin-left: calc(-1*var(--m));
  //     .v-popper__inner{      
  //       padding: 1em .3em 1em 1em;    
  //     }
  //   }
  //   &_select-all {
  //     font-size: inherit;
  //     display: flex;
  //     align-items: center;
  //     margin-bottom: .7142857em;
  //     cursor: pointer;
  //     &:hover {
  //       .filter-item_select-all_text {opacity: .6;}
  //     }
  //     &:focus {
  //       .filter-item_select-all_text {
  //         opacity: .6;
  //         // color: red;
  //       }
  //     }

  //     &_icon {
  //       font-size: 1.166667em;
  //       margin-right: .5em;
  //       flex-shrink: 0;

  //     }
  //     &_text{
  //       font-size: inherit;
  //     }
  //   }
  // }


</style>
<style lang="scss" >
@import "filter-item.scss";
</style>
