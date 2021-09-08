<template lang="pug">
  client-only
    .number(:style="borderColor ? `border-color: ${borderColor}` : ''")
      label.number-label(v-if="hasLabel" :style="`${labelColor ? 'color:'+labelColor: ''}`") {{label}}
      .number-block
        .number-arrow.down(@click="arrowDown")
          svg.icon.icon-number-arrow.down <use href="#icon-number-arrow"/>
        .number-input-block  
          input.number-input(
            type="text"
            ref="input"
            :class="{modified: isModified}"
            :size="inputSize"
            :style="inputStyle"
            :value="locValue"
            @input="inputValue"
            @keydown="keyDown"
            @keyup.up="arrowUp"
            @keyup.down="arrowDown"
            )
          span(v-if="appendText.length") {{appendText}}
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
    appendText:{type: String, default: '', required: false}

  },
  data: function () {
    return {
      isModified: false,
      locValue: this.value
    }
  },

  // mounted() { },
  updated() {
    if (this.$refs.input) this.$refs.input.style.width = this.getInputWidth()
  },
  computed: {
    inputStyle() {
      let style = this.inputBorderColor ? `border-color: ${inputBorderColor};` : ''
      if (this.inputTextUnderline) style = style + 'text-decoration: underline;'
      // style = style + 'width:' + this.getInputWidth() + ';'
      return style
    },
    inputSize() {
      // if (this.max === Infinity) return 20
      // return this.max.toString().length
      return this.locValue.toString().length
    }

  },
  methods: {
    getInputWidth() { // Вычисляет ширину input`а
      if(!process.browser ) return 'initial'
      if(!this.$refs.input ) return 'initial'
      const mirror = document.createElement('div') // Создаем новый временный элемент
      mirror.textContent = this.locValue           // Добавляем в него текст из input`а 
      // Применяем стили input`а к созданному блоку
      const inputStyles = getComputedStyle(this.$refs.input)
      mirror.style.font = inputStyles.font
      mirror.style.padding = inputStyles.padding
      mirror.style.border = inputStyles.border
      mirror.style.width = 'fit-content'
      document.body.append(mirror)
      // Получаем его длину
      const w = mirror.offsetWidth
      mirror.remove() // удаляем временный элемент
      return w + 'px'
    },

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
    locValue: function(val, oldVal) {
      val = parseInt(val, 10)
      if (val <= this.min) this.locValue = parseInt(this.min)
      if (val >= this.max) this.locValue = parseInt(this.max)
      if (val <= this.max && val >= this.min) this.$emit('input', val, oldVal)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "input-number";
</style>
