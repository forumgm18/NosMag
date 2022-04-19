<template lang="pug">
  v-dropdown.select-single(
    placement="bottom-start"
    :shown.sync="isOpen"
    :distance="0"
    auto-min-size
    popper-class="popper-container"
    :triggers="[]"
    auto-hide
    handleResize
    @auto-hide="autoHide"
    )
    .select-single-field
      input.select-single-input(
        ref="ssInput"
        type="text"
        v-model="searchStr"
        :placeholder="placeholder"
        :class="{ focus: isFocused }"
        @click="isOpen=!isOpen"
        @focus="inputFocused"
        @blur="inputBlur"
        @keydown.down.stop.prevent="keyDown"
        @keydown.esc.stop.prevent="isOpen=false"
      )
      .select-single-field-arrow(:class="{ open: isOpen }") 
        slot(name="arrow")
          svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
      
    template(#popper )
      v-city-search(
        ref="searchResult"
        :search-str="searchStr" 
        :min-serch-length="minSerchLength"
        :show-key="optionKey"
        v-model="locModel"
        list-class="select-single-options"
        list-item-class="select-single-options-item"
        list-scroll-class="select-single-options-list"
        list-item-focus-class="focus"
        :tab-index="2"
        @item-select="isOpen = false"
        @first-up="$refs.ssInput.focus()"
        )

</template>

<script>
  export default {
    name:'v-select-single-2',
    props: {
      optionKey:{
        type: String,
        default: ''
      },
      placeholder:{
        type: String,
        default: ''
      },
      searchString:{
        type: String,
        default: ''
      },
      minSerchLength: {
        type: Number,
        default: 3
      },

      value: {},


    },
    data() {
      return {
        searchStr: '',
        isFocused: false,
        isOpen: false,
      }
    },
    computed: {
      locModel: { 
        get() {return this.value},
        set(val) {
          this.$emit('input', val)
          this.isOpen = false
        },
      }

    },
    methods: {
      keyDown(){
        if (!this.isOpen ) this.isOpen = true
        if (this.$refs.searchResult) {
          const list = this.$refs.searchResult.$refs.list
          if (list && list.firstChild) {
            list.firstChild.focus()
          }
        }
      },

      inputFocused() { 
        this.isFocused = true
        this.searchStr = ''
        },
      inputBlur() { this.isFocused = false },
      autoHide() {
        this.isOpen = false
        // this.searchStr = this.locModel[this.optionKey]
        this.searchStr = this.locModel.name
      },
    },
    watch: {
      searchString(val) {this.searchStr = this.searchString},
      searchStr(val) {
        this.$emit('update:searchString', val)
        }
    }
}
</script>

<style lang="scss" >
  @import "select-single.scss";
</style>