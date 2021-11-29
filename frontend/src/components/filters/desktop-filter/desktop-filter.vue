<template lang="pug">
  .desktop-filter(v-if="filters")
    .desktop-filter-collapse(:class="{collapse: filterCollapse}")
      slot(name="sort")

      v-dropdown(
        v-for="f in filters"
        :key="f.id"
        :id="f.id"
        :title="f.name"
        :multiple="true"
        :is-selected="modelLength(f.id)"
        :class="{'is-price' : selectContentType(f.type)===$options.FILTER_PRICE}"
        @clear-all="clearAll(f.id, selectContentType(f.type))"
        )
        template(#title) 
          span.text {{f.name}}
          span.dropdown_title-count(v-if="modelLength(f.id)") {{modelLength(f.id)}}

        template( #content )
          vnm-select-list(
            v-if="selectContentType(f.type)===$options.FILTER_LIST && f.values"
            :id="f.id"
            :multiple="true"
            item-type='checkbox'
            :options="f.values" 
            :class="{'set-max-height' : f.values.length > 9}"
            v-model="model[`${f.id}`]" 
            )
            template(#optText="{opt}" ) 
              span.filter-option_item-color(v-if="opt.code && (opt.code === 'multicolor' || opt.code === 'bw')"
                :class="{'is-border': opt.border,  multicolor: opt.code === 'multicolor', 'black-white is-border' : opt.code === 'bw'}")
              span.filter-option_item-color( v-else-if="opt.code" :class="{'is-border': opt.border}" :style="`background-color: ${opt.code}`" )
              span.filter-option_item-text {{opt.name}}

              
          .filter-price-block(v-if="selectContentType(f.type)===$options.FILTER_PRICE")
            input-number.price-filter(
              :has-label="true"
              :min="f.values.min"
              :max="f.values.max"
              :step="$options.PRICE_STEP"
              v-model="model[`${f.id}`].active_min"
              :val="f.values.min"
              label="от"
              border-color="currentColor"
              style="margin-right: 10px;"
              )
            input-number.price-filter(
              label="до"
              :has-label="true"
              :min="f.values.min"
              :max="f.values.max"
              :step="$options.PRICE_STEP"
              :val="f.values.max"
              v-model="model[`${f.id}`].active_max"
              border-color="currentColor"
            )

    .desktop-filter-collapse-btn(:class="{collapse: filterCollapse}" @click="filterCollapseToggle")
      svg.icon.icon-arrow-default <use href="#icon-arrow-default"/>




</template>

<script>
  import InputNumber from '~/components/forms/input-number/input-number'
  import vnmSelectList from '~/components/forms/vnm-select-list/vnm-select-list'
  // import vDropdown from '~/components/common/v-dropdown/v-dropdown'

export default {
    name: 'desktop-filter',
    props: {
      filters: {
        type: [Array, Object],
        required: true
      },
      value: {
        type: [Array, Object]
      }
    },

    components: {
      InputNumber,
      vnmSelectList,
      // vDropdown,
    },
    data: () => ({
      filterCollapse: true,
    }),
    FILTER_LIST: 'list',
    FILTER_PRICE: 'price',
    FILTER_COLOR: 'color',
    PRICE_STEP: 100,
    created(){
      // Подготавливаем объект выбранных фильтров и делаем его реактивным
      this.filters.forEach(el => {
        if (el.type!=this.$options.FILTER_PRICE) {
          this.$set(this.model, el.id, [])
        } else {
          this.$set(this.model, el.id, {active_min : el.values.min, active_max : el.values.max})
        }
      });
    },

    computed: {
      model: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('change', val);
        },
      },
    },
    methods: {
      modelLength(id){
        const modelItem = this.model[`${id}`]
        if (modelItem && modelItem instanceof Array ) return modelItem.length
        return 0
      },
      clearAll(id, type){
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
    }

    }
</script>

<style lang="scss" scoped>
 @import "desktop-filter";
</style>
