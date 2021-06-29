<template>
  <div class="product-item" :data-product-id="product.id">
    <div class="product-item-base">
      <nuxt-link :to="`/${product.alias}`" class="product-item_img">
        <div class="product-item-hover-block">
          <div
            v-for="img of product.images"
            :key="img.id"
            class="product-img-hover"
          >
            <div class="a">
              <img :src="img" :alt="product.comment" loading="lazy" />
            </div>
          </div>
        </div>
      </nuxt-link>
      <div class="product-item_info">
        <div class="product-item_price-block">
          <div v-if="product.price_min" class="product-item_price-actual">
            <span>от</span>
            {{ product.price_min }} &#8381;
          </div>
          <div v-else class="product-item_price-actual">
            {{ product.price }} &#8381;
          </div>
          <div v-if="sale" class="product-item_price-old">{{ product.oldprice }} &#8381;</div>
          <div v-if="sale" class="product-item_price-sale">{{ sale }}%</div>
        </div>
        <nuxt-link :to="`/catalog/${product.alias}`" class="product-item_descr">
          <v-clamp autoresize :max-lines="2">{{ product.name }}</v-clamp>
        </nuxt-link>
      </div>
    </div>
    <div v-if="(isBtn || isSizes)" class="product-item-btn-panel">
      <div v-if="isSizes" class="product-item-size">
        <div class="product-item-size-title">Размеры в наличии</div>
        <a v-for="s of product.sizes" :key="s.id" href="#" @click="showModal">{{s.name}}</a>
      </div>
      <div v-if="isBtn" class="btn btn-secondary">В КОРЗИНУ</div>
    </div>
  </div>
</template>

<script>
import VClamp from 'vue-clamp'
import sale from '~/utils/sale'
export default {
  name: 'ProductItem',
  components: { VClamp },
  props: {
    product: {
      type: Object,
      required: true
    },
    isBtn: {
      type: Boolean,
      required: false,
      default: true
    },
    isSizes: {
      type: Boolean,
      required: false,
      default: true
    }
    },
  data: () => ({
    sale: 0,
  }),
  mounted() {
    // console.log(this.product)
    this.sale = sale(this.product.price, this.product.oldprice)
  },
  methods: {
    showModal() {
      this.$modal.show('basket-add-modal', { addedProduct: this.product.id })
    },
  },
}
</script>

<style scoped>

</style>
