import { createStore } from 'vuex';

export default createStore({
  state: {
    auth: {
      access_token: sessionStorage.getItem('token') || null
    }
  },
  getters: {
    isLoggedIn: state => !!state.auth.access_token,
  },
  mutations: {
    setToken(state, token) {
      state.auth.access_token = token;
      sessionStorage.setItem('token', token);
    },
    clearToken(state) {
      state.auth.access_token = null;
      sessionStorage.removeItem('token');
    }
  },
  actions: {
    login({ commit }, token) {
      commit('setToken', token);
    },
    logout({ commit }) {
      commit('clearToken');
    }
  }
});
