import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    host_flg: false,
    login_reviewVal: null
  },
  mutations: {
    setLoginUser (state, user) {
      state.login_user = user;
      //ユーザー評価の初期値をfirestoreに登録
      const usersRef = firebase.firestore().collection('users').doc(String(user.uid));
      usersRef.get()
      .then(function(doc){
        if (!doc.exists){
          usersRef.set({
            userID: user.uid,
            reviewVal: 0
          })
        }else{
          state.login_reviewVal = doc.data().reviewVal;
        }
      })
    },
    deleteLoginUser (state) {
      state.login_user = null,
      state.login_reviewVal = null
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
    userName: state => state.login_user ? state.login_user.displayName : '名無し',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid: Math.random().toString(34).substring(4),
    hostFlg: state => state.host_flg,
    userReviewVal: state => state.login_reviewVal
  }
})
