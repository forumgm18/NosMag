<template lang="pug">
  .select-single-list
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
    name:'v-select-single-list',
    props: {
      options: {
        type: Array,
        default() {return null} 
      },
      optionKey:{
        type: String,
        default: ''
      },
      searchStr:{
        type: String,
        default: ''
      },
      keyDown:{
        type: String,
        default: ''
      },


      value: {}


    },
    data() {
      return {
      }
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

      optionSelected(val) {
        this.$emit('input', val)
      },
    },
    watch: {
      keyDown(key) {
        if (key === 'ArrowDown') {
          if (this.$refs.optionList.childNodes && this.$refs.optionList.childNodes.length) {
            this.$refs.optionList.childNodes[0].focus()
            this.$refs.optionList.childNodes[0].classList.add('focus')
          } 

        }
      }
    }
    
  }
</script>

<style lang="scss">

</style>