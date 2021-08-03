<template lang="pug">
  .filter-select(
    :class="{open : selectOpen, 'is-selected': isSelected }"
    @click="openToggle"
    ref="fs"
    :data-root-id="`fs-${this.id || this.$generateUUID}`"
  )
    .filter-select_title
      .filter-select_title-text
        slot(name="title")
          span.text {{title}}
        span.filter-select_title-count(v-if="settings.titleCount && selectItems.length") : {{selectItems.length}}
      .filter-select_arrow(@click.stop="clearSelection" )
    .filter-select_list(ref="fsList" @click.stop="" :class="{'set-max-height' : options.length > 9}")
      //scroll-bar.filter-select_list-scroll(v-if="contentType==='list'")
        .filter-select_list-scroll-body
          .filter-option_item(            v-for="opt1 in options"            :key="opt1.id"            v-model="selectItems"            :val="opt1.id"            @click="addOptionSelection(opt1.id)"            :class="{selected: selectItems.includes(opt1.id)}"          )
            slot(name="option" v-bind:opt="opt1") {{opt1.name}}
      vnm-select-list(v-if="contentType==='list'" :options="options" v-model="selectItems")
        //slot(name="optionLabel" v-bind:opt="options") {{opt.name}}
      .filter-price-block(v-else)
        slot(name="price" v-bind:pr="options")
          input-number.price-filter(
            :id="id"
            :has-label="true"
            :min="options.min"
            :max="options.max"
            :step="100"
            v-model="prices.active_min"
            :val="options.min"
            name="price-do"
            label="от"
            border-color="currentColor"
            style="margin-right: 10px;"

           )
          input-number.price-filter(
            :id="id"
            name="price-ot"
            label="до"
            :has-label="true"
            :min="options.min"
            :max="options.max"
            :step="100"
            :val="options.max"
            v-model="prices.active_max"
            border-color="currentColor"

          )

</template>

<script>
  import ScrollBar from 'vue2-scrollbar'
  import inputNumber from '~/components/common/forms/input-number/input-number'
  import vnmSelectList from '~/components/common/forms/vnm-select-list/vnm-select-list'

  export default {
    name: 'filter-select',
    components: { ScrollBar, inputNumber, vnmSelectList},
    props: {
      settings: {
        type: Object,
        required: false,
        validator: function (value) {
          const res = 'multiple' in value ? value : { ...value, multiple: false}
          // console.log('settings res', res)
          return res
        },
        default: {
          multiple: false
        }
      },
      options: [Array, Object], // массив элементов select
      title: String,  //
      id: {},                   // id фильтра (если есть)
      contentType: {
        type: String,
        default: 'list'
      },
      isSelectedColor: {
        type: String,
        required: false,
        default: 'var(--text-color-default)'
      }
    },
    data: () => ({
      selectOpen: false,
      selectItems: [],
      pricesIsModifed:{
        min: false,
        max: false
      },
      prices:{
        active_min: 0,
        active_max:0
      }
    }),
    mounted() {
      // if (this.contentType === 'list') {
      //   this.options.forEach(el => {
      //     if (el.active) this.selectItems.push(el.id.toString())
      //   })
      // }
      document.addEventListener('click', this.hideSelect.bind(this), true)
      this.clearPrice()
    },
    computed: {
      priceModifed() {
        if (this.contentType != 'price') return false
        return this.pricesIsModifed.min || this.pricesIsModifed.max
      },
      isSelected() {
        const isSel = this.selectItems.length > 0
        // console.log('isSel: ', isSel)
        return  isSel || this.priceModifed
      }
    },
    methods: {
      hideSelect(e) {
        // console.log('hideSelect: ', e)
        const rootNode = `[data-root-id=fs-${this.id || this.$generateUUID}]`
        if(e.target.closest(rootNode)) return
        this.selectOpen = false
      },
      openToggle() {
        this.selectOpen = !this.selectOpen
        this.showFilterList()
      },
      showFilterList() {
        const parentBox = this.$refs.fs.getBoundingClientRect()
        const left = parentBox.x
        const top = parentBox.y + parentBox.height

        this.$refs.fsList.style.position = 'fixed'
        this.$refs.fsList.style.left = `${left}px`
        this.$refs.fsList.style.top = `${top}px`

      },
      clearPrice() {
        if (this.contentType === 'price') {
          this.prices.active_min = this.options.min
          this.prices.active_max = this.options.max
          this.pricesIsModifed.min = false
          this.pricesIsModifed.max = false

        }

      },
      clearSelection(e) {
        if (this.contentType === 'list') this.selectItems = []
        if (this.contentType === 'price') this.clearPrice()
        this.selectOpen = false
        // this.$emit('input', {id: this.id, values: this.selectItems, clear: true})
      },

      addOptionSelection(v) {
        if (this.settings.multiple) { // если режим мультивыбора
          !this.selectItems.includes(v) ? this.selectItems.push(v) : this.selectItems.splice(this.selectItems.indexOf(v), 1)
        } else { // если режим одиночного выбора
          this.selectItems.includes(v) ? this.selectItems = [] : this.selectItems = [v]
        }
      },
      changeFilterPrice(v){
        // return
        // console.log('filter-select changeFilterPrice: ', v)
        if (v.name === "price-ot") {
          this.prices.active_min = v.val
          this.pricesIsModifed.min = v.isModified || false
        }
        if (v.name === "price-do") {
          this.prices.active_max = v.val
          this.pricesIsModifed.max = v.isModified || false
        }
        this.$emit('input', {id: this.id, values: this.prices, contentType: this.contentType})
      },

      winScroll() { if (this.selectOpen) this.showFilterList() },

    },
    beforeMount () {
      if (process.client) window.addEventListener('scroll', this.winScroll)
    },
    beforeDestroy() {
      if (process.client) window.removeEventListener('scroll', this.winScroll)
      document.removeEventListener('click', this.hideSelect)
    },



    watch: {
      selectItems() {
        this.$emit('input', {id: this.id, values: this.selectItems, contentType: this.contentType})
      },
      // prices() {
      //   this.$emit('input', {id: this.id, values: this.prices, contentType: this.contentType})
      // }
    },

  }
</script>

<style lang="scss">
  @import 'filter-select';
</style>
