<template>
  <v-container>
    <Header/>
    <v-row>
        <v-col align="center">
          <v-btn @click="makeChatroom" v-if="isOnHomePage()"
          color="blue" class="white--text">チャットルームを作成
          </v-btn>
        </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn @click="visitChatroom" v-if="isOnHomePage()"
        color="blue" class="white--text">チャットルームに参加</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <span class="title">ようこそ {{getMyName}} さん！！！</span>
      </v-col>
    </v-row>
    <Loading v-show="loading"></Loading>
    <router-view></router-view>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
// import { mapGetters } from 'vuex'
export default {
  name: "HomePage",
  data: () => ({
    loading: false,
    trycount: 10,
  }),
  computed: {
    getMyName: function(){
      return this.$store.state.myName;
    }
  },
  components: {
    Loading,
    Header
  },
  methods: {
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
      targetTime.setMinutes(targetTime.getMinutes() + 2);
      targetTime = getStringFromDate(targetTime);
      //日付から文字列に変換する関数
      function getStringFromDate(date) {
        var year_str = date.getFullYear();
        var month_str = 1 + date.getMonth();
        var day_str = date.getDate();
        var hour_str = date.getHours();
        var minute_str = date.getMinutes();
        var second_str = date.getSeconds();
        let format_str = 'YYYY-MM-DD hh:mm:ss';
        format_str = format_str.replace(/YYYY/g, year_str);
        format_str = format_str.replace(/MM/g, month_str);
        format_str = format_str.replace(/DD/g, day_str);
        format_str = format_str.replace(/hh/g, hour_str);
        format_str = format_str.replace(/mm/g, minute_str);
        format_str = format_str.replace(/ss/g, second_str);     
        return format_str;
      }
      //firestoreにチャットルームを登録
      this.$db.doc(roomid).set({
        roomID:roomid,
        member: this.getMyName,
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
          let catchdata = (doc.data().member).length;
          if (catchdata === 2){
            this.loading = false;
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
              if ((catchdata.data().member).length === 1){
                roomid = catchdata.data().roomID
                //取得したチャットルームのメンバーに追加
                roomRef.doc(roomid).update({
                  member: firebase.firestore.FieldValue.arrayUnion("this.member[0]"),
                  status: "useing"
                });
                this.loading = false;
                this.$router.push({name:'chatroom', params: { roomID: roomid }});
              }else{
                this.loading = false;
                alert("マッチングエラー");
              }
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