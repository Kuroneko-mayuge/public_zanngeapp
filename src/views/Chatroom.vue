<template>
  <div>
    <div class="chatbox">
      <a href="#" class="exit" @click="toHome">退出する</a>
      <div class="lasttimebox">{{ computeLasttime }}</div>
    </div>
    <!-- チャット部分 -->
    <div id="chat">
      <div v-for="comment in comments" :key="comment.id">
        <v-card color="#E3F2FD" v-if="comment.userID === uid" id="mine">{{ comment.text }}</v-card>
        <v-card v-else id="him">{{ comment.text }}</v-card>
      </div>
    </div>

    <Review v-if="diffTime < 0" class="review_box"></Review>

    <!-- コメント送信部分 -->
    <div class="input_container" v-if="diffTime > 0">
      <form action="" @submit.prevent="doSend">
        <textarea
          v-model="input"
          class="textlines"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
import Review from '@/components/Review'
import { mapGetters } from 'vuex'
export default {
  name: 'Chatroom',
  data: () => ({
    comments: [],
    input: "",
    reviewTime: "",
    diffTime: "",
  }),
  computed: {
  ...mapGetters(['uid']),
  computeLasttime:function(){
    if(this.diffTime > 0){
      const hour = Math.floor(this.diffTime / 3600000);
      const minute = Math.floor((this.diffTime  - 3600000 * hour) / 60000);
      const mm = ('00' + minute).slice(-2);
      const ms = ('00000' + (this.diffTime  % 60000)).slice(-5);
      const time = `${mm}:${ms.slice(0,2)}`;
      return time;
      }
    else{
      return null;
      }
    }
  },
  components: {
    Review
  },
  methods: {
    toHome(){
      const result = confirm("本当に退出しますか？相手に失礼はありませんか？");
      if(result){
        const roomid = this.$route.params.roomID;
        const messageRef = this.$db.doc(roomid).collection('messages');
        const keyid = Math.floor( Math.random() * (999999 + 1 - 1) ) + 1; //forループのための便宜的なkeyid
        const createdTime = new Date();
        const newItem = { ID:keyid, userID:this.uid, text:"~~退出しました~~", createdAt:createdTime };
        messageRef.add(newItem).then(()=>{location.href="/"});
      }
    },
    //チャット送信処理
    doSend(){
      if (this.input !== ""){
        const roomid = this.$route.params.roomID;
        const messageRef = this.$db.doc(roomid).collection('messages');
        const keyid = Math.floor( Math.random() * (999999 + 1 - 1) ) + 1; //forループのための便宜的なkeyid
        const createdTime = new Date();
        const newItem = { ID:keyid, userID:this.uid, text:this.input, createdAt:createdTime };
        messageRef.add(newItem);
        this.input = "";

        //スクロールを一番下に移動
        const element = document.getElementById("chat");
        element.scrollTop = element.scrollHeight - element.clientHeight - 10;
      }
    },
    //終了時刻と現在時刻の比較
    checkTime(){
      const nowTime = new Date().getTime();
      this.diffTime = this.reviewTime - nowTime;
    }
  },
  created: function() {
    const _this = this;
    const roomid = this.$route.params.roomID;
    //終了時刻を取得
    this.$db.doc(roomid).get()
    .then((doc) => {
      _this.reviewTime = Date.parse((doc.data().finishTime).replace(/-/g, "/"));
    });
    //終了時刻から現在時刻を１秒毎に引く
    if (_this.diffTime >= 0){
      const countDown = setInterval(() => {
        _this.checkTime();
        if(_this.diffTime < 0){
          clearInterval(countDown);
        }}, 1000);
      }
    //チャット更新処理
    const messageRef = this.$db.doc(roomid).collection('messages');
    messageRef.orderBy('createdAt')
    .onSnapshot(function (querySnapshot){
      _this.comments = []
      querySnapshot.forEach(function(doc) {
        const catchdata = doc.data()
        _this.comments.push(catchdata)
      })
    })
  }
}
</script>

<style>
.chatbox {
  position: fixed;
  top:1%;
  width:100%;
  height:5%;
  font-size: 12.5px;
  display: flex;
  justify-content:space-between;
}
.exit {
  width:20%;
  height: 90%;
  margin: 1%;
}
.chatbox a:hover{
  text-decoration: underline;
}

.lasttimebox {
  margin: 1%;
  margin-right: 2%;
}

.review_box {
  position: fixed;
  width: 60%;
  padding: 3%;
  top: 50%;
  margin-left: 17%;
  background: #FFEEFF;
  text-align: center;
}

#chat {
  height: 78%;
  position: fixed;
  top: 6%;
  width: 100%;
  margin-left: 1%;
  font-size: 15px;
  overflow-y: scroll;
  white-space:normal;
}

#mine {
  width: 45%;
  height: 1%;
  margin-right: 5%;
  padding: 1% 15% 1% 1%;
  margin-bottom: 1%;
  white-space: pre-wrap;
}
#him {
  width: 45%;
  margin-left: 48%;
  margin-right: 2%;
  padding: 1% 10% 1% 1%;
  margin-bottom: 1%;
  white-space: pre-wrap;
}

/* チャット入力欄 */
.input_container {
  position: fixed;
  bottom: 5%;
  width: 100%;
  margin-left: 5%;
}

.textlines {
  border: 2px solid #191970;  /* 枠線 */
  border-radius: 0.67em;   /* 角丸 */
  padding: 0.5em;          /* 内側の余白量 */
  background-color: snow;  /* 背景色 */
  width: 70%;             /* 横幅 */
  height: 80%;           /* 高さ */
  font-size: 1em;          /* 文字サイズ */
  line-height: 1.5;        /* 行の高さ */
}
</style>