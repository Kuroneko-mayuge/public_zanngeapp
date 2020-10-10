import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    host_flg: false
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user
    },
    deleteLoginUser (state) {
      state.login_user = null
    },
    setHostFlg (state, isHost) {
      state.host_flg = isHost
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
    logout () {
      firebase.auth().signOut()
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    setHostFlg ({ commit }, isHost) {
      commit('setHostFlg', isHost)
    }
  },
  modules: {
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : 'Ryo',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid: Math.random().toString(34).substring(4),
    hostFlg: state => state.host_flg
  }
})
