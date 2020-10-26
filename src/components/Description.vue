<template>
  <div>
    <a @click="viewDescription" class="des_title">このアプリは？</a>
    <div class="des_container" v-if="des_view">
      <h3>
        <br>
        <p>「Zan-ge!」は、</p>
        <p>「誰でもいいから聞いて欲しい」</p>
        <p>「誰の話でもいいから聞いてみたい」</p>
        <p>を繋げるためのアプリです</p>
      </h3>
      <br>
      <h4>
        <p>マッチした場合、常に1対1の、リアルタイムな</p>
        <p>匿名性のコミュニケーションを実現します</p>
      </h4>
      <h4>
        <p>神父になる場合、</p>
        <p>どんな話でも、相手をなるべく受け容れてください</p>
        <p>人は誰でも過ちを犯します</p>
      </h4>
      <h4>
        <p>懺悔をする場合、</p>
        <p>どんな事を話しても問題ありません</p>
        <p>「嘘をついてしまった」「仕事でミスをした」「浮気をした」</p>
        <p>ただ誰かと話したいだけでも結構です</p>
      </h4>
      <h4>
        <p>5分が経つと、強制的に会話は終了します</p>
        <p>最後にあなたは相手を評価できます</p>
        <p>（勿論相手も同じです）</p>
        <p>ログインする事で、あなたの信頼性を確認する事が可能です</p>
      </h4>    
      <h5>
        <p>※このアプリは開発中です</p>
        <p>他の様々な機能を考えていますが、</p>
        <p>開発者のやる気次第で実装します</p>
        <p>このアプリであなたに起きた全ての不都合について</p>
        <p>私が責任を負うことはできかねます</p>
        <p>また、宗教的な意味を持ったものではありませんが</p>
        <p>表現がご不快と思われた方へ、申し訳ございません</p>
        <br>
        <p>ご意見はこちらまで：TsuruRoll20201004@gmail.com</p>
      </h5>
      <div>
        <v-btn color="white" @click="viewDescription">閉じる</v-btn>
        <br>
        <br>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Description',
  data: () => ({
  des_view: false,
  }),
  methods: {
    viewDescription: function(){
      this.des_view = !this.des_view;
    }
  }
}
</script>

<style>
a{
  text-decoration: none;
}

a:hover{
  text-decoration: underline;
}

.des_title {
  width: 250%;
  height: 10%;
  font-size: 12px;
}

.des_container{
  background-color: #5b5b6b;
  color:aliceblue;
  width: 380%;
  margin-left: 0%;
  height: 45%;
  text-align: center;
  opacity: 0.92;
  overflow: scroll;
}

h4{
  margin: 2% 8% 2% 6%;
  padding: 1% 1% 1% 1%;
  font-size: 13px;
}
h5{
  margin: 2% 8% 2% 6%;
  padding: 1% 1% 1% 1%;
  font-size: 11px;
}

</style>