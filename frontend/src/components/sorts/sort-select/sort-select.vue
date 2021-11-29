<template lang="pug">
  .sort-select(
    :class="{open : selectOpen, 'is-selected': selectItems.length}"
    @click="openToggle"
    data-sort-select
    )
    .sort-select_title
      span.text
        slot
      span.sort-arrow(@click="clearSelection" )
    .sort-item_list-close(@click.stop="sortClose")
    .sort-item_list(data-sort-item-list @click.stop="")
      check-box.sort-item(
        v-for="item in items"
        :key="item.id"
        v-model="selectItems"
        :val="item.id"
        )
        span.sort-item_color(v-if="item.code")
          span.sort-item_color-code(:style="`background-color: ${item.code}`")
          span.sort-item_text {{item.name}}
        span.sort-item_text(v-else) {{item.name}}

</template>

<script>
import checkBox from '~/components/forms/check-box/check-box'
import radioBox from '~/components/forms/radio-box/radio-box'
export default {
  name: 'SortSelect',
  components: { checkBox, radioBox },
  props: {
    id: {},
    items: { type: Array },
    elemType: {
      type: String,
      required: false,
      default: 'radio'
    },
    isOpen: {
      type: Boolean,
      required: false,
      default: false
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
      const parent = event.target.closest('[data-sort-select]')
      this.showsortList(parent)
    },
    sortClose() {
      this.selectOpen = false
    },

    showsortList(parent) {
      if (!parent) return
      const parentBox = parent.getBoundingClientRect()
      const left = parentBox.x
      const top = parentBox.y + parentBox.height
      const sortList = parent.querySelector('[data-sort-item-list]')
      if (!sortList) return
      sortList.style.position = 'fixed'
      sortList.style.left = `${left}px`
      sortList.style.top = `${top}px`

    },
    winScroll () {
      const openedsorts = document.querySelectorAll('[data-sort-select].open')
      openedsorts && openedsorts.forEach(el => this.showsortList(el))
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
