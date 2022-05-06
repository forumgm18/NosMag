<template lang="pug">
  client-only
    //- .number(:style="borderColor ? `border-color: ${borderColor}` : ''")
    .number(
      :style="`border-color: ${setBorderColor}`"
      @mouseenter="isHover=true"
      @mouseleave="isHover=false"
      )
      label.number-label(v-if="hasLabel" :style="`${labelColor ? 'color:'+labelColor: ''}`" v-html="label") 
      .number-block
        .number-arrow.down(v-if="hasSpinBtn" @click="arrowDown")
          svg.icon.icon-btn-plus.minus <use href="#icon-btn-plus"/>
          
        .number-input-block
          span(v-if="beforeText.length" v-html="beforeText")
          input.number-input(
            v-auto-min-width="autoMinWidth"
            type="text"
            ref="input"
            :key="keyInput"
            :class="{modified: isModified}"
            :value="locValue"
            @input="inputValue"
            @keydown="keyDown"
            @keyup.up="arrowUp"
            @keyup.down="arrowDown"
            @focus="isFocus=true"
            @blur="isFocus=false"

            )
          span(v-if="appendText.length" v-html="appendText") 
        .number-arrow.up(v-if="hasSpinBtn" @click="arrowUp")
          svg.icon.icon-btn-plus <use href="#icon-btn-plus"/>

</template>

<script>
import {keyNumeric} from '@/utils/main-scripts'
export default {
  name: 'input-number',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    id:{},
    name:{ type: String, required: false },
    label: { type: String, default: '' },
    hasLabel: { type: Boolean, default: false },
    labelPosition:{ type: String, default: 'left' },
    labelColor:{ type: String, required: false,},
    arrowColor:{ type: String, required: false },
    borderColor:{ type: String, required: false },
    focusBorderColor:{ type: String, required: false },
    hoverBorderColor:{ type: String, required: false },
    inputBorderColor:{ type: String, required: false },
    inputTextUnderline:{ type: Boolean, default: false },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    step: {type: Number, default: 1 },
    beforeText:{type: String, default: '', required: false},
    appendText:{type: String, default: '', required: false},
    hasSpinBtn: { type: Boolean, default: true },
    autoMinWidth: {
      type: [Boolean,Number],
      default: true
    },

  },
  data: function () {
    return {
      keyInput: 1,
      isModified: false,
      isFocus: false,
      isHover: false,

      // locValue: this.value
    }
  },

  mounted() { 
    this.locValue = this.value
    this.$nextTick(()=> this.keyInput++) // Перерисовываем компонент для правильного расчета ширины
  },
  computed: {
    locValue: {
      get() {return this.value},
      set(val, oldVal) {
        // Если стерли все из input'а то надо его перерисовать иначе будет расхождение с данными.
        if (this.$refs.input && this.$refs.input.value.length === 0) {
          this.keyInput++ // перерисовываем Input
          // Возвращаем фокус
          this.$nextTick(()=> {this.$refs.input.focus()})
        }
        val = parseInt(val, 10)
        let res = val
        if (val <= this.min) res = parseInt(this.min)
        if (val >= this.max) res = parseInt(this.max)
        this.$emit('input', res, oldVal)
      }
    },
    setBorderColor() {
      if (this.isFocus && this.focusBorderColor) return this.focusBorderColor
      if (this.isHover && this.hoverBorderColor) return this.hoverBorderColor
      if (this.borderColor) return this.borderColor
      return ''
    }
  },
  methods: {
    inputValue(evt) {
      this.locValue = !!evt.target.value ? parseInt(evt.target.value) : this.min
    },
    keyDown(event) {
      // keyNumeric(event)
      if (event.keyCode == 38 || event.keyCode == 40) { // запрещаем курсору "прыгать" при нажатии стрелок up - down
        event.stopPropagation();
        event.preventDefault();
      }
      // Разрешаем: backspace, delete, tab и escape
      if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
        // Разрешаем: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Разрешаем: home, end, влево, вправо
        (event.keyCode >= 35 && event.keyCode <= 39)
      ) {
        // Ничего не делаем если нажата разрешенная кнопка на клаве
        return
      } else {
        // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
          event.preventDefault()
        }
      }
    },
    arrowUp() {
      this.locValue = parseInt(this.locValue, 10) + this.step
    },
    arrowDown(e) {
      this.locValue = parseInt(this.locValue, 10) - this.step
    },

  },
  watch: {
    value: function(val, oldVal) {
      console.log('value', val, oldVal)
      this.locValue = parseInt(val, 10)
    },
    // locValue: function(val, oldVal) {
    //   val = parseInt(val, 10)
    //   if (val <= this.min) this.locValue = parseInt(this.min)
    //   if (val >= this.max) this.locValue = parseInt(this.max)
    //   if (val <= this.max && val >= this.min) {
    //     // this.locValue = val
    //     this.$emit('input', val, oldVal)
    //   }
    // }
  }
}
</script>

<style lang="scss">
  @import "input-number";
</style>
