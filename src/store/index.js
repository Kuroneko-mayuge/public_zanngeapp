import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    myName:["Ryo"],
    login_user: null
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    setMyName (state, displayName) {
      state.myName[0] = displayName
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    deleteMyName (state, displayName) {
      state.myName[0] = displayName
    }
  },
  actions: {
    login(){
      const google_auth_provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(google_auth_provider)
    },
    setLoginUser ({ commit }, user) {
      commit('setLoginUser', user)
    },
    setMyName ({ commit }, user) {
      commit('setMyName', user.displayName)
    },
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    deleteMyName ({ commit }) {
      commit('deleteMyName', 'Ryo')
    }
  },
  modules: {
  },
  getters: {
    userName: state => state.myName[0],
    photoURL: state => state.login_user ? state.login_user.photoURL : ''
  }
})
