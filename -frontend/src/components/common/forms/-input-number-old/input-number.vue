<template lang="pug">
  client-only
    .number(:style="borderColor ? `border-color: ${borderColor}` : ''")
      label.number-label(v-if="hasLabel" :style="`${labelColor ? 'color:'+labelColor: ''}`") {{label}}
      .number-block
        .number-arrow.down(@click="arrowDown")
          svg.icon.icon-number-arrow.down <use href="#icon-number-arrow"/>
        input.number-input(
          type="text"
          ref="input"
          :class="{modified: isModified}"
          :size="inputSize()"
          :style="inputStyle()"

          :value="value"
          @input="input"

          @keydown="keyDown"
          @keyup.up="arrowUp"
          @keyup.down="arrowDown"


          )
        .number-arrow.up(@click="arrowUp")
          svg.icon.icon-number-arrow <use href="#icon-number-arrow"/>

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

  },
  data: () => ({
    // value: null,

    isModified: false
  }),
  mounted() {
    // this.value = this.val || this.min || 0
    // this.locValue = this.value
  },
  computed: {
    locValue: {
      set: function(v) {
        this.value = v;
      },
      get: function() {
        // return this.value;
        return parseInt(this.value, 10);
      }
    },
  },
  methods: {
    input(e) {
      console.log('input:', e)
      let v = parseInt(e.target.value, 10)
      if (v.toString() != e.target.value) {
        e.target.value = parseInt(v, 10)
        v = parseInt(e.target.value, 10)
      }

      if (this.min > v ) v = this.min
      if (this.max < v ) v = this.max
      e.target.value = parseInt(v, 10)

      this.$emit('input', v)

    },
    keyDown(event) {
      // console.log('event.keyCode:', event.keyCode, 'keyDown:', event)
      if (event.keyCode == 38 || event.keyCode == 40) { // запрещаем курсору "прыгать" при нажатии стрелок up - down
        event.stopPropagation();
        event.preventDefault();
        // return false;
      }
      // Разрешаем: backspace, delete, tab и escape
      if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
        // Разрешаем: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Разрешаем: home, end, влево, вправо
        (event.keyCode >= 35 && event.keyCode <= 39)
      //  || event.key == '-'
      ) {

        // console.log('key-good:', event.key)

        // Ничего не делаем
        return
      } else {
        // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
          // console.log('key-bad:', event.key)

          event.preventDefault()
        }
      }
    },
    arrowUp() {
      let v = parseInt(this.$refs.input.value, 10)
      v =  (this.max > v + this.step) ? v + this.step : this.max
      this.$refs.input.value = v
      this.$emit('input', v)

    },
    arrowDown(e) {
      let v = parseInt(this.$refs.input.value, 10)
      v =  (this.min < v - this.step) ? v - this.step : this.min
      this.$refs.input.value = v
      this.$emit('input', v)
    },

    inputStyle() {
      let style = this.inputBorderColor ? `border-color: ${inputBorderColor};` : ''
      if (this.inputTextUnderline) style = style + 'text-decoration: underline;'
      return style
    },
    inputSize() {
      if (this.max === Infinity) return 20
      return this.max.toString().length
    }
  },
}
</script>

<style lang="scss" >
  @import "style";
</style>
