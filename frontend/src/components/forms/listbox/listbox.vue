<template lang="pug">
  div.listbox( ref="listBox" :style="{ maxHeight: lbHeight }" )
    slot(name="select-all")
      label.filter-item_select-all(
        v-if="hasSelectAll"
        ref="selectAll"
        :tabindex="1 + tabIndex"
        :class="{ checked: selectAllLocal }"
        @keydown.down.stop.prevent="listBoxSetFocus"
        @keydown.space.stop.prevent="selectAllLocal = !selectAllLocal"
        @mouseenter="selectAllHover = true"
        @mouseleave="selectAllHover = false"
        @keydown.up.stop.prevent="$emit('update:is-focused', 0)"
        )
        input(type="checkbox" v-model="selectAllLocal" hidden ref="selectAllInput")
        v-icon-check.filter-item_select-all_icon(
                :is-checked="selectAllLocal"
                :is-hover="selectAllHover"
                )
        span.filter-item_select-all_text Выбрать все


    client-only
      perfect-scrollbar.listbox_scroll( 
        v-if="options && options.length"
        :options="scrollbarSettings"
        ref="listBoxScroll" 
        )
        .listbox_scroll-body(
          ref="listBoxScrollBody" 
          
          @keydown.stop.prevent
          )
          label.listbox-item(
            v-for="(opt, i) in listOpt"
            :key="i"
            :tabindex="i + 2 + tabIndex"
            :ref="`lbl${i}`"
            :class="{checked: opt.checked}"
            @mouseenter="mouseEnter(`icon${i}`)"
            @mouseleave="mouseLeave(`icon${i}`)"
            @keydown.up.stop.prevent="keyUp"
            @keydown.down.stop.prevent="keyDown"
            @keydown.space.stop.prevent="selectCurrent(i, opt.value)"
            )
            input(
              hidden 
              type="checkbox"
              :value="opt.value"
              :checked="inModelValues(opt.value)"
              v-model="modelValue"
              
              )
            span.listbox-item_body
              slot(name="icon")
                v-icon-check.listbox-item_icon(
                  :ref="`icon${i}`"
                  v-if="showIcons"
                  :is-checked="opt.checked"
                  )
              span.listbox-item_text
                slot(name="text" :opt="opt.value")

</template>

<script>
  import {isEqual} from 'lodash'
  import {getNodeElementHeight} from '@/utils/main-scripts'
  const listBoxHeightDefault = '18em'
  export default {
    name: 'v-listbox',
    props: {
      options: {
        type: Array,
        required: true
      },
      value: {
        type: Array,
        default() {return []}
      },
      isFocused: {
        // type: Boolean,
        // default: false  
        type: Number,
        default: 0
      },
      selectAll: {
        type: Boolean,
        default: false  
      },
      hasSelectAll: {
        type: Boolean,
        default: false  
      },
      listBoxHeight: {
        type: [String, Boolean],
        default: listBoxHeightDefault
      },
      showIcons: {type:Boolean, default: true},
      scrollbarSettings: {
        type: Object,
        default() { 
          return {
            suppressScrollX: true,
            minScrollbarLength: 30,
          }
        }  
      }
    },
    data() {
      return {
        listOpt:[],
        selectAllHover: false,
        selectAllLocal: false,
        tabIndex: 0
        // inpName: ''
        
      }
    },
    created() {
      // this.inpName = `checkbox-${(100000 * Math.random()).toFixed()}`
      if (this.$attrs && this.$attrs.tabindex) this.tabIndex = this.$attrs.tabindex
      this.options.forEach((v,index) => {
        this.listOpt.push({
          checked: this.inValues(v),
          value: v
        })
      })
    },
    mounted() {
      this.$nextTick(function() {
        this.$forceUpdate()
        this.selectAllLocal = this.selectAll
        if(this.$refs.listBoxScroll) {
          this.$refs.listBoxScroll.$el.style.maxHeight = this.listboxScrollBodyHeight()
        }
        // console.log('listBox isFocused selectAll',this.isFocused, this.$refs.selectAll)

        if (this.isFocused && this.$refs.selectAll) {
          // console.log('2-listBox isFocused selectAll',this.isFocused, this.$refs.selectAll)
          this.$refs.selectAll.focus()
          }

      })
    },
    computed: {
      modelValue: {
        get() { return this.value},
        set(val) { 
          this.$emit('input', val) 
          this.selectAllLocal = isEqual(val, this.options)
          },
      },
      lbHeight() {
        if (this.listBoxHeight === false) return 'unset' //false
        if (this.listBoxHeight === true) return listBoxHeightDefault
        return this.listBoxHeight
      },
      selectedCount() {
        const flt = this.listOpt.filter(v => v.checked)
        return flt ? flt.length : 0
      }
    },
    watch: {
      value: {
        handler(val) {
          this.listOpt.forEach(el => {
            this.$set(el,'checked', this.inValues(el.value))
          });
        },
        deep: true
      },
      selectAllLocal(val) {
        this.$emit('update:select-all', val)
        if (val) {
          this.modelValue = this.options
          // this.updateAllItemsState(val)
        } else {
          if (this.selectedCount === this.options.length) {
            this.modelValue = []
            // this.updateAllItemsState(val)
          }
        }
      },
      selectAll() {this.selectAllLocal = this.selectAll},
      isFocused(val, oldVal) {
        // console.log('listBox isFocused val oldVal $refs',val, oldVal, this.$refs)
        if (val === oldVal) return
        this.$emit('update:is-focused', val)
        if (val && process.browser && this.$refs.selectAll) {
          // console.log('listBox isFocused', this.$refs.selectAll)
          this.$refs.selectAll.focus()
        }
      }
    },
    methods: {
      listboxScrollBodyHeight(){
        // debugger
        if (!this.hasSelectAll) return this.lbHeight
        if (process.browser) {
          const lbH = this.$refs.listBox ? this.$refs.listBox.clientHeight : -1 
          return lbH ? lbH - getNodeElementHeight(this.$refs.selectAll) + 'px' : 'unset'
        }
        return 'unset'
      },

      mouseEnter(iconRef){ this.$refs[iconRef][0].hover = true },
      mouseLeave(iconRef){ this.$refs[iconRef][0].hover = false },
      inValues(v) {
        return !!this.value.find(el => isEqual(v, el))
      },
      inModelValues(v) {
        return !!this.modelValue.find(el => isEqual(v, el))
      },

      keyUp(evnt) {
        // console.log('list-box keyUp')
        if (evnt.target.previousSibling) {
          evnt.target.previousSibling.focus()
        } else {
          // console.log('select-all-focus')
          // this.$emit('select-all-focus')
          this.$refs.selectAll.focus()
        }
      },
      keyDown(evnt) {
        // console.log('list-box keyDown')

        evnt.target.nextSibling && evnt.target.nextSibling.focus()
      },
      listBoxSetFocus(evnt) {
        // console.log('list-box setFocus',this.$refs.lbl0[0])
        this.$refs.lbl0[0].focus()
      },

      selectCurrent(ind, val) {
        // console.log('current', val)
        if (this.inModelValues(val)) {
          // console.log('inModelValues', true)
          this.modelValue.splice(this.modelValue.indexOf(val), 1)
        } else {
          // console.log('inModelValues', false)
          this.modelValue.push(val)
        }
      }

    }
  }
</script>

<style lang="scss" >
  @import "listbox";
</style>
