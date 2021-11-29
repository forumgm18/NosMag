<template lang="pug">
  .baloon
    v-preloader.in-page(v-if="$fetchState.pending || pvzInfo === null")
    .baloon-body(v-else)
      transition(name="fade")
        .baloon-scrollbar(v-bar)
          .baloon-scroll-content
            .baloon-title {{pvzInfo.name}}
            .baloon-item
              .baloon-item-label Адрес
              .baloon-item-text {{pvzInfo.location_address}}
            .baloon-item
              .baloon-item-label Режим работы
              .baloon-item-text(v-if="workTimeArr") 
                span(v-for="(d, i) in workTimeArr" :key="i") {{ d }}
                
            .baloon-item(v-if="nearestStation.length")
              .baloon-item-label Ближайшая остановка
              .baloon-item-text
                span(v-for="(s, k) in nearestStation" :key="k") {{ s }}

            .baloon-item(v-if="nearestMetro")
              .baloon-item-label Ближайшая станция метро
              .baloon-item-text
                span(v-for="(m, l) in nearestMetro" :key="l") {{ m }}
                
            .baloon-item
              .baloon-item-label Телефон
              .baloon-item-text(v-for="(p, j) in pvzInfo.phones" :key="j") {{p.number}}
            .baloon-item(v-if="pvzDelivery && pvzDelivery.text.length")
              .baloon-item-label Условия доставки
              .baloon-item-text 
                span(v-html="pvzDelivery.text")
            .baloon-item    
              .btn(@click="baloonClick") Выбрать этот пункт
            .baloon-item
              .baloon-item-text Дополнительная информация

            .baloon-item(v-if="pvzInfo.address_comment.length") 
              .baloon-item-label Комментарии к адресу
              .baloon-item-text {{pvzInfo.address_comment}}

            .baloon-item(v-if="pvzEspeciallyProps") 
              .baloon-item-label Есть:
              .baloon-item-text 
                span(v-for="(p, l) in pvzEspeciallyProps" :key="l") {{ p }}

            .baloon-item(v-if="pvzInfo.note.length") 
              .baloon-item-label Примечание
              .baloon-item-text {{pvzInfo.note}}

</template>

<script>
// import ScrollBar from 'vue2-scrollbar'
  export default {
    // components: { ScrollBar },
    // props: ['balloonComponentProps'],
    // props: {
    //   balloonComponentProps: {
        
    //   }
    // },
        // testMarkerData: {
        //   tmTitle: "Тестовый заголовок",  
        //   tmAddrr: "Тестовый Адрес"  
        // },
    fetch() {
      this.$store.dispatch('pvz/getPvzInfo', this.$attrs.code)
    },
    data() {
      return {
        show: true,
        tmTitle: '',  
        tmAddrr: '',
          

      }
    },
    // mounted() {
    //   console.log('bal: ', this)
    //   // debugger
    //   this.tmTitle = this.$attrs.name
    //   this.tmAddrr = this.$attrs.tmAddrr  
    // },
    computed: {
      pvzInfo() { return this.$store.getters['pvz/pvzInfo']},
      pvzDelivery() { return this.$store.getters['pvz/pvzDeliveryInfo']},
      workTimeArr() { return this.pvzInfo.work_time.split(',').map(s => s.trim()) || null },
      nearestStation() { 
        return this.pvzInfo.nearest_station.length 
          ? this.pvzInfo.nearest_station.split(',').map(s => s.trim()) : null 
      },
      nearestMetro() { 
        return this.pvzInfo.nearest_metro_station.length 
          ? this.pvzInfo.nearest_metro_station.split(',').map(s => s.trim()) : null 
      },
      pvzEspeciallyProps() { 
        const arr=[]
        if (this.pvzInfo.is_dressing_room) arr.push('Примерочная')
        if (this.pvzInfo.have_cash) arr.push('Оплата наличными')
        if (this.pvzInfo.have_cashless) arr.push('Оплата по терминалу')
        return arr.length ? arr : null
      },

    },
    methods: {
      baloonClick(e) {
        // const props = {title: this.$root.title, ardr: this.$root.address}
        // const props = this.balloonComponentProps
        // console.log('balloonClick: ',this.$attrs.marker )
        // this.show = false
        this.$emit('balloon-click', this.pvzInfo.code )

        // debugger
      }
    }
  }
</script>

<style lang="scss">
  @import 'yamap-baloon.scss';

.vb > .vb-dragger {
    --vb-scroll-width: 5px;
    z-index: 5;
    // width: 5px;
    width: calc(2*var(--vb-scroll-width));
    right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0,0,0,0);
    transform: rotate3d(0,0,0,0);
    -webkit-transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    transition:
        background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
    // background-color: rgba(48, 121, 244,.1);
    background-color: var(--scrollbar-track-drag);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    // background-color: rgba(48, 121, 244,.3);
    background-color: var(--scrollbar-track-drag-active);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
    // background-color: rgba(48, 121, 244,.5);
    background-color: var(--scrollbar-track-drag-hover);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    // background-color: rgba(48, 121, 244,.5);
    background-color: var(--scrollbar-track-drag-hover);
    margin: 0px;
    height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    // background-color: rgba(48, 121, 244,.5);
    background-color: var(--scrollbar-track-drag-hover);
}
</style>