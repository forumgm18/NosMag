<template lang="pug">
  .map-sidebar-panel(ref="sidebarPanel")
    .map-sidebar-title(v-if="title && title.length")
      span {{title}}
      resize-observer(@notify="titleResize")      
    div(ref="scrollPanel" data-scroll-panel)
      client-only
        perfect-scrollbar.map-sidebar-scroll(
          v-if="pvzList && pvzList.length"
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
import { ResizeObserver } from 'vue-resize'
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
      // isVisible: {
      //   type: Boolean,
      //   default: false
      // },
      value: {}
    },
    components: {ResizeObserver},
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
    },
    mounted() {
      // this.$nextTick(this.$forceUpdate())
      this.$nextTick( function() {
        this.$forceUpdate()
        const li = !!this.$refs.itemsList ? this.$refs.itemsList.querySelector('.pre-select') : false
        if (li) {
          this.$refs.ps.$el.scrollTop = li.offsetTop
        }
        })
    },
    methods: {
      pvzPreSelect(val) {
        this.pvzSelected = {code: val.data.code, name: val.data.name }
      },
      titleResize({ height }){
        this.scrollbarHeight = this.$refs.sidebarPanel.clientHeight - height + 'px'
      }
    },
  }
</script>

<style lang="scss" scoped>
  .map-sidebar-title{position: relative;}
</style>