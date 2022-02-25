export default {
  methods: {
      getDeliveryServiceIcon(t) {
        let icn = false
        switch(t) {
          case 'cdek': 
          case 'cdek_pvz': 
          case 'cdek_courier': 
            icn = 'icon-logo-cdek'
            break
          case 'doctavista': 
            icn = 'icon-logo-doctavista'
            break
          case 'ya-go': 
            icn = 'icon-logo-ya-go'
            break
          case 'post': 
          case 'express': 
            icn = 'icon-logo-pochta'
            break
          case 'samovyvoz': 
            icn = 'icon-logo'
            break
        } 
        return icn
      },
      getPaymentsIcon(t) {
        let icn = false
        switch(t) {
          case 'sber': 
            icn = 'icon-visa-mastercard'
            break
          case 'yoomoney': 
            icn = 'icon-yoomoney-pay'
            break
        } 
        return icn
      },
  }
}
