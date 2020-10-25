<template>
  <div id="newcontainer">
    <Header v-if="isOnHomePage()"></Header>
    <Description v-if="isOnHomePage()" class="description"></Description>
    <h1 align="center" v-if="isOnHomePage()">Zan-ge!</h1>
    <br>
    <v-row>
        <v-col align="center">
          <v-btn @click="makeChatroom" v-if="isOnHomePage()"
          color="#191970" class="white--text" large>神父になる
          </v-btn>
        </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <v-btn @click="visitChatroom" v-if="isOnHomePage()"
        color="#191970" class="white--text" large>懺悔をする</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col align="center">
        <div v-if="!loadingFlg && !photoURL" class="heart_loading">
          <Loading/>
        </div>
        <div v-else-if="isOnHomePage()">
            <span class="heart">❤︎</span>
          {{ userReviewVal }}
        </div>
      </v-col>
    </v-row>
    <br>
    <div id="chapel" align="center" v-if="isOnHomePage()">
      <img src="@/assets/イラスト.png">
    </div>
    <div align="center" v-show="loading">
      <Loading class="main_loading"></Loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import common from '@/common.js'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import Description from '@/components/Description'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {  
  name: "HomePage",
  data: () => ({
    loading: false,
    trycount: 10,
  }),
  computed: {
    ...mapGetters(['uid','userReviewVal','loadingFlg','photoURL'])
  },
  components: {
    Loading,
    Header,
    Description,
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
      targetTime.setMinutes(targetTime.getMinutes() + 5); //5分後に終了
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
      let roomid = "";
      async function delay(ms){
        return await new Promise(resolve => setTimeout(resolve,ms));
      }
      //マッチング処理
      let match = async() => {
        await delay(1000);
      //名前順に並び替えて1つのチャットルームIDを取得＆マッチング処理
        this.$db.where("status", "==", "pending")
        .orderBy('roomID')
        .limit(1)
        .get()
          .then((querySnapshot) => {
            let catchdata = querySnapshot.docs[0] //ない場合はundefined
            if (catchdata) {
              roomid = catchdata.data().roomID
              //取得したチャットルームのメンバーに追加
              this.$db.doc(roomid).update({
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
#newcontainer {
  padding: 1%;
  margin: 0%;
  width: 100%;
  height: 100%;
  background-color: #dfdddd;
}

.heart {
  color: red;
}
h1 {
  font-family: sans-serif;
  font-size: 300%;
  margin: 5%;
  color: #2a6f8f;
}

.description {
  position: fixed;
  margin-left: 1.2%;
  top: 1.3%;
  width: 25%;
  height: 200%;
  z-index: 1;
}

.heart_loading {
  height: 5%; 
  width: 5%;
}
.main_loading {
  height: 20%; 
  width: 20%;
}

#chapel img {
  width: 20%;
  height: 20%;
  border-radius: 0%;
  margin-top: 3%;
}

</style>