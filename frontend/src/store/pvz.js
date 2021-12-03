export const state = () => ({
  city_id: null,
  city_name: null,
  pvzs: null,
  selectedPvz: null,
})

export const mutations = {
  setPvzList(state, val) {
    state.city_id = val.city_id
    state.city_name = val.city_name
    state.pvzs = val.pvzs
  },
  setPvzInfo(state, val) {
    state.selectedPvz = val
  },
}

export const actions = {
  async getPvzList({ commit, rootState }, pvzParams) {
    // console.log('pvzParams: ', pvzParams)
    const c = await this.$axios.$get(`/get_pvz_list`, {
      params: {
        ...pvzParams,
        session_id: rootState.token.session_id
      }
    })
    commit('setPvzList', c)
  },
  async getPvzInfo({ commit, rootState }, codePvz) {
    // console.log('pvzParams: ', pvzParams)
    const c = await this.$axios.$get(`/get_pvz_info`, {
      params: {
        code: codePvz,
        session_id: rootState.token.session_id
      }
    })

    c.pvz.phones = JSON.parse(c.pvz.phones)
    // Преобразуем строковые числа в числа
    const content = JSON.parse(JSON.stringify(c),function (key, value) {
      if (value === (+value).toString()) return +value
      return value
    } )
   
    commit('setPvzInfo', content)
  },
  async setPvz({ commit, rootState }, codePvz) {
    const c = await this.$axios.$post(`/set_pvz`, {
        pvz_code: codePvz,
        session_id: rootState.token.session_id
    })

    c.pvz.phones = JSON.parse(c.pvz.phones)
    // Преобразуем строковые числа в числа
    const content = JSON.parse(JSON.stringify(c),function (key, value) {
      if (value === (+value).toString()) return +value
      return value
    } )
   
    commit('setPvzInfo', content)
  },





}
export const getters = {
  pvzList: s => { 
    // let res = null
    if (s.pvzs) {
      return s.pvzs.map(pvz => {
        return {
          id: pvz.id,
          coord: [+pvz.location_latitude, +pvz.location_longitude],
          data: {
            active: pvz.active,
            code: pvz.code,
            name: pvz.name,
          }
        }
      })
    } else {
      return null
    }
    // return res
  },
  pvzInfoAll: s => s.selectedPvz,
  pvzInfo: s => {
    if ( s.selectedPvz && s.selectedPvz.pvz ) {
      const pvz = s.selectedPvz.pvz
      return { 
        name: pvz.name,
        code: pvz.code,
        phones: pvz.phones,
        email: pvz.email,
        note: pvz.note,
        location_address: pvz.location_address,
        location_postal_code: pvz.location_postal_code,
        address_comment: pvz.address_comment,
        nearest_station: pvz.nearest_station,
        nearest_metro_station: pvz.nearest_metro_station,
        owner_code: pvz.owner_code,
        work_time: pvz.work_time,
        is_dressing_room: pvz.is_dressing_room,
        is_handout: pvz.is_handout,
        take_only: pvz.take_only,
      } 
    } else {
      return null
    }
    
  },
  pvzDeliveryInfo: s => s.selectedPvz.delivery || null,

}
