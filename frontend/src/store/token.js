export const state = () => ({
  // token: null,
  session_id: '',
  sessionDate: null, // дата установки/обновления session_id
  ttl: 1 // время жизни 1 год
})

export const mutations = {
  setToken (state, value) {
    state.session_id = value.session_id
    state.sessionDate = value.sessionDate
  },
  clearToken (state) {
    state.token = { session_id: '', sessionDate: null, ttl: 1 }
  },
}

export const actions = {
  setNewToken ({ store, commit, rootState }) {
    const tkn = {
      session_id: this.$generateUUID,
      sessionDate: new Date()
    }
    // console.log('tkn: ', tkn)
    commit('setToken', tkn)
    return tkn
  },
  // login ({ commit }) {
  //   commit('setToken', { session_id: generateUUID(), ttl: 60*60*24*30 })
  // },
  // logout ({ commit }) {
  //   commit('clearToken')
  // }
}

export const getters = {
  hasToken: s => !!s.session_id,
  getSessionId: s => s.session_id,
  getSessionDate: s => s.sessionDate,
  getToken: s => {
    return {
      session_id: s.session_id,
      sessionDate: s.sessionDate,
      ttl: s.ttl
    }
  },

}
