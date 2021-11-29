<template lang="pug">
  .yamap(id="map")

</template>

<script>
  // import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import { loadYmap } from 'vue-yandex-maps'
  import vYamapBaloon from '~/components/yamap/yamap-baloon/yamap-baloon'
  import Vue from 'vue'
// const VueBalloon = Vue.extend({
//   template: `<div><button @click="updateCount(-1)">-</button>{{ count }}<button @click="updateCount(+1)">+</button><ul><li v-for="i in count">{{ text }}</li></ul></div>`,
//   data: () => ({count: 3,}),
//   methods: {updateCount(change) {this.count = Math.max(0, Math.min(3, this.count + change));},
//   },
// });
const VueBalloon = Vue.extend(vYamapBaloon);

  export default {
    components: {
      // yandexMap, ymapMarker,
      // vYamapBaloon,
    },
    props: {
      markers: {
        type: Array,
        default: null
      },
      coords: {
        type: Array,
        default: null
      },

    },
    data() {
      return {
        // vYamapBaloon: vYamapBaloon,
        yamapSettings: {
          apiKey: this.yandexApiKey || '',
          lang: 'ru_RU',
          coordorder: 'latlong',
          // enterprise: false,
          version: '2.1',
        },
        yamapZoom: 10,
        yamapCoords: [54, 39 ],
        yamapControls: ['zoomControl'],
        markerIcon: {
          iconLayout: 'default#image',
          iconImageHref: 'ym.png',
          iconImageSize: [45, 62],
          iconImageOffset: [-45, -62],
        },
        markerIcon2: {
          iconLayout: 'default#imageWithContent',
          // iconImageHref: 'ym.png',
          iconImageHref: '',
          iconImageSize: [45, 62],
          iconImageOffset: [-45, -62],
        },
        yamaps: null,
        yMap: null,
        selectedMarker: null,
      }    
    },    

    computed: {
      yandexApiKey() {return this.$store.state.settings.yandexApiKey},
      // vYamapBaloon() {return () => import('~/components/yamap/yamap-baloon/yamap-baloon')}
      // vYamapBaloon() {return {vYamapBaloon}}
    },
    async mounted() {
      await loadYmap(this.yamapSettings);
      // console.log(ymaps); // здесь доступен весь функционал ymaps

        console.log('this.coords: ', this.coords)

      this.yMap = ymaps.ready(this.mapInit(this.baloonClick))
    },
    methods: {
    mapInit(baloonClick){
      let vueBalloon = null;
      const VueBalloonLayout = ymaps.templateLayoutFactory.createClass('<div id="vue-balloon"><div>', {
        build() {
          VueBalloonLayout.superclass.build.call(this)
          vueBalloon = new VueBalloon({
            data: () => ({
              title: this.getData().geoObject.properties.get('title'),
              address: this.getData().geoObject.properties.get('address'),
            }),
          }).$mount('#vue-balloon')
          
          vueBalloon.$on('baloon-click', baloonClick)

        },
        // baloonClick(): this.baloonClick(),
        clear() {
          vueBalloon.$destroy();
          vueBalloon = null;
          VueBalloonLayout.superclass.clear.call(this);
        },
      });

      // Создаём макет содержимого.
        const markerIconLayout = ymaps.templateLayoutFactory.createClass(
            '<svg class="icon icon-location in-map {{ options.moreClassesForGodClasses }}"><use href="#icon-location"/></svg>'
        )

      this.yMap = new ymaps.Map('map', {
        center: this.coords,
        zoom: 10,
        controls: ['zoomControl']
      })

      this.markers.forEach(n => {
        const marker = new ymaps.Placemark(n, 
          { // Данные Метки
            title: 'Отделение почтовой связи № 121096',
            address: 'Адрес ПВЗ',
          },
          { // Опции Метки
            ...this.markerIcon2,
            iconContentLayout: markerIconLayout,

            balloonContentLayout: VueBalloonLayout,
            balloonPanelMaxMapArea: 0,
          })
        marker.events
          .add('mouseenter', this.yamapMouseEnter)
          .add('mouseleave', this.yamapMouseLeave)

        this.yMap.geoObjects.add(marker)
      })
            
    },
    baloonClick(val) {
      this.selectedMarker = val
      // debugger
      // this.yMap.balloon.close();
      this.yMap.event.fire('userclose');
    },
    yamapMouseEnter(e) {
      // console.log('enter: ', e.get('target').options)
      // e.get('target').options.set('iconImageHref', 'ym2.png')
      // console.log('e.get(target): ', e)
      // e.get('target').classList.add('icon-mouse-enter')
      e.get('target').options.set('iconMoreClassesForGodClasses', 'icon-mouse-enter')
      },
    yamapMouseLeave(e) {
      // console.log('leave: ', e.get('target').options)
      // e.get('target').options.set('iconImageHref', 'ym.png')
      // e.get('target').classList.remove('icon-mouse-enter')
      e.get('target').options.set('iconMoreClassesForGodClasses', '')

      },
    yamapInit(e) {
      this.yamap = e
    },
    yamapClick(e){
      // debugger
      const coords = e.get('coords')
      // const map = this.yamap.get('map')
      const geo = this.yamap.geoObjects
      console.log('geo: ', geo)
      const options = this.yamap.options
      console.log('options: ', options)


// Создаем геообъект с типом геометрии "Точка".
        const myGeoObject = new this.yamap.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                // coordinates: [55.8, 37.8]
                coordinates: coords
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: 'Я тащусь',
                hintContent: 'Ну давай уже тащи'
            }
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            draggable: true
        })
    // this.yamap.geoObjects.add(myGeoObject)    

    }
    },

  }
</script>

<style lang="scss">
  .in-map{
    font-size: 62px;
    color: var(--base-color1);
    --location-bgr: currentColor;
    --location-dot: #fff; 
    --location-dot-stroke: transparent;

    &.icon-mouse-enter {
      color: var(--base-color2);
      
    }
  }
  ymaps[class$="-balloon__content"] {
    padding: 0!important;;
    margin-right: 0!important;
    }
  ymaps[class$="-balloon__close"] {
    margin: 0!important;
  }
  ymaps[class$="-balloon__close-button"] {
    height: 24px!important;
    width: 24px!important;
    }

</style>