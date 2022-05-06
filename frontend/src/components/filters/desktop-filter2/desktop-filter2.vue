<template lang="pug">
  .desktop-filter(v-if="filters")
    //- transition-group.desktop-filter-collapse(name="filter-toggle" tag="div" :class="{collapse: filterCollapse}")
    .desktop-filter-collapse(:class="{collapse: filterCollapse}")
      slot(name="sort")

      template(v-for="(f, i) in filters.filter(v => v.type != $options.FILTER_PRICE)")
        v-filter-item(
          :key="i"
          :options="f.values"
          :name="f.name"
          :type="f.type"
          v-model='model[f.id]'
          :tabIndex="i+1"
        )
      slot(name="price")
        

    .desktop-filter-collapse-btn(:class="{collapse: filterCollapse}" @click="filterCollapseToggle")
      svg.icon.icon-arrow-down <use href="#icon-arrow-down"/>

</template>

<script>
  // import InputNumber from '~/components/forms/input-number/input-number'

export default {
    name: 'desktop-filter',
    props: {
      filters: {
        // type: [Array, Object],
        type: Array,
        required: true,
        default() {return null}
      },
      value: {
        type: [Array, Object],
        default: () => {}
        // type: Array,
        // default() {return []}

      }
    },

    // components: { VueSlider,  },
    data: () => ({
      filterCollapse: true,
      filterMaxColumns : 7,
      // model: []
      model: {}
    }),
    FILTER_LIST: 'list',
    FILTER_PRICE: 'price',
    FILTER_COLOR: 'color',
    PRICE_STEP: 100,
    viewPortColumns: [
      { w: 992, col: 3 },
      { w:1200, col: 4 },
      { w:1600, col: 5 },
    ],

    created(){
      // Подготавливаем объект выбранных фильтров и делаем его реактивным
      this.filters.forEach(el => {
        if (el.type!=this.$options.FILTER_PRICE) {
          // this.$set(this.model, `"${el.id}"`, [])
          this.$set(this.model, el.id, [])
        } else {
          // this.$set(this.model, `"${el.id}"`, {active_min : el.values.min, active_max : el.values.max})
          this.$set(this.model, el.id, {active_min : el.values.min, active_max : el.values.max})
        }
      })
      
    },
    beforeMount() {
      if (process.browser) {
        console.log('beforeMounted')
        window.addEventListener('resize', this.setFilterMaxColumns)
      }  
    },
    beforeDestroy() {
      if (process.browser) {
        window.removeEventListener('resize', this.setFilterMaxColumns)
      }  
    },

    mounted(){
      if (process.browser) {
        this.setFilterMaxColumns()  
      }
      if (this.value && this.value.length) this.model = this.value
    },
    computed: {
    //   model: {
    //     get() {
    //       return this.value;
    //     },
    //     set(val) {
    //       // this.$emit('change', val);
    //       this.$emit('input', val);
    //     },
    //   },
      // locValue: {
      //   get(){ return this.value },
      //   set(val) {this.$emit('input', val) }
      // }

    },
    methods: {
      // modelLength(id){
      //   const modelItem = this.model[`${id}`]
      //   if (modelItem && Array.isArray(modelItem) ) return modelItem.length
      //   return 0
      // },
      clearAll(id, type){
        console.log('clearAll id, type', id, type)
        if (type != this.$options.FILTER_PRICE) {
          this.model[id]=[]
        } else {
          const pf = this.filters.find(el => el.type === type )
          this.model[id]={
            active_min: pt.values.min,
            active_max: pt.values.max
            }
        }
      },
      selectContentType(v) {
        if (v === this.$options.FILTER_LIST || v === this.$options.FILTER_COLOR) return this.$options.FILTER_LIST
        if (v === this.$options.FILTER_PRICE) return this.$options.FILTER_PRICE
        return 'block'
      },
      filterCollapseToggle() {this.filterCollapse = !this.filterCollapse},
      setFilterMaxColumns() {
        // const w = document.documentElement.clientWidth
        const w = window.innerWidth
        const res = this.$options.viewPortColumns.find(c => c.w >= w )
        this.filterMaxColumns = res ? res.col : 6
      }
    },
    watch: {
      filterCollapse(val) {
        val ? this.setFilterMaxColumns() : this.filterMaxColumns = Infinity
      },
      model(val){
        console.log('model:', val)

        // this.$emit('change', val);
        this.$emit('input', val);
    
      }
    }

    }
</script>

<style lang="scss">
  .desktop-filter_popper-container {
    .v-popper__inner{
      padding: 1em;
    }
    
  }
</style>
<style lang="scss" scoped>
  @import "desktop-filter";

.filter-toggle-enter-active {
  animation: filter-toggle .1s;
}
.filter-toggle-leave-active {
  animation: filter-toggle .1s reverse;
}
@keyframes filter-toggle {
  0% {
    // transform: scale(0);
    opacity: 0;
    overflow: hidden;
    height: 0;

  }
  25% {
    opacity: .25;
    height: .57em;
  }
  50% {
    opacity: .5;
    height: 1.14em;
  }
  75% {
    opacity: .75;
    height: 1.71em;
  }
  99% {
    opacity: .99;
    height: 2.25em;
  }
  100% {
    opacity: 1;
    overflow: initial;
    height: auto;
  }
}
</style>
