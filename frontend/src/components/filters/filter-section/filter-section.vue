<template lang="pug">
  .filter-section(
    :class="{open : sectionOpen, 'is-selected': selectItems.length}"
    @click="openToggle"
    data-filter-section
    )
    .filter-section_title
      span.text
        slot
      span.filter-arrow(@click="clearSelection" )
    .filter-item_list(data-filter-item-list)
      scroll-bar.filter-item_list-scroll
        .filter-item_list-scroll-body
          checkbox.filter-item(
            v-for="item in items"
            :key="item.id"
            v-model="selectItems"
            :val="item.id"
            ) {{item.name}}

</template>

<script>
import Checkbox from '~/components/common/forms/checkbox/checkbox'
import ScrollBar from 'vue2-scrollbar'
export default {
  name: 'FilterSection',
  components: { Checkbox, ScrollBar },
  props: {
    id: {},
    items: { type: Array },
    title: { type: String },
    isOpen: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data: () => ({
    sectionOpen: false,
    selectItems: []
  }),
  mounted() {
    //this.sectionOpen = this.isOpen
  },
  methods: {
    openToggle(event) {
      this.sectionOpen = !this.sectionOpen
      const parent = event.target.closest('[data-filter-section]')
      this.showFilterList(parent)
    },

    showFilterList(parent) {
      if (!parent) return
      const parentBox = parent.getBoundingClientRect()
      const left = parentBox.x
      const top = parentBox.y + parentBox.height
      const filterList = parent.querySelector('[data-filter-item-list]')
      if (!filterList) return
      filterList.style.position = 'fixed'
      filterList.style.left = `${left}px`
      filterList.style.top = `${top}px`

    },
    winScroll () {
      const openedFilters = document.querySelectorAll('[data-filter-section].open')
      openedFilters && openedFilters.forEach(el => this.showFilterList(el))
    },
    clearSelection(e) {
      console.log('e', e)
      if(this.selectItems.length)  {
        // e.preventDefault()
        e.stopPropagation()
        this.selectItems = []
        this.sectionOpen = false

      }
    }

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
    }
  },

  computed: {
    selectItems1: {
      get() {
        return this.value
      },
      set(val) {
        // debugger
        this.selectItems.push(val)
        this.$emit('input', this.selectItems)
      },
    },
  },


}
</script>

<style lang="scss">
@import 'styles';
</style>
