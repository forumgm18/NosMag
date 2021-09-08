<template lang="pug">
  main.container.cart-page
    section
      h1.page-title Корзина
    section.cart-content
      .cart-table
        .cart-table-row.title
          .cart-table-product Товар
          .cart-table-quantity Количество
          .cart-table-price Цена
        .cart-table-row(v-for="i in 3" :key="i")
          .cart-table-product 
            .cart-product-img
              .cart-product-img-box
                .img-box
                  img(src="")
            .cart-product-info
              .cart-product-title Набор носков из 5 пар Нева сокс “Ментоловый гонщик”
              .cart-product-props 
                .cart-product-props-label Размер:
                .cart-product-props-value 27
              .cart-product-props 
                .cart-product-props-label Доставка:
                .cart-product-props-value 29 июля

          .cart-table-quantity 
            input-number(
              :max="9999"
              :min="0"
              :value="1"
              append-text="шт."
              v-model="testNumber"
              )
          .cart-table-price 
            .cart-table-price-sale 240 000 р. 
            .cart-table-price-blok 
              .cart-table-price-total 234 000 руб.
              .cart-table-price-piece 1170 р. за шт

      .cart-total
        .page-title оформление заказа
        .cart-total-row 
          .cart-total-lable Товары 9999 шт.
          .cart-total-sum 10 532 руб.
        .cart-total-row 
          .cart-total-lable Скидка
          .cart-total-sale  -268 руб.
        .cart-total-row 
          .cart-total-lable Доставка
          .cart-total-delivery Выбрать адрес
        
        .btn Заказать

    
</template>

<script>
  import inputNumber from '~/components/common/forms/input-number/input-number'

  export default {
    components: {inputNumber,},
    data: function () {
      return {
        testNumber:0
      }
    },
    
  }
</script>

<style lang="scss" scoped>
  @import "cart"
</style>