<template lang="pug">
  client-only
    modal(
      name="basket-add-modal"
      transition="pop-out"
      height="70%"
      width="95%"
      class="modal-basket-add"
      :max-width="720"
      :max-height="720"
      :adaptive="true"
      :scrollable="true"
      :pivot-y="0.5"
      :reset="true"
      @before-open="beforeOpen"
    )
      .modal-content(v-if="product" )
        .modal-close(@click="$modal.hide('basket-add-modal')")
          svg.icon <use href="#icon-close"></use>
        .modal-title {{ product.name }}
        .modal-body
          .product-img
            .img-box
              img(:src="product.images[0]" :alt="product.comment")
          .product-props
            .product-props-title Выберите размер
            .filter-item(v-for="s of product.sizes" :key="s.id" href="#")
              label.radio-check
                input(type="radio" name="name1" hidden="")
                span.radio-check_text-block
                  span.radio_icon
                  span.radio-check_text {{s.name}}
            .product-props-title Выберите количество
            quantity(name="qty" :qty="qty")
            .product-props-title Выберите вид кейса:
            buy-btn(text="В корзину")





</template>

<script>
import { mapGetters } from 'vuex'
import quantity from '~/components/common/quantity'
import BuyBtn from '~/components/common/buy-btn'

export default {
  name: 'BasketAddModal',
  components: { quantity, BuyBtn },
  data: () => ({
    addedProduct: null,
    qty: 1
  }),
  computed: {
    ...mapGetters({
      products: 'products/products',
    }),
    product: th => th.products.find(p => p.id === th.addedProduct) || null,
  },
  methods: {
    beforeOpen(event) {
      if (!event.params) {
        event.params = {}
      }
      if (event.params.addedProduct) {
        this.addedProduct = event.params.addedProduct
      } else {
        this.addedProduct = 9077
      }
    }
  }
}
</script>

<style scoped></style>
