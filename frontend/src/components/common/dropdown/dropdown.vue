<template lang="pug">
  .dropdown(
    :class="{open : selectOpen, 'is-selected': isSelected }"
    @click.stop="openToggle"
    ref="fs"
    :data-root-id="`fs-${this.id}`"
    )
    .dropdown_title
      .dropdown_title-text
        slot(name="title")
          span.text {{title}}
      .dropdown_arrow(@click.stop="clearSelection" )
    .dropdown_list(ref="fsList" @click.stop="" :class="listClasses")
      slot(name="content")

</template>

<script>
  // import ScrollBar from 'vue2-scrollbar'
  // import inputNumber from '~/components/forms/input-number/input-number'
  // import vnmSelectList from '~/components/forms/vnm-select-list/vnm-select-list'

  export default {
    name: 'v-dropdown',
    // components: { ScrollBar, inputNumber, vnmSelectList},
    props: {
      title: String,  //
      id:{
        type: [String, Number],
        default: function() {return this.$generateUUID() }
      },
      listClasses: {
        type: String,
        default: ''
      },
      isSelected:{},
      multiple: {
        type: Boolean,
        default: false
      }


    },
    data: () => ({
      selectOpen: false,
    }),
    mounted() {
      
      document.addEventListener('click', this.hideSelect, true)
    },
    methods: {
      hideSelect(e) {
        if (this.multiple) {
          const rootNode = `[data-root-id=fs-${this.id}]`
          if(e.target.closest(rootNode)) return
        }
        // debugger
        // console.log(`[data-root-id=fs-${this.id}]`)
        this.selectOpen = false
      },
      openToggle() {
        this.selectOpen = !this.selectOpen
        this.showFilterList()
      },
      showFilterList() {
        const parentBox = this.$refs.fs.getBoundingClientRect()
        const left = parentBox.x
        const top = parentBox.y + parentBox.height

        this.$refs.fsList.style.position = 'fixed'
        this.$refs.fsList.style.left = `${left}px`
        this.$refs.fsList.style.top = `${top}px`
        this.$refs.fsList.style.minWidth = `${parentBox.width}px`

      },
      clearSelection(e) {
        // this.selectOpen = false
        if (this.isSelected) {
          this.$emit('clear-all', true)
        } else { this.openToggle()}
      },

      winScroll() { if (this.selectOpen) this.showFilterList() },

    },
    beforeMount () {
      if (process.client) window.addEventListener('scroll', this.winScroll)
    },
    beforeDestroy() {
      if (process.client) {
        window.removeEventListener('scroll', this.winScroll)
        document.removeEventListener('click', this.hideSelect)
      }
    },

  }
</script>

<style lang="scss">
  @import 'dropdown';
</style>
