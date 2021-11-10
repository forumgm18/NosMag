<template lang="pug">
  .vnm-select(
    :class="{open : selectOpen, 'is-selected': selectItems.length}"
    @click="openToggle"
    data-filter-vnm-select
    )
    .vnm-select_title
      .vnm-select_title-text
        slot(name="title") {{title}}
        span.vnm-select_title-count(v-if="settings.titleCount && selectItems.length") : {{selectItems.length}}
      .vnm-select_arrow(@click="clearSelection" )
    .vnm-select_list-close(@click.stop="vnmClose")
    .vnm-select_list(data-vnm-select-item-list @click.stop="" :class="{'set-max-height' : options.length > 9}")
      scroll-bar.vnm-select_list-scroll(v-if="contentType==='list'")
        .vnm-select_list-scroll-body
          .vnm-option_item(
            v-for="opt1 in options"
            :key="opt1.id"
            v-model="selectItems"
            :val="opt1.id"
            @click="optionClick"
            :data-option-item="opt1.id"
            :class="{selected: selectItems.includes(opt1.id.toString())}"
            )
            slot(name="option" v-bind:opt="opt1") {{opt1.name}}
            //slot(name="option") {{opt.name}}

      .filter-price-block(v-else)
        slot(name="price" v-bind:pr="options")

</template>

<script>
import ScrollBar from 'vue2-scrollbar'
export default {
  name: 'vnm-select',
  components: { ScrollBar },
  props: {
    settings: {
      type: Object,
      required: false,
      validator: function (value) {
        const res = 'multiple' in value ? value : { ...value, multiple: false}
        // console.log('settings res', res)
        return res
      },
      default: {
        multiple: false
      }
    },
    options: [Array, Object], // массив элементов select
    title: String,  //
    id: {},                   // id фильтра (если есть)
    contentType: {
      type: String,
      default: 'list'
    },
    isSelectedColor: {
      type: String,
      required: false,
      default: 'var(--text-color-default)'
    }
  },
  data: () => ({
    selectOpen: false,
    selectItems: [],
    // prices:{
    //   active_min: 0,
    //   active_max:0
    // }
  }),
  mounted() {
    //this.vnm-selectOpen = this.isOpen
    if (this.contentType === 'list') {
      this.options.forEach(el => {
        if (el.active) this.selectItems.push(el.id.toString())
      })
    }
    // if (this.contentType === 'price') {
    //   this.prices.active_min = this.options.active_min
    //   this.prices.active_max = this.options.active_max
    // }

  },
  methods: {
    openToggle(event) {
      this.selectOpen = !this.selectOpen
      const parent = event.target.closest('[data-filter-vnm-select]')
      this.showFilterList(parent)
    },
    vnmClose() {
      this.selectOpen = false
    },

    showFilterList(parent) {
      if (!parent) return
      const parentBox = parent.getBoundingClientRect()
      const left = parentBox.x
      const top = parentBox.y + parentBox.height
      const filterList = parent.querySelector('[data-vnm-select-item-list]')
      if (!filterList) return
      filterList.style.position = 'fixed'
      filterList.style.left = `${left}px`
      filterList.style.top = `${top}px`

    },
    clearSelection(e) {
      console.log('e', e)
      if (this.selectItems.length) {
        // e.preventDefault()
        e.stopPropagation()
        this.selectItems = []
        this.selectOpen = false

      }
    },

    optionClick(event) {
      const currentItem = event.target.closest('[data-option-item]')
      // console.log('currentItem', currentItem)
      const currentItemVal = currentItem.dataset.optionItem
      if (currentItem) {
        this.addOptionSelection(currentItemVal)
      }

    },

    addOptionSelection(v) {
      if (this.settings.multiple) { // если режим мультивыбора
        !this.selectItems.includes(v) ? this.selectItems.push(v) : this.selectItems.splice(this.selectItems.indexOf(v), 1)
      } else { // если режим одиночного выбора
        this.selectItems.includes(v) ? this.selectItems = [] : this.selectItems = [v]
      }
    },
    winScroll() {
      const openedFilters = document.querySelectorAll('[data-filter-vnm-select].open')
      openedFilters && openedFilters.forEach(el => this.showFilterList(el))
    },

  },
  beforeMount () {
    if (process.client) window.addEventListener('scroll', this.winScroll)
  },
  beforeDestroy() {
    if (process.client) window.removeEventListener('scroll', this.winScroll)
  },



  watch: {
    selectItems() {
      this.$emit('input', {id: this.id, values: this.selectItems})
    },
    prices() {
      this.$emit('input', {id: this.id, values: this.prices})
    }
  },

}
</script>

<style lang="scss">
@import 'vnm-select';
</style>
