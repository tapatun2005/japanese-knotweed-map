import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    location: null,
    occurrences: null
  },
  getters: {
      location(state) {
          return state.location
      },
      occurrences(state) {
        return state.occurrences
    }
  },
  mutations: {
    location(state, data) {
      state.location = data
    },
    occurrences(state, data) {
        state.occurrences = data
    }
  }
})

export default store