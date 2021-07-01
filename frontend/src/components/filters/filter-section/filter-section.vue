<template lang="pug">
  .filter-section(:class="{open : sectionOpen}" @click="openToggle")
    .filter-section_title
      span.text
        slot
      span.filter-arrow
    .filter-item_list
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
    openToggle() { this.sectionOpen = !this.sectionOpen }
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
