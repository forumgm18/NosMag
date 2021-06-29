<template lang="pug">
  .form-quantity
    a.quantity-minus(href="#" @click.prevent="qtyMinus")
      svg.icon <use xlink:href="#icon-minus-square"></use>
    input(type="text" name="name" :value="value.count" v-on:input="qtyChange('count', $event.target.value)" @keydown="qtyKey")
    a.quantity-plus(href="#" @click.prevent="qtyPlus")
      svg.icon <use xlink:href="#icon-plus-square"></use>

</template>

<script>
import { cloneDeep, tap, set } from 'lodash'
export default {
  name: 'QuantitySize',
  props: {
    value: { required: true },
    id: { required: true },
    name: String,
  },
  data: () => ({
    // qty: 0
  }),
  computed: {
    local() {return this.value}
  },
  mounted() {
    // this.qty = this.$attrs.value
    // if (this.max) this.max = parseInt(this.max,10)
  },

  methods: {
    qtyPlus() {
      // if (this.max) {
      //   if (this.max > this.qty) this.qty++
      // } else {
      //   this.qty++
      //   this.value++
      // }
      // this.$emit('qtyPlus', this.qty)
      // this.qtyChange()
      // const n = parseInt(this.qty, 10) || 0
      // this.$emit('input', {id: this.id, value: +this.value})
      this.qtyChange('count', this.value.count + 1)

    },
    qtyMinus() {
      // this.qty--
      // this.value--
      // if (this.qty > 0) this.qty--
      // this.$emit('qtyMinus', this.qty)
      // this.qtyChange()
      // const n = parseInt(this.qty, 10) || 0
      // this.$emit('input', {id: this.id, value: +this.value})

      this.qtyChange('count', this.value.count - 1)

    },
    qtyChange(key, value) {
      // const n = parseInt(this.qty, 10) || 0
      // this.$emit('input', {id: this.id, value: +this.value})
      const v = {id: this.id, value: tap(cloneDeep(this.local), v => set(v, key, value))}
      this.$emit('input', v)
    },
    qtyKey(event) {
      console.log('key:', event)
      // Разрешаем: backspace, delete, tab и escape
      if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 ||
        // Разрешаем: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Разрешаем: home, end, влево, вправо
        (event.keyCode >= 35 && event.keyCode <= 39)) {

        // Ничего не делаем
        return
      } else {
        // Запрещаем все, кроме цифр на основной клавиатуре, а так же Num-клавиатуре
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
          event.preventDefault()
        }
      }    }
  }
}
</script>

<style scoped>

</style>
