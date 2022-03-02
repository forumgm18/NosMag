<template lang="pug">
.map-sidebar-panel.detail(ref="sidebarPanel")
  .map-sidebar-title(v-if="title && title.length")
    svg.icon.icon-arrow-back(v-if="!showDetailOnly" @click="goBack") <use href="#icon-arrow-back"/>
    span {{title}}

  v-preloader.in-page(v-if="$fetchState.pending")
  div(v-else-if="pvz")
    .map-sidebar-item.btn-inside
      .map-sidebar-item_title Адрес
      .map-sidebar-item_text {{address}}
      button.btn( 
        v-if="!showDetailOnly"
        @click="pvzSelect" 
        ) Выбрать этот пункт
    div(ref="scrollPanel")
      client-only
        perfect-scrollbar.map-sidebar-scroll(
          :options="$options.scrollbarOptions"
          :style="`height:${scrollbarHeight}`"
          )
          ul.map-sidebar-list
            li.map-sidebar-item(v-if="workTime")
              .map-sidebar-item_title Режим работы
              .map-sidebar-item_text {{workTime}}

            li.map-sidebar-item(v-if="nearestMetro")
              .map-sidebar-item_title Ближайшая станция метро
              .map-sidebar-item_text 
                span(v-for="(m, l) in nearestMetro" :key="l") {{ m }}

            li.map-sidebar-item(v-if="nearestStation")
              .map-sidebar-item_title Ближайшая остановка
              .map-sidebar-item_text 
                span(v-for="(s, k) in nearestStation" :key="k") {{ s }}

            li.map-sidebar-item(v-if="phones && phones.length")
              .map-sidebar-item_title Телефон
              .map-sidebar-item_text 
                a.phone-link(
                  v-for="(p, j) in phones" 
                  :key="j"
                  :href="`tel:${p}`"
                  ) {{p}}

            li.map-sidebar-item(v-if="deliveryTerms")
              .map-sidebar-item_title Условия доставки
              .map-sidebar-item_text {{deliveryTerms}}
                
            li.map-sidebar-item(v-if="addressComment && addressComment.length")
              .map-sidebar-item_title Как добраться
              .map-sidebar-item_text 
                .map-sidebar-item_text-collapse(
                  :class="{ collapse: addrCommentCollapse }"
                  ref="collapse"
                  ) {{addressComment}}
                .map-sidebar-show-more(
                  v-if="addrCommentCollapse && showMoreVisible()" 
                  @click="addrCommentShow"
                  ) {{ $options.SHOW_MORE }}

</template>

<script>
  export default {
    props: {
      pvzCode: {
        default: null
      },
      title: {
        type: String,
        default: ''
      },
      showDetailOnly: {
        type: Boolean,
        default: false
      },
      pvzInfo: {
        type: Object,
        default: undefined
      },

    },  
    scrollbarOptions: {wheelPropagation: false},  
    async fetch(){
      if (this.pvzInfo) {
        this.pvz = this.pvzInfo
      } else {
        const c = await this.$axios.$get(`/get_pvz_info`, {
          params: {
            code: this.pvzCode,
            session_id: this.$store.state.token.session_id
          }
        })
        // Парсим строку с телефонами 
        c.pvz.phones = JSON.parse(c.pvz.phones)
        if (c.pvz.office_image_list) c.pvz.office_image_list = JSON.parse(c.pvz.office_image_list)
        // Преобразуем строковые числа в числа
        const content = JSON.parse(JSON.stringify(c),function (key, value) {
          if (value === (+value).toString()) return +value
          return value
        } )

        this.pvz = c.pvz
      }  
    },
    data() {
      return {
        pvz: null,
        addrCommentCollapse: true,
        scrollbarHeight: 'auto',
      }
    },
    SHOW_MORE: 'Читать дальше',
    mounted() {
      this.$nextTick(this.$forceUpdate())
    },
    computed: {
      address(){
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = this.pvz.address
            break
          default:  
            res = this.pvz.location_address
        }
        return res
      },
      workTime(){
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = false
            break
          default:  
            res = this.pvz.work_time
        }

        return res
      },
      phones(){
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = false
            break
          default:  
            res = this.pvz.phones ? this.pvz.phones.map(p => p.number) : false
        }
        return res
      },
      addressComment(){
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = this.pvz.comment
            break
          default:  
            res = this.pvz.address_comment
        }
        return res
      },

      nearestMetro() { 
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = false
            break
          default:  
            res = this.pvz.nearest_metro_station && this.pvz.nearest_metro_station.length 
          ? this.pvz.nearest_metro_station.split(',').map(s => s.trim()) : null 
        }
        
        return res
      },
      nearestStation() {
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = false
            break
          default:  
            res = this.pvz.nearest_station && this.pvz.nearest_station.length 
          ? this.pvz.nearest_station.split(',').map(s => s.trim()) : null 
        }
        return res

        
      },
      deliveryTerms() {
        let res
        switch(this.pvz.type) {
          case 'samovyvoz':
            res = false
            break
          default:  
            const arr = []
            this.pvz.is_dressing_room ? arr.push('Есть комната примерки') : arr.push('Без примерки')
            if ( this.pvz.have_cash ) arr.push('Оплата наличными') 
            if ( this.pvz.have_cashless ) arr.push('Оплата по терминалу') 
            if ( this.pvz.is_handout ) arr.push('Выдача посылок') 
            if ( this.pvz.is_reception ) arr.push('Прием посылок') 
            res = arr.length ? arr.join(', ') : null
        }
        return res

      }
    },
    watch: {
      '$fetchState.pending': function(val) {
        if (val) return
        this.$nextTick( function () {
          const h = this.$refs.sidebarPanel.clientHeight
          const t = this.$refs.scrollPanel ? this.$refs.scrollPanel.offsetTop : 0
          console.log('h: ', h, 't: ', t)
          this.scrollbarHeight = `${ h - t }px`
        })
      }
    },
    methods: {
      addrCommentShow() {this.addrCommentCollapse = false},
      pvzSelect() {
        this.$emit('select-pvz', this.pvz)
      },
      goBack() {
        this.$emit('go-back')
      },
      showMoreVisible(){
        const clps = this.$refs.collapse 
        return clps ? clps.scrollHeight > clps.offsetHeight : true
      },

    }


  }
</script>

<style lang="scss" scoped>

</style>