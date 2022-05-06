const yamap = {
  settings: {
    // apiKey: this.yandexApiKey || '',
    apiKey: '',
    lang: 'ru_RU',
    coordorder: 'latlong',
    enterprise: false,
    version: '2.1',
  },
  options: {
    suppressMapOpenBlock: true,
    searchControlProvider: 'yandex#search',
    fullscreenControlFloat: 'none',
    fullscreenControlPosition: {top: 50, left: 10},
  },
  zoom: 16,
  coords: [54, 39],
  // controls: ['zoomControl', 'fullscreenControl', 'searchControl'],
  controls: ['zoomControl', 'fullscreenControl'],
}
export default yamap
