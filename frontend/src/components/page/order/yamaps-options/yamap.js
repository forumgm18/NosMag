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
        },
        zoom: 10,
        coords: [54, 39],
        controls: ['zoomControl', 'fullscreenControl'],
      }
export default yamap
