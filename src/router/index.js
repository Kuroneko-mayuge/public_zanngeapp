import Vue from 'vue'
import VueRouter from 'vue-router'
import Chatroom from '../views/Chatroom.vue'
import firebase from 'firebase'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/chatroom/:roomID',
    name: 'chatroom',
    component: Chatroom,
    // ルート遷移が起きる前に、メンバーが二人以上いないか確認
    beforeEnter: function(to,from,next){
      const nextDoc = firebase.firestore().collection('chatroom').doc(to.params.roomID);
      nextDoc.get()
      .then((doc) => {
        if(store.getters.hostFlg) {
          next()
        }
        else {
          if(doc.data().member.visitor === store.getters.uid){
            next()
          }else{
            alert("マッチングエラー")
            next('/');
          }
        }
      })
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
