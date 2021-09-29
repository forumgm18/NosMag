<template lang="pug">
  main.container.cart-page
    section
      h1.page-title {{$options.CART_TITLE}}
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
        .page-title {{$options.ORDER_TOTAL_TITLE}}
        .cart-total-row 
          .cart-total-lable Товары 9999 шт.
          .cart-total-sum 10 532 руб.
        .cart-total-row 
          .cart-total-lable {{$options.ORDER_TOTAL_SALE_TEXT}}
          .cart-total-sale  -268 руб.
        .cart-total-delivery {{$options.ORDER_TOTAL_DELIVERY_TEXT}}
        .btn {{$options.BTN_TOTAL_TEXT}}
    
    section.order-content 
      h1.page-title {{$options.ORDER_TITLE}}

      .order-form
        .order-form-col
          .order-form-section
            .order-form-item
              .order-item-label
                span {{$options.LABELS.NAME}}
                tool-tip
                  template(#tooltip-title) Для чего нам нужны ваши настоящие ФИО?
                  p Так как в разных пунктах выдачи требуются свои правила, то мы вывели средний регламент требований по оформлению заказа. 
                  p Это средний набор данных, подходящих для доставки вам товара любым из выбранных способов.
              input-field.order-item-input(
                v-model="name"
                type="text"
                :placeholder="$options.PLACEHOLDERS.NAME"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              )
            .order-form-item
              .order-item-label
                span {{$options.LABELS.FAM}}
              input-field.order-item-input(
                v-model="fam"
                type="text"
                :placeholder="$options.PLACEHOLDERS.FAM"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              )

            .order-form-item
              .order-item-label
                span {{$options.LABELS.OTCH}}
              input-field.order-item-input(
                v-model="otch"
                type="text"
                :placeholder="$options.PLACEHOLDERS.OTCH"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              )
          .order-form-section
            .order-form-item
              .order-item-label
                span {{$options.LABELS.EMAIL}}
              input-field.order-item-input(
                v-model="email"
                type="email"
                :placeholder="$options.PLACEHOLDERS.EMAIL"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              )
            .order-form-item
              .order-item-label
                span {{$options.LABELS.TEL}}
              input-field.order-item-input(
                v-model="tel"
                type="text"
                :placeholder="$options.PLACEHOLDERS.TEL"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              )

          .order-form-section
            .order-form-item
              .order-item-label
                span {{$options.LABELS.TOWN}}
              .order-item-input 
                .lbl {{$options.INPUT_TOWN_TOOLTIP_LABEL}}  
                v-dropdown(
                  
                  :title="$options.PLACEHOLDERS.TOWN"
                  :multiple="false"
                  :class="{ focus: cityFocuse }"
                )
                  template(#title) 
                    input.dropdown-input(
                      type="text"
                      v-model="citiesSearchStr"
                      :placeholder="$options.PLACEHOLDERS.TOWN"
                      @focus="cityFocused"
                      @blur="cityBlur"
                      @input="filterCities"
                    )
                  template( #content )
                    vnm-select-list(
                      v-if="cities"
                      :multiple="false"
                      item-type='radio'
                      :options="cities" 
                      :class="{'set-max-height' : cities.length > 9}"
                      v-model="town" 
                      :show-icon="false"
                      )
                      
                      template(#optText="{opt}" ) 
                        span.filter-option_item-text {{opt.name}}
            .order-form-item
              .order-item-label
                span {{$options.LABELS.ADDRESS}}
                tool-tip
                  template(#tooltip-title) Для чего нам нужен ваш адрес?
                  p Так мы сможем показать на карте ближайшие к вам пункты выдачи, в зависимости от выбранного способа доставки.
                  p Если указана доставка курьером, то просто укажите свой актуальный адрес - мы расчитаем время прибытия заказа, а также сориентируем вас по стоимости.
              input-field.order-item-input(
                v-model="address"
                type="text"
                :placeholder="$options.PLACEHOLDERS.ADDRESS"
                :error-text="$options.INPUT_ERROR_TEXT_DEFAULT"
              )


        .order-form-col.od

          label.od-item
            input(type="radio" v-model="test" value="1" hidden)
            svg.icon.icon-radio <use href="#icon-radio"/>
            .od-item-label Самовывоз со склада в Москве
            .od-item-descr Адрес: г. Москва, ул. Кулакова д.20, стр.1А

          label.od-item
            input(type="radio" v-model="test" value="2" hidden)
            svg.icon.icon-radio <use href="#icon-radio"/>
            .od-item-label Доставка курьером по Москве
            .od-item-descr 
              span Укажите адрес, стоимость доставки расчитывается автоматически.
              tool-tip.right
                template(#tooltip-title) Смотрите внимательно на условия доставки
                p Стоимость расчитывается автоматически, после указанного вами города и актуального адреса. 
                p Выберете один из способов доставки и посмотрите время прибытия вашего заказа, а также способ возможной оплаты. 
                p (онлайн на сайте, терминалом или наличными при получении)
                p Если стоимость ваших покупок составляет <strong>3000 р.</strong> и более, то мы доставим заказ в ваш город <strong>бесплатно!</strong>

          label.od-item
            input(type="radio" v-model="test" value="3" hidden)
            svg.icon.icon-radio <use href="#icon-radio"/>
            .od-item-label Доставка по Москве от Яндекс.Go
            .od-item-descr Укажите адрес, стоимость доставки расчитывается автоматически.

          label.od-item
            input(type="radio" v-model="test" value="4" hidden)
            svg.icon.icon-radio <use href="#icon-radio"/>
            .od-item-label Самовывоз из пункта выдачи СДЭК
            .od-item-descr Заказ приходит в пункт выдачи. Стоимость расчитывается автоматически.

          label.od-item
            input(type="radio" v-model="test" value="5" hidden)
            svg.icon.icon-radio <use href="#icon-radio"/>
            .od-item-label Доставка курьером от СДЭК
            .od-item-descr Укажите адрес, стоимость доставки расчитается автоматически.

          label.od-item
            input(type="radio" v-model="test" value="6" hidden)
            svg.icon.icon-radio <use href="#icon-radio"/>
            .od-item-label Самовывоз из пункта выдачи Почты России
            .od-item-descr Заказ приходит в Почтовый пункт. Стоимость фиксированная - 350 р.

      .map-section
        .order-item-label
        .yamap 
        .tk-icon 

      .order-total-section
        .order-item-label
        .order-total-block
          .order-total
            .order-total-col
              .order-pay
                label.order-pay-item
                  input(type="radio" v-model="orderPay" value="online" hidden)
                  svg.icon.icon-radio <use href="#icon-radio"/>
                  span ОПЛАТА ОНЛАЙН <br> на сайте картой
                label.order-pay-item
                  input(type="radio" v-model="orderPay" value="upon-receipt" hidden)
                  svg.icon.icon-radio <use href="#icon-radio"/>
                  span ПРИ ПОЛУЧЕНИИ <br> наличными / терминал
              .order-tk
                .order-tk-name Пункт выдачи СДЭК
                .order-tk-descr г. Ижевск, ул. 10 лет октября Зои пионерской Победы красногеройской, 32 к3 / стр23


            .order-total-col
              .order-info
                .order-info-item
                  .order-info-label 
                    span.text Стоимость заказа:
                  .order-info-val 
                    span.text 4 680 руб.
                    span.sale 460 руб.
                
                .order-info-item
                  .order-info-label 
                    span.text Доставка:
                    span.descr 22 Сентября
                  .order-info-val 
                    span.text бесплатно
                    span.sale 460 руб.
                    .hr

                .order-info-item.total
                  .order-info-label Итоговая сумма:
                  .order-info-val 4 680 руб.




          .order-total
            .order-comment-label Если требуется, можете оставить комментарий:
            textarea.order-comment(v-model="orderComment")

          .order-btn-block
            .btn Оформить заказ
            .order-btn-descr Менеджер свяжется с вами для уточнения деталей заказа


        




    

</template>

<script>
  import inputNumber from '~/components/common/forms/input-number/input-number'
  import inputField from '~/components/common/forms/input-field/input-field'
  import toolTip from '~/components/common/tooltip/tooltip'
  import vDropdown from '~/components/common/v-dropdown/v-dropdown'
  import vnmSelectList from '~/components/common/forms/vnm-select-list/vnm-select-list'

  export default {
    components: {
      inputNumber,
      inputField,
      toolTip,
      vDropdown,
      vnmSelectList,
      },
    ORDER_TOTAL_DELIVERY_TEXT: 'Действует бесплатная доставка при заказе от 3 000 руб.',  
    ORDER_TOTAL_SALE_TEXT: 'Скидка',  
    BTN_TOTAL_TEXT: 'Заказать',  
    CART_TITLE: 'Корзина',  
    ORDER_TITLE: 'оформление заказа',  
    ORDER_TOTAL_TITLE: 'оформление заказа',  
    INPUT_ERROR_TEXT_DEFAULT: 'Это поле обязательно',  
    INPUT_TOWN_TOOLTIP_LABEL: 'Начните вводить название города',  

    PLACEHOLDERS: {
      NAME: 'Иван',  
      FAM: 'Иванов',  
      OTCH: 'Иванович',  
      EMAIL: 'ioanio1987@mail.ru',  
      TEL: '+7 912 000 00 00',  
      TOWN: 'Москва',  
      ADDRESS: 'ул. Кулакова, 21, стр. 16', 
    },  
    LABELS: {
      NAME: 'Имя',  
      FAM: 'Фамилия',  
      OTCH: 'Отчество',  
      EMAIL: 'E-mail',  
      TEL: 'Телефон',  
      TOWN: 'Город',  
      ADDRESS: 'Адрес', 
    },  
  fetch: async function(){
    // console.log('cities/getCities')
    await this.$store.dispatch('cart/getCart')
  },

    data: function () {
      return {
        test: '',
        testNumber:0,
        name: '',
        fam: '',
        otch: '',
        tel: '',
        email: '',
        town: {},
        address: '',
        orderComment: '',
        orderPay: '',
        citiesSearchStr: '',
        cityFocuse: false,
        // filteredCities: this.cities,
      }
    },
  computed: {
    cities() {  return this.$store.state.cities.cities || null },
    cart() {  return this.$store.state.cities.cities || null },
  },
  // mounted(){
  //   this.filteredCities = this.cities
  // },
  methods: {
    filterCities() { this.$store.dispatch('cities/searchCity', this.citiesSearchStr ) },
    cityFocused() { this.cityFocuse = true },
    cityBlur() { this.cityFocuse = false },
  },
  watch:{
    town() {
      this.citiesSearchStr = this.town.name
    }
  }

    
  }
</script>

<style lang="scss" >
  @import "cart";
  @import "order";
</style>