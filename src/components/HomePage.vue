<template>
  <v-container>
    <Header v-if="isOnHomePage()"></Header>
    <h1 align="center">ZangeApp</h1>
    <v-row>
        <v-col align="center">
          <v-btn @click="makeChatroom" v-if="isOnHomePage()"
          color="#191970" class="white--text">神父になる
          </v-btn>
        </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn @click="visitChatroom" v-if="isOnHomePage()"
        color="#191970" class="white--text">懺悔をする</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <span v-if="isOnHomePage()" class="title">ようこそ！ {{userName}} さん</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <span v-if="isOnHomePage()">
          <span class="heart">❤︎</span>
        {{ userReviewVal }}
        </span>
      </v-col>
    </v-row>
    <Loading v-show="loading"></Loading>
    <router-view></router-view>
  </v-container>
</template>

<script>
import common from '@/common.js'
import firebase from 'firebase'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {  
  name: "HomePage",
  data: () => ({
    loading: false,
    trycount: 10,
  }),
  computed: {
    ...mapGetters(['userName', 'uid','userReviewVal'])
  },
  components: {
    Loading,
    Header
  },
  methods: {
    ...mapActions(['setHostFlg']),
    isOnHomePage: function(){
      if (this.$route.fullPath === '/' && this.loading === false){
        return true;
      }
    },
    makeChatroom: function(){
      this.loading = true;
      //ランダムにルームIDを生成
      const roomid = Math.random().toString(34).substring(4); 
      //終了時刻を設定
      let targetTime = new Date();
      targetTime.setMinutes(targetTime.getMinutes() + 0.5); //1分後に終了
      targetTime = common.getStringFromDate(targetTime); //firestoreに文字列で日付を登録する

      //firestoreにチャットルームを登録
      this.$db.doc(roomid).set({
        roomID: roomid,
        member: {host: this.uid , visitor: null},
        status: "pending",
        finishTime: targetTime
        })
      //ms秒止まる
      async function delay(ms){
        return await new Promise(resolve => setTimeout(resolve,ms));
      }
     //マッチング処理
      let match = async() => {
        await delay(900);
        this.$db.doc(roomid).get()
        .then((doc) => {
          if (doc.data().member.visitor){
            this.loading = false;
            this.setHostFlg(true)
            this.$router.push({name:'chatroom', params: { roomID: roomid }})
          }
          else if (this.trycount > 0){
            this.trycount -= 1;
            match();
          }
          else{
            this.$db.doc(roomid).delete()
            .then(function(){
            alert("誰もいないみたい！")
            location.href="/";
            });
          }
        })
      }
      match();
    },
    visitChatroom: function(){
      this.loading = true;
      const roomRef =  firebase.firestore().collection('chatroom');
      let roomid = "";
      async function delay(ms){
        return await new Promise(resolve => setTimeout(resolve,ms));
      }
      //マッチング処理
      let match = async() => {
        await delay(1000);
      //名前順に並び替えて1つのチャットルームIDを取得＆マッチング処理
        roomRef.where("status", "==", "pending")
        .orderBy('roomID')
        .limit(1)
        .get()
          .then((querySnapshot) => {
            let catchdata = querySnapshot.docs[0] //ない場合はundefined
            if (catchdata) {
              roomid = catchdata.data().roomID
              //取得したチャットルームのメンバーに追加
              roomRef.doc(roomid).update({
                "member.visitor": this.uid,
                status: "useing"
              });
              this.loading = false;
              this.$router.push({name:'chatroom', params: { roomID: roomid }});
            }else if (this.trycount > 0){
              this.trycount -= 1
              match();
            }else{
              alert("誰もいないみたい！");
              location.href="/";
            }
          })
      }
      match();
    }
  }
}
</script>

<style>
.heart {
  color: red;
}
h1 {
  font-family: "HGP行書体";
  font-size: 400%;
}
</style>