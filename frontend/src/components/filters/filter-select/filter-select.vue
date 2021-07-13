<template lang="pug">
  .filter-select(
    :class="{open : selectOpen, 'is-selected': selectItems.length}"
    @click="openToggle"
    data-filter-select
    )
    .filter-select_title
      span.text
        slot
      span.filter-arrow(@click="clearSelection" )
    .filter-item_list-close(@click.stop="filterClose")
    .filter-item_list(data-filter-item-list @click.stop="")
      scroll-bar.filter-item_list-scroll
        .filter-item_list-scroll-body
          checkbox.filter-item(
            v-for="item in items"
            :key="item.id"
            v-model="selectItems"
            :val="item.id"
            )
            span.filter-item_color(v-if="item.code")
              span.filter-item_color-code(:style="`background-color: ${item.code}`")
              span.filter-item_text {{item.name}}
            span.filter-item_text(v-else) {{item.name}}

</template>

<script>
import Checkbox from '~/components/common/forms/checkbox/checkbox'
import ScrollBar from 'vue2-scrollbar'
export default {
  name: 'Filterselect',
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
    selectOpen: false,
    selectItems: []
  }),
  mounted() {
    //this.selectOpen = this.isOpen
  },
  methods: {
    openToggle(event) {
      this.selectOpen = !this.selectOpen
      const parent = event.target.closest('[data-filter-select]')
      this.showFilterList(parent)
    },
    filterClose() {
      this.selectOpen = false
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
      const openedFilters = document.querySelectorAll('[data-filter-select].open')
      openedFilters && openedFilters.forEach(el => this.showFilterList(el))
    },
    clearSelection(e) {
      console.log('e', e)
      if(this.selectItems.length)  {
        // e.preventDefault()
        e.stopPropagation()
        this.selectItems = []
        this.selectOpen = false

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
