<template lang="pug">
.listbox( ref="listBox" :style="{ maxHeight: lbHeight }" )
  client-only
    perfect-scrollbar.listbox_scroll( 
          v-if="options && options.length"
          v-once :options="scrollbarSettings"
          ref="listBoxScroll" 
          )
      .listbox_scroll-body(
        ref="listBoxScrollBody" 
        :tabindex="2" 
        @keydown.stop.prevent
        )
        label.listbox-item(
          v-for="(opt, i) in listOpt"
          :key="i"
          :tabindex="i + 3"
          :ref="`lbl${i}`"
          :class="{checked1: opt.checked}"
          @keydown.up.stop.prevent="keyUp"
          @keydown.down.stop.prevent="keyDown"
          @keydown.space.stop.prevent="selectCurrent(i, opt.value)"
          )
          input(
            hidden 
            type="checkbox"
            :name="inpName"
            :value="opt.value"
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

      //- client-only
        perfect-scrollbar.listbox_scroll( 
          v-if="options && options.length"
          v-once :options="scrollbarSettings"
          ref="listBoxScroll" 
          )
          .listbox_scroll-body(
            ref="listBoxScrollBody" 
            :tabindex="2" 
            @keydown.stop.prevent
            )
            label.listbox-item(
              v-for="(opt, i) in listOpt"
              :key="i"
              :tabindex="i + 3"
              :ref="`lbl${i}`"
              :class="{checked1: opt.checked}"
              @mouseenter="mouseEnter(`icon${i}`)"
              @mouseleave="mouseLeave(`icon${i}`)"
              @keydown.up.stop.prevent="keyUp"
              @keydown.down.stop.prevent="keyDown"
              @keydown.space.stop.prevent="selectCurrent(i, opt.value)"
              )
              input(
                hidden 
                type="checkbox"
                :name="inpName"
                :value="opt.value"
                :checked="inModelValues(opt.value)"
                v-model="modelValue"
                @change.stop.prevent="updateClass(i, $event.target.checked)"
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
        inpName: ''
        
      }
    },
    created() {
      this.inpName = `checkbox-${(100000 * Math.random()).toFixed()}`

      this.options.forEach((v,index) => {
        // this.listOpt.push({
        //   checked: this.inValues(v),
        //   value: v
        // })
        this.listOpt.push({
          checked: undefined,
          value: v
        })
      })
      // this.listOpt.forEach(el => {
      //       this.$set(el,'checked', this.inValues(el.value))
      //     });

    },
    mounted() {
      this.$nextTick(function() {
        this.$forceUpdate()
        this.selectAllLocal = this.selectAll
        if(this.$refs.listBoxScroll) {
          this.$refs.listBoxScroll.$el.style.maxHeight = this.listboxScrollBodyHeight()
        }
      })

      this.listOpt.forEach(el => {
        console.log('el', el)
        this.$set(el,'checked', this.inValues(el.value))
      })
      console.log('this.listOpt', this.listOpt)

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
            // this.$set(el,'checked', this.inValues(el.value))
            el.checked = this.inValues(el.value)
          });
        },
        deep: true
      },
      selectAllLocal(val) {
        this.$emit('update:select-all', val)
        if (val) {
          this.modelValue = this.options
          this.updateAllItemsState(val)
        } else {
          if (this.selectedCount === this.options.length) {
            this.modelValue = []
            this.updateAllItemsState(val)
          }
        }
      },
      selectAll() {this.selectAllLocal = this.selectAll}
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

      updateClass(ind, e){
        // debugger
        // console.log('updateClass', ind, e)

        if (e) {
          if (this.$refs[`lbl${ind}`] && this.$refs[`lbl${ind}`][0]) {
            this.$refs[`lbl${ind}`][0].classList.add('checked')
          }
          if (this.$refs[`icon${ind}`] && this.$refs[`icon${ind}`][0]){
            this.$refs[`icon${ind}`][0].checked = true
          }
        } else {
          if (this.$refs[`lbl${ind}`] && this.$refs[`lbl${ind}`][0]) {
            this.$refs[`lbl${ind}`][0].classList.remove('checked')
          }
          if (this.$refs[`icon${ind}`] && this.$refs[`icon${ind}`][0]){
            this.$refs[`icon${ind}`][0].checked = false
          }
        }


        // const lbl = this.$refs[`lbl${ind}`]  
        // const icn = this.$refs[`icon${ind}`]
        // if (e) {
        //   if ( lbl && lbl[0] ) lbl[0].classList.add('checked')
        //   if ( icn && icn[0] ) icn[0].checked = true
        // } else {
        //   if ( lbl && lbl[0] ) lbl[0].classList.remove('checked')
        //   if ( icn && icn[0] ) icn[0].checked = false
        // }

      },
      updateAllItemsState(v = true) {
        for (let i = 0; i < this.listOpt.length; i++) {
          const lbl = this.$refs[`lbl${i}`] 
          const chbx = lbl && lbl[0] ? lbl[0].getElementsByTagName('input')[0] : null
          if (chbx) chbx.checked = v
          this.updateClass(i, v)
        }
        
      },
      clearAll() {
        this.updateAllItemsState(false)
      },
      keyUp(evnt) {
        if (evnt.target.previousSibling) {
          evnt.target.previousSibling.focus()
        } else {
          // console.log('select-all-focus')
          // this.$emit('select-all-focus')
          this.$refs.selectAll.focus()
        }
      },
      keyDown(evnt) {
        evnt.target.nextSibling && evnt.target.nextSibling.focus()
      },
      listBoxSetFocus(evnt) {
        this.$refs.lbl0[0].focus()
      },

      selectCurrent(ind, val) {
        console.log('current', val)
        if (this.inModelValues(val)) {
          console.log('inModelValues', true)
          this.modelValue.splice(this.modelValue.indexOf(val), 1)
          this.updateClass(ind,false)
        } else {
          console.log('inModelValues', false)
          this.modelValue.push(val)
          this.updateClass(ind,true)
        }
      }

    }
  }
</script>

<style lang="scss" >
  @import "listbox";
  .listbox-item{
      &:hover {
        .listbox-item_text { 
          opacity: .6; 
          color: red
        }
      }
  }

  .checked1 {color: green!important;}
</style>
