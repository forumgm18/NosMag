<template lang="pug">
  .filter-section(:class="{open : sectionOpen}" @click="openToggle")
    .filter-section_title
      slot
    .filter-item_list
      filter-checkbox-item(
        v-for="item in items"
        :key="item.id"
        v-model="selectItems"
        :val="item.id"
        ) {{item.name}}

</template>

<script>
import FilterCheckboxItem from '~/components/filters/filter-checkbox-item'
export default {
  name: 'FilterSection',
  components: { FilterCheckboxItem },
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
    this.sectionOpen = this.isOpen
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

<style scoped>

</style>
