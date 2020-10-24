<template>
  <header>
    <div v-if="photoURL" class="flex">
      <span>
        <img :src="photoURL">
      </span>
      <span class="margin">
        <v-btn color="#191970" class="white--text" @click="logout" small>ログアウト</v-btn>
      </span>
    </div>
    <div v-else-if="loadingFlg" align="right" class="margin">
      <v-btn color="#191970" class="white--text" @click="login" small>ログイン</v-btn>
    </div>
    <div v-else class="pos-right">
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
        this.setloadingFlg(false)
      } else {
        this.deleteLoginUser()
        this.setloadingFlg(true)
      }
    })
  },
  components: {
    Loading
  },
  methods: {
    ...mapActions(['login','setLoginUser', 'logout', 'deleteLoginUser','setloadingFlg'])
  },
  computed: {
    ...mapGetters(['photoURL','loadingFlg'])
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
    height: 30px;
    width: 30px;
    z-index: 0;
}
.pos-right {
    float: right;
    height: 32px;
    width: 32px;
}
.pos-right-btn {
    position:absolute;
    right:80px;
    top:10px;
    height: 32px;
    width: 32px;
}

.line-up {
  float: left;
}

.flex {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.margin {
  margin-left: 1%;
  margin-right: 1%;
}
</style>