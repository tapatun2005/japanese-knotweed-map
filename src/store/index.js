import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    location: null,
    occurrences: null,
    filters: 'all',
    clickedOccurrances: []
  },
  getters: {
      location(state) {
          return state.location
      },
      occurrences(state) {
        return state.occurrences
      },
      clickedOccurrances(state) {
        return state.clickedOccurrances
      },
      filters(state) {
        return state.filters
      },
  },
  mutations: {
    location(state, data) {
      state.location = data
    },
    occurrences(state, data) {
        state.occurrences = data
    },
    filters(state, data) {
      state.filters = data
    },
    clickedOccurrances(state, data) {
      state.clickedOccurrances = data
    }
  }
})

export default store