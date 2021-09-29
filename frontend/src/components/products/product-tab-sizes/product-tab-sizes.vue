<template lang="pug">
  .psz-table-block(v-if="sizes && selectedSize" )
    .psz-table-title {{tabTitle}}
    drop-down.psz-table(
      ref="sizesTableNode" 
      scrollbar-classes="psz-table-scroll",
      :select-open="pszOpen"
      :in-fixed-block="inFixedBlock"
      @dropdown-open="dropdownOpen"
      )
      template(v-if="selectedSize"  #dropdown-title)
        span {{selectedSize.name}}
        
      template(#dropdown-list-title)
        .psz-table-content-title
          .psz-item.title
            .col {{selectedSize.table[0].name}}
            .col {{selectedSize.table[1].name}}
      
      template(#dropdown-content)
        .psz-table-content(ref="pszTc")
          .psz-item(
            v-for="(item, index) in sizes" :key="index"
            :class="{'in-stock' : item.active && item.ostatok > 0, active: item === selectedSize }"
            @click="selectSize(item, item.active && item.ostatok > 0)"
            ) 
            .col {{item.table[0].value}}
            .col {{item.table[1].value}}

</template>

<script>
  import dropDown from '@/components/common/drop-down/drop-down'
  export default {
    name: 'product-tab-sizes',
    components : {dropDown},
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
      inFixedBlock: {
        type: Boolean,
        default: false
      },

    },
  data: function () {
    return {
      pszOpen: false
    }  
  },

    mounted() {
      this.$nextTick( this.$forceUpdate )
    },
    methods: {
      selectSize(v, toggle) {
        this.$emit('select-size',{value: v, toggle})
        this.pszOpen = false
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
      dropdownOpen(v) {
        this.pszOpen = v
      }
    },
    
  }
</script>

<style lang="scss" >
@import 'product-tab-sizes'
</style>  