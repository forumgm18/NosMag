<template lang="pug">
  .form-quantity
    a.quantity-minus(href="#" @click.prevent="qtyMinus")
      svg.icon <use xlink:href="#icon-minus-square"></use>
    input(type="text" name="name" v-model="qty" v-on:input="qtyChange")
    a.quantity-plus(href="#" @click.prevent="qtyPlus")
      svg.icon <use xlink:href="#icon-plus-square"></use>

</template>

<script>
export default {
  name: 'quantity',
  props: {
    max: {
      type: Number,
      required: false,
    },
    name: String
  },
  data: () => ({
    qty: 0
  }),
  mounted() {
    this.qty = this.$attrs.value
    // if (this.max) this.max = parseInt(this.max,10)
  },

  methods: {
    qtyPlus() {
      if (this.max) {
        if (this.max > this.qty) this.qty++
      } else {
        this.qty++
      }
      // this.$emit('qtyPlus', this.qty)
      this.qtyChange()
    },
    qtyMinus() {
      if (this.qty > 0) this.qty--
      // this.$emit('qtyMinus', this.qty)
      this.qtyChange()
    },
    qtyChange() {
      const n = parseInt(this.qty, 10) || 0
      this.qty = (this.max && n <= this.max) ? n : this.max
      this.$emit('input', this.qty)
    }
  }
}
</script>

<style scoped>

</style>
