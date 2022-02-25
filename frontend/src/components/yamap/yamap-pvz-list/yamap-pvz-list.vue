<template lang="pug">
  .map-sidebar-panel(ref="sidebarPanel")
    .map-sidebar-title(v-if="title && title.length")
      span {{title}}
    div(ref="scrollPanel")
      client-only(v-if="pvzList && pvzList.length")
        perfect-scrollbar.map-sidebar-scroll(
          ref="ps"
          :options="$options.scrollbarOptions" 
          :style="`height:${scrollbarHeight}`"
          )  
          ul.map-sidebar-list(ref="itemsList")
            li.map-sidebar-item(
              v-for="(pvz, index) in pvzList" 
              :key="pvz.data.code" 
              @click="pvzPreSelect(pvz)"
              :class="{ 'pre-select' : pvzSelected && pvz.data.code === pvzSelected.code }"
              )
              .map-sidebar-item_title {{pvz.data.name}} 
              .map-sidebar-item_text.bold {{pvz.data.addr}}

</template>

<script>
  export default {
    props: {
      pvzList: {
        type: Array,
        default() {return []}
      },
      title: {
        type: String,
        default: ''
      },
      value: {}
    },
    scrollbarOptions: {wheelPropagation: false},
    data() {
      return {
        scrollbarHeight: 'auto'
      }
    },
    computed: {
      pvzSelected: {
        get() {return this.value},
        set(val) {
          this.$emit('input', val)
          this.$emit('marker-select', val)
          }
      },
      // scrollPanelTop() {
      //   return this.$refs.scrollPanel ? this.$refs.scrollPanel.offsetTop : 0
      // },
      // sidebarPanelHeight() {
      //   return this.$refs.sidebarPanel ? this.$refs.sidebarPanel.clientHeight : 0
      // },
      // scrollbarHeight() {
      //   // debugger
      //   // const h = this.$refs.sidebarPanel ? this.$refs.sidebarPanel.clientHeight : 0
      //   // const t = this.$refs.scrollPanel ? this.$refs.scrollPanel.offsetTop : 0
      //   const h = this.sidebarPanelHeight
      //   const t = this.scrollPanelTop
      //   return (h - t) ? `${ h - t }px` : 'auto'
      // }

    },
    mounted() {
      this.$nextTick(this.$forceUpdate())
      const h = this.$refs.sidebarPanel.clientHeight
      const t = this.$refs.scrollPanel ? this.$refs.scrollPanel.offsetTop : 0
      this.scrollbarHeight = `${ h - t }px`
      this.$nextTick( function() {
        // debugger
        const li = !!this.$refs.itemsList ? this.$refs.itemsList.querySelector('.pre-select') : false
        // const li = this.$refs.ps.querySelector('.pre-select')  
        if (li) {
          this.$refs.ps.$el.scrollTop = li.offsetTop
        }
        })
    },
    methods: {
      pvzPreSelect(val) {
        this.pvzSelected = {code: val.data.code, name: val.data.name }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>