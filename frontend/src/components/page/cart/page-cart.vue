<template lang="pug"  >
    //- .cart-page
    //- h1.page-title {{cartTitle}}
    .cart-table
      .cart-table_before-title
        label.cart-check
          input(type="checkbox" v-model="selectAllItems" hidden)
          v-icon-check.icon-checkbox(:is-checked="selectAllItems")
          span {{$options.SELECT_ALL_ITEMS_TEXT}}
        //- button.cart-check(@click="delCartItem(selectAllItems)")  
        button.cart-check.del-all(@click="delCartItem(selectItems)")  
          svg.icon.icon-delete <use href="#icon-delete"/>
          span {{$options.DELETE_SELECTED_ITEMS_TEXT}}

        //- div ================== Таблица товаров в корзине ============================
        //- div ================== Заголовок таблицы ============================
      .cart-table-row.title
        .cart-col-1
          .cart-check(style="visibility:hidden; cursor: initial")
            v-icon-check.icon-checkbox
          .cart-product-img Товар
          //- .cart-table-product 
          //- .cart-table-qprice
          //- .cart-product-info
        .cart-col-2   
          .cart-table-quantity {{quantityTitle}}
          .cart-table-price 
            .cart-table-price-blok Цена
            .cart-table-price-sale 

      .cart-table-row(v-for="(item, ind) in cart" :key="ind" :class="{ 'not-available': item.ostatok === 0 }")
        //- div ================== Кнопка удаления ============================
        .cart-table-row-del(@click.prevent="delCartItem({scode:item.scode})")
          svg.icon.icon-delete <use href="#icon-delete"/>
        //- div ================== Чекбокс ============================
        .cart-col-1  
          label.cart-check
            input(type="checkbox" hidden v-model="selectItems" :value="{scode: item.scode}")
            v-icon-check(:is-checked="isSelectCartItem({scode: item.scode})")
          //- div ================== Фотка товара ============================
    
          nuxt-link.cart-product-img(:to="`${linkPath}${item.alias}`")
            .cart-product-img-box
              .img-box
                img(
                  :src="`${imgPath + imgPrefix.t + item.images[0]}`"
                  :srcset="`${imgPath + imgPrefix.t +imgRetinaPrefix + item.images[0]} 2x`"
                  )
          //- div ================== Инфо о товаре ============================
          .cart-product-info
            nuxt-link.cart-product-title(:to="`${linkPath}${item.alias}`") {{item.name}}
            .cart-product-props 
              .cart-product-props-label Размер:
              .cart-product-props-value {{item.size}}
            .cart-product-props 
              .cart-product-props-label Цвет:
              .cart-product-props-value {{item.color}}
            .cart-product-props 
              .cart-product-props-label(v-html="`Цена за ${item.unit_name}:`") 
              .cart-product-props-value
                span.oldprice(
                  v-if="item.price != item.oldprice"
                  v-html="`${costStr(item.oldprice, 1)}`"
                  )
                span(v-html="`${costStr(item.price, 1)} ${currencyShort}`") 
            //- .cart-product-props.oldprice(v-if="item.price != item.oldprice") 
              .cart-product-props-label.oldprice(v-html="`Старая цена за ${item.unit_name}:`") 
              .cart-product-props-value.oldprice(v-html="`${item.oldprice} ${currencyShort}`") 
            //- .cart-product-props.comment(v-if="item.comment && item.comment.length") 
              .cart-product-props-value.comment(v-html="item.comment") 
            .cart-product-props.comment
              .cart-product-props-value.comment In ipsum cillum adipisicing id reprehenderit. Fugiat labore excepteur labore commodo nulla duis nostrud fugiat. 

        //- div ================== Количество ============================
        .cart-col-2
          .cart-mobile-padding
            label.cart-check
              v-icon-check(:is-checked="isSelectCartItem({scode: item.scode})")
            //- div ================== Фотка товара ============================
            nuxt-link.cart-product-img(:to="`${linkPath}${item.alias}`")
              .cart-product-img-box
                .img-box
                  img(
                    :src="`${imgPath + imgPrefix.t + item.images[0]}`"
                    :srcset="`${imgPath + imgPrefix.t +imgRetinaPrefix + item.images[0]} 2x`"
                    )
          .cart-sub-col
            .cart-table-quantity 
              v-input-number(
                :max="item.ostatok || 1"
                :min="1"
                :value="item.q"
                @input="qualityChange($event, item)"
                )
              .cart-item-comment(v-if="item.ostatok_comment.length") {{item.ostatok_comment}}
            //- div ================== Блок цены ============================
            .cart-table-price(v-if="item.ostatok > 0") 
              .cart-table-price-blok 
                .cart-table-price-total(v-html="itemCostStr(item)")
                .cart-table-price-piece(v-html="itemOldCostStr(item)")
                //- .cart-item-comment(v-html="`Adipisicing cillum reprehenderit esse adipisicing.`")
              .cart-table-sale-block
                .cart-table-price-sale(v-if="item.oldprice" v-html="saleText(item)")
                //- .cart-item-comment(v-html="`Adipisicing cillum reprehenderit esse adipisicing.`")

            .cart-table-price(v-else) 
              .cart-table-price-blok
                .cart-inactive-title 
                  svg.icon.icon-not-available <use href="#icon-not-available"/>
                  span {{item.inactive_header}}
                .cart-inactive-comment {{item.inactive_comment}}

      //- .cart-total-row.cart-table-footer 
        .cart-total-lable(v-html="`Товары ${cart.items_q}&nbsp;шт.`") 
        .cart-total-sum(v-html="`${cart.sum.toLocaleString()} ${currency}`")

