<template>
  <header>
    <div v-if="photoURL" align="right">
      <img v-if="photoURL" :src="photoURL" @click="logout">
    </div>
    <div v-else-if="displayBtnFlg" align="right">
      <v-btn color="#191970" class="white--text" @click="login">ログイン</v-btn>
    </div>
    <div v-else class="loading">
      <Loading/>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import Loading from '@/components/Loading'
export default {
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setLoginUser(user)
        this.setDisplayBtnFlg(false)
      } else {
        this.deleteLoginUser()
        this.setDisplayBtnFlg(true)
      }
    })
  },
  components: {
    Loading
  },
  methods: {
    ...mapActions(['login','setLoginUser', 'logout', 'deleteLoginUser','setDisplayBtnFlg'])
  },
  computed: {
    ...mapGetters(['photoURL','displayBtnFlg'])
  }
}
</script>

<style>
img {
    -webkit-background-size: 32px 32px;
    background-size: 32px 32px;
    border: 0;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    display: block;
    margin: 0;
    position: relative;
    height: 32px;
    width: 32px;
    z-index: 0;
}
.loading{
    position:absolute;
    right:10px;
    top:10px;
    height: 32px;
    width: 32px;
}
</style>