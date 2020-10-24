import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login_user: null,
    host_flg: false,
    login_reviewVal: null,
    login_flg: false,
    loading_flg: false,
    boardText: null
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
    },
    setLoginFlg (state, isLogin) {
      state.login_flg = isLogin
    },
    setloadingFlg (state, isBtn) {
      state.loading_flg = isBtn
    },
    setboardText(state, boardDate){
      state.boardText = boardDate;
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
    logout ({ commit }) {
      firebase.auth().signOut()
      commit('setloadingFlg', true)
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    setHostFlg ({ commit }, isHost) {
      commit('setHostFlg', isHost)
    },
    setloadingFlg ({ commit }, isBtn) {
      commit('setloadingFlg', isBtn)
    },
    setboardText_action({ commit }){
      const boarddb = firebase.firestore().collection('board');
      const getbordDate = []
      boarddb.get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function(doc){
          const catchdata = doc.data();
          getbordDate.push(catchdata);
          commit('setboardText', getbordDate);
        });
      })
    }
  },
  modules: {
  },
  getters: {
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid: Math.random().toString(34).substring(4),
    hostFlg: state => state.host_flg,
    userReviewVal: state => state.login_reviewVal,
    loadingFlg: state => state.loading_flg,
    boardText: state => state.boardText
  }
})
