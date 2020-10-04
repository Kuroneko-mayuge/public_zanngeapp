<template>
  <v-container fluid>
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
    <Loading v-show="loading"></Loading>
    <router-view></router-view>
  </v-container>
</template>

<script>
import firebase from 'firebase'
import Loading from '@/components/Loading'
export default {
  name: "HomePage",
  data: () => ({
    member: ["Ryo2"],//ログインユーザー名
    loading: false,
    trycount: 10,
  }),
  components: {
    Loading
  },
  methods: {
    isOnHomePage: function(){
      if (this.$route.fullPath === '/' && this.loading === false){
        return true;
      }
    },
    makeChatroom: function(){
      this.loading = true;
      const roomRef =  firebase.firestore().collection('chatroom');
      const roomid = Math.random().toString(34).substring(4); //ランダムにルームIDを生成
      //firestoreにチャットルームを登録
      roomRef.doc(roomid).set({
        roomID:roomid,
        member: this.member,
        status: "pending"
        })
      //ms秒止まる
      async function delay(ms){
        return await new Promise(resolve => setTimeout(resolve,ms));
      }
     //マッチング処理
      let match = async() => {
        await delay(1000);
        roomRef.doc(roomid).get()
        .then((doc) => {
          let catchdata = (doc.data().member).length;
          if (catchdata === 2){
            this.loading = false;
            alert("マッチング成功！")
            this.$router.push({name:'chatroom', params: { roomID: roomid }})
          }
          else if (this.trycount > 0){
            this.trycount -= 1;
            match();
          }
          else{
            roomRef.doc(roomid).delete()
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
                alert("マッチング成功！")
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