</template>

<script>
  export default {
    props: {
      cart: {
        type: [Object, Array],
        requred: true
      },
      value: {
        type: [Object, Array],
        requred: true
      },
      cartTitle: {
        type: String,
        default: ''
      },
      linkPath: {
        type: String,
        default: '/'
      },
    },
    SELECT_ALL_ITEMS_TEXT: 'Выбрать все',
    DELETE_SELECTED_ITEMS_TEXT: 'Удалить выбранное',
    data() {
      return {
        selectAllItems: false,
      }
    },
    computed: {
      selectItems: {
        get() {return this.value},
        set(newVal) { this.$emit('input', newVal) }
      },
      quantityTitle() { return process.browser && this.documentWidth >= 992 ? 'Количество' : 'Кол-во' },
      currency() { return this.$store.state.settings.currency },
      currencyShort() {return this.$store.state.settings.currencyShort},
      imgPath() {return this.$store.state.settings.imgPath},
      imgPrefix() {return this.$store.state.settings.imgPrefix},
      imgRetinaPrefix() {return this.$store.state.settings.imgRetinaPrefix},
    },
    methods: {
      async delCartItem(scode) {
        await this.$store.dispatch('cart/delCartItem', scode )
        await this.$nuxt.refresh()
        // await this.$store.dispatch('cart/getCart')
      },
      // async delSelectedCartItems() {
      //   await this.$store.dispatch('cart/delCartItem', {scode} )
      //   await this.$nuxt.refresh()
      //   // await this.$store.dispatch('cart/getCart')
      // },
      // itemCost(price, q, localeFormatStr = true) { 
      costStr(price, q, localeFormatStr = true) { 
        const p = parseFloat(price, 10) * parseInt(q, 10)
        const res = localeFormatStr ? p.toLocaleString() : p
        return `${res}`
        },
      itemCostStr(item, localeFormatStr = true) { 
        return `${this.costStr(item.price, item.q, localeFormatStr)} ${this.currencyShort}`
        },
      itemOldCostStr(item, localeFormatStr = true) { 
        return `${this.costStr(item.oldprice, item.q, localeFormatStr)} ${this.currencyShort}`
        },
      // priceForOne(price, unit_name) { return `${price} ${this.currencyShort} за ${unit_name}`},
      priceForOneStr(item, localeFormatStr = true) { 
        // const p = item.oldprice
        // const res = localeFormatStr ? p.toLocaleString() : p
        // return `${res} ${this.currencyShort}`
        return `${item.price} ${this.currencyShort} за ${item.unit_name}`
        },
      async qualityChange(q, itm) {
        // console.log('e: ', e)
        // debugger
        if (q != itm.q) {
          await this.$store.dispatch('cart/changeCartItem', {scode: itm.scode, q: q} )
          await this.$nuxt.refresh()
        }
      },
      isSelectCartItem(val) {
        // const res = this.selectItems.find(item => item.scode === val.scode)
        const res = this.selectItems ? this.selectItems.find(item => item.scode === val.scode) : false
        return !!res
      },
      saleText(item) {
        // return `Скидка ${item.q * ( item.oldprice - item.price )} ${this.currencyShort}`
        return item.price_comment
      }

    },
    watch: {
      selectAllItems(newVal) {
        // this.selectItems = newVal ? this.cart.items.map(item => {return{scode: item.scode}}) : []
        this.selectItems = newVal ? this.cart.map(item => {return{scode: item.scode}}) : []
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>