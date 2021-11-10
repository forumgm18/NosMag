export const state = () => ({
  session_id: '',
})

export const mutations = {
  setSID (state, value) {
    state.session_id = value
  },
  clearSID (state) {
    state.session_id = ''
  },
}

export const actions = {
  setNewSID ({ store, commit, rootState }) {
    commit('setSID', this.$generateUUID)
  },
}

export const getters = {
  hasToken: s => !!s.session_id,
  getSessionId: s => s.session_id,

}
