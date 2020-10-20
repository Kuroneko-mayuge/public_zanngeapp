<template>
  <div>
    <!-- チャット部分 -->
    <div class="chat">
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
    ...mapGetters(['uid'])
  },
  components: {
    Review
  },
  methods: {
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
.header {
  position: fixed;
  top: 1%;
}

.review_box {
  position: fixed;
  width: 60%;
  padding: 3%;
  top: 50%;
  margin-left: 19%;
  background: #FFEEFF;
  text-align: center;
}

.chat {
  position: fixed;
  top: 5%;
  margin: 1% 3%;
  width: 95%;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: auto;
}

#mine {
  width: 45%;
  height: 1%;
  margin-right: 5%;
  padding: 1% 15% 1% 1%;
  margin-bottom: 2%;
}
#him {
  width: 45%;
  margin-left: auto;
  margin-right: 5%;
  padding: 1% 15% 1% 1%;
  margin-bottom: 2%;
}

/* チャット入力欄 */
.input_container {
  position: fixed;
  bottom: 5%;
  width: 100%;
  margin: 0;
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