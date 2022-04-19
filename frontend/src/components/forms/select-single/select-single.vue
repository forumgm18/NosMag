<template lang="pug">
  v-dropdown.select-single(
    placement="bottom-start"
    :shown.sync="isOpen"
    :distance="0"
    ref="refSS"
    auto-min-size
    popper-class="popper-container"
    )
    .select-single-field
      input.select-single-input(
        ref="ssInput"
        type="text"
        v-model="searchStr"
        :placeholder="placeholder"
        :class="{ focus: isFocused }"
        @focus="inputFocused"
        @blur="inputBlur"
        @keydown="inputKeyDown"
      )
      .select-single-field-arrow(:class="{ open: isOpen }") 
        slot(name="arrow")
          svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>
      
    template(#popper )
      .select-single-popper
        client-only
          perfect-scrollbar.select-single-options-list(v-if="options" :key="searchStr")    
            ul.select-single-options(ref="optionList" tabindex="-1")
              li.select-single-options-item(
                v-close-popper
                v-for="(opt, index) in options" 
                :key="index"
                :tabindex="index"
                @click="optionSelected(opt)"
                @keydown.prevent="optionListKeyDown($event, opt)"
              ) 
                slot(name="dd-option-item")
                  span(v-if="optionKey && optionKey.length" v-html="$searchHighlight(searchStr, opt[optionKey])")

</template>

<script>
  export default {
    props: {
      options: {
        type: Array,
        default() {return null} 
      },
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

      value: {}


    },
    data() {
      return {
        searchStr: '',
        isFocused: false,
        isOpen: false,
        refSS: ''
      }
    },
    created(){
      this.refSS = `ss-${this.$generateUUID()}`
    },
    computed: {
      boundary() { return `[data-ref-ss="${this.refSS}"]` }
    },
    methods: {
      inputKeyDown(e) {
        // if( !this.cityInputOpened) this.cityInputOpened = true
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          // console.log('inputKeyDown', this.$refs.cityList)
          if (this.$refs.optionList.childNodes && this.$refs.optionList.childNodes.length) {
            this.$refs.optionList.childNodes[0].focus()
            this.$refs.optionList.childNodes[0].classList.add('focus')
          } 
          // if (!this.cityInputOpened) this.cityInputOpened = true
        }
      },
      optionListKeyDown(e, val){
        let el = e.target
        switch(e.key) {
          case 'ArrowDown':
            if ( el.nextSibling ) {
              el.classList.remove('focus')
              el.nextSibling.focus()
              el.nextSibling.classList.add('focus')
            }  
            break
          case 'ArrowUp' :  
            if ( el.previousSibling ) {
              el.classList.remove('focus')
              el.previousSibling.focus()
              el.previousSibling.classList.add('focus')
            } else {
              this.$refs.ssInput.focus()
              this.$refs.ssInput.selectionStart = this.$refs.ssInput.value.length
            } 
          break
          case 'Enter' :  
            this.optionSelected(val)
            // this.cityInputOpened = false
          break

        }
        // console.log('cityListKeyDown', e)
      },

      inputFocused() { 
        this.isFocused = true
        this.searchStr = ''
        // this.cityInputOpened = true
        },
      inputBlur() { this.isFocused = false },
      optionSelected(val) {
        this.$emit('input', val)
        this.isOpen = false
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