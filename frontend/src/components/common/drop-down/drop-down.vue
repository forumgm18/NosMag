<template lang="pug">
  .drop-down(
    :class="{open : selectOpen}"
    @click.stop="openToggle"
    ref="fs"
    :data-root-id="`fs-${this.id}`"
    )
    .drop-down_title
      .drop-down_title-text
        slot(name="dropdown-title")
          span.text(v-if="title") {{title}}
      .drop-down_arrow

    .drop-down_list(
      ref="fsList" 
      @click.stop
      :class="{open : selectOpen, listClasses}"
      )
      .drop-down_list-title(ref="dropdownListTitle")
        slot(name="dropdown-list-title" )
      div(:class="scrollbarClasses" ref="scrollbarParent" )  
        scroll-bar.drop-down_scroll(ref="scrollbar")
          slot(name="dropdown-content")

</template>

<script>
  import scrollBar from 'vue2-scrollbar'

  export default {
    name: 'v-dropdown',
    components: { 
      scrollBar, 
      // inputNumber, 
      // vnmSelectList
    },
    props: {
      title: String,  //
      id:{
        type: [String, Number],
        default: function() {return this.$generateUUID }
      },
      listClasses: {
        type: String,
        default: ''
      },
      scrollbarClasses: {
        type: String,
        default: ''
      },
      multiple: {
        type: Boolean,
        default: false
      },
      selectOpen: {
        type: Boolean,
        default: false
      },
      inFixedBlock: {
        type: Boolean,
        default: false
      },

    },
    mounted(){
      if (this.inFixedBlock) document.body.append(this.$refs.fsList)
      this.showFilterList() // Вычисляем позицию dropdownList
    },
    methods: {
      hideSelect(e) {
        // if (this.multiple) {
          const rootNode = `[data-root-id=fs-${this.id}]`
          if(e.target.closest(rootNode)) return
        // }
        // debugger
        // this.selectOpen = false
        this.$emit('dropdown-open', false)
      },
      openToggle() {
        // this.selectOpen = !this.selectOpen
        this.$emit('dropdown-open', !this.selectOpen)
        if (this.selectOpen) { // если dropdown открывается
          this.showFilterList() // Вычисляем позицию dropdownList
          this.setScrollBarContainerHeight() // Устанавливаем высоту dropdownList
        }

      },
      showFilterList() {
        const parentBox = this.$refs.fs.getBoundingClientRect()
        const left = parentBox.x
        const top = parentBox.y + parentBox.height
        // debugger
        this.$refs.fsList.style.position = 'fixed'
        this.$refs.fsList.style.left = `${left}px`
        this.$refs.fsList.style.top = `${top}px`
      },
      setScrollBarContainerHeight() {
        // вычисляем стили для dropdownList
        const fslStyles = getComputedStyle(this.$refs.fsList)
        // сохраняем значение прозрачности
        let opacity = fslStyles.opacity
        // Для удобства создаем псевдоним для dropdownList.syles
        const fslStyle = this.$refs.fsList.style
        // скрыто "показываем" dropdownList
        fslStyle.opacity = 0
        fslStyle.display = 'block'
        // генерируем событие прокрутки колеса мыши
        let wheelEvent = new WheelEvent('wheel', {deltaY: -1});
        // принудительно диспатчим событие прокрутки колеса мыши для scroll-bar
        // это нужно для того чтобы пересчитались высота и ширина ScrollArea
        this.$refs.scrollbar.$refs.scrollArea.dispatchEvent(wheelEvent)
        // Получаем высоту ScrollArea
        const sh = this.$refs.scrollbar.scrollAreaHeight
        // Вычисляем высоту внутренних отступов dropdownList
        const fslPaddings = parseInt(fslStyles.paddingTop, 10) + parseInt(fslStyles.paddingBottom, 10)
        // Вычисляем высоту оставшегося место для контейнера scroll-bar
        let sbH = this.$refs.fsList.clientHeight - this.$refs.dropdownListTitle.offsetHeight - fslPaddings
        // устанавливаем высоту контейнера scroll-bar
        this.$refs.scrollbarParent.style.height = sbH < sh ?  `${sbH}px` : ''
        // console.log('scrollAreaHeight: ', sh)
        // скрываем dropdownList
        fslStyle.display = ''
        fslStyle.opacity = opacity

      },

      winScroll() { if (this.selectOpen) this.showFilterList() },

    },
    beforeMount () {
      if (process.client){ 
        window.addEventListener('scroll', this.winScroll)
        document.addEventListener('click', this.hideSelect, true)
      }
    },
    beforeDestroy() {
      if (process.client) {
        window.removeEventListener('scroll', this.winScroll)
        document.removeEventListener('click', this.hideSelect)
      }
      if (this.inFixedBlock) this.$refs.fsList.remove()
    },

  }
</script>

<style lang="scss">
  @import 'drop-down';
</style>
