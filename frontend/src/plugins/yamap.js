import Vue from 'vue'
import YmapPlugin from 'vue-yandex-maps'

const settings = {  // настройки плагина
  // apiKey: this.yandexApiKey || '',
  // apiKey: '8bef32ec-1f55-46ac-8d48-6906820e2649',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
}

Vue.use(YmapPlugin, settings);