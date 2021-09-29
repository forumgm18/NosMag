<template lang="pug">
  .product-sizes-table-block(v-if="sizes" :class="{ 'in-quisk-view' : quiskView }")
    .product-sizes-table-title {{tabTitle}}
    .product-sizes-table(ref="sizesTableNode" )
      .product-sizes-item(
        v-for="(item, index) in sizes" :key="index"
        :class="{'in-stock' : item.active && item.ostatok > 0, active: item === selectedSize }"
        :title="tabSizesDetail(item, 1, 'all')"
        @click="selectSize(item, item.active && item.ostatok > 0)"
        ) {{tabSizesDetail(item, 0, 'value')}}

</template>

<script>
  // import dropDown from '@/components/common/drop-down/drop-down'
  export default {
    name: 'product-tab-sizes',
    // components : {dropDown},
    props: {
      sizes: {
        type: [Array, Object],
        default: null
      },
      tabTitle: {
        type: String,
        default: 'Таблица размеров'
      },
      selectedSize: {
        type: Object,
        default: null
      },
      quiskView: {
        type: Boolean,
        default: false
      },

    },
    beforeMount () {
      if (process.client) window.addEventListener('resize', this.sizesTableStyle)
    },
    beforeDestroy() {
      if (process.client) window.removeEventListener('resize', this.sizesTableStyle)
    },

    mounted() {
      this.$nextTick( this.$forceUpdate )
      this.sizesTableStyle()
    },
    methods: {
      selectSize(v, toggle) {
        this.$emit('select-size',{value: v, toggle})
      },

      tabSizesDetail(item, ind, field) {
        // field - Имя поля или 'all' если нужно вернуть все поля
        let res = ''
        // debugger
        if (item.table && item.table.length >= ind + 1) {
          let tabItem = item.table[ind]
          if (field === 'all') {
            res = Object.keys(tabItem).reduce((s, current) => s + tabItem[current] + ' ', '')
          } else {
            res = tabItem[field]
          }
        } else {
          res = item.name
        }
        return res
      },
      sizesTableStyle() {
      // Вычисляет макс. ширину "Таблицы размеров" чтобы элементы разместились в 2 ряда 
      if (this.$refs.sizesTableNode) {
        const tabItems = this.$refs.sizesTableNode.children
        let w1 = 0, w2 = 0
        // if (tabItems && window.innerWidth > 576) {
        if (tabItems && document.body.clientWidth > 767) {
          const l = Math.ceil(tabItems.length /2)
          // const l = Math.max(Math.ceil(tabItems.length /2), 4)
          let style, margin, i
          for (i = 0; i < l; i++ ) {
            style = window.getComputedStyle(tabItems[i])
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
            w1 += tabItems[i].offsetWidth + margin
          }
          // w1 += 10
          for (let j = i; j < tabItems.length; j++ ) {
            style = window.getComputedStyle(tabItems[j])
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
            w2 += tabItems[j].offsetWidth + margin
          }
          // w2 += 10
          // debugger
          this.$refs.sizesTableNode.style.width = `${Math.max(w1,w2) + 5}px`
          // return `width:${Math.max(w1,w2)}px`
        } else {
          this.$refs.sizesTableNode.style.width = 'initial'
          // return ''
        }
      }

    },

    },
    
  }
</script>

<style lang="scss" scoped>
@import 'product-tab-sizes'
</style>  