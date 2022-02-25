<template lang="pug">
  client-only
    .number(:style="borderColor ? `border-color: ${borderColor}` : ''")
      label.number-label(v-if="hasLabel" :style="`${labelColor ? 'color:'+labelColor: ''}`") {{label}}
      .number-block
        .number-arrow.down(@click="arrowDown")
          //- svg.icon.icon-number-arrow.down <use href="#icon-number-arrow"/>
          svg.icon.icon-btn-plus.minus <use href="#icon-btn-plus"/>
          
        .number-input-block  
          input.number-input(
            v-auto-min-width
            type="text"
            ref="input"
            :class="{modified: isModified}"
            :value="locValue"
            @input="inputValue"
            @keydown="keyDown"
            @keyup.up="arrowUp"
            @keyup.down="arrowDown"
            )
          span(v-if="appendText.length") {{appendText}}
        .number-arrow.up(@click="arrowUp")
          //- svg.icon.icon-number-arrow <use href="#icon-number-arrow"/>
          svg.icon.icon-btn-plus <use href="#icon-btn-plus"/>

</template>

<script>
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
    inputBorderColor:{ type: String, required: false },
    inputTextUnderline:{ type: Boolean, default: false },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    step: {type: Number, default: 1 },
    appendText:{type: String, default: '', required: false}

  },
  data: function () {
    return {
      isModified: false,
      locValue: this.value
    }
  },

  mounted() { 
    this.locValue = this.value
  },
  // updated() {
  //   return
  //   // debugger
  //   // if (this.$refs.input) this.$refs.input.style.width = this.getInputWidth()
  //   if (this.$refs.input) {
  //     const borders = this.getInputBorders()
  //     this.$refs.input.style.width = this.$refs.input.scrollWidth + borders.left + borders.right + 'px'
  //   }
  // },
  computed: {
    // inputStyle() {
    //   let style = this.inputBorderColor ? `border-color: ${inputBorderColor};` : ''
    //   if (this.inputTextUnderline) style = style + 'text-decoration: underline;'
    //   // style = style + 'width:' + this.getInputWidth() + ';'
    //   return style
    // },
    // inputSize() {
    //   return this.locValue.toString().length
    // }

  },
  methods: {
    // getInputBorders() {
    //   const inputStyles = window.getComputedStyle(this.$refs.input)
    //   let res = {}
    //   res.left = parseInt(inputStyles.getPropertyValue("border-left-width"))
    //   res.right = parseInt(inputStyles.getPropertyValue("border-right-width"))
    //   res.top = parseInt(inputStyles.getPropertyValue("border-top-width"))
    //   res.bottom = parseInt(inputStyles.getPropertyValue("border-bottom-width"))
    //   console.log(res)
    //   return res
    // },

    inputValue(evt) {
      this.locValue = evt.target.value ? parseInt(evt.target.value) : this.min
    },
    keyDown(event) {
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
      this.locValue = parseInt(val, 10)
    },
    locValue: function(val, oldVal) {
      val = parseInt(val, 10)
      if (val <= this.min) this.locValue = parseInt(this.min)
      if (val >= this.max) this.locValue = parseInt(this.max)
      if (val <= this.max && val >= this.min) {
        // this.locValue = val
        this.$emit('input', val, oldVal)
      }
    }
  }
}
</script>

<style lang="scss">
  @import "input-number";
</style>
