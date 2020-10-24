<template>
  <div>
    掲示板
    <br>
    <button @click="update">更新</button>
    <br>
    <div v-for="boardtext in boardText" :key="boardtext.id">
    {{ boardtext.time }}:{{ boardtext.text }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  name: 'Board',
  computed: {
    ...mapGetters(['boardText'])
  },
  methods:{
    ...mapActions(['setboardText_action']),
    update: function(){
      this.setboardText_action();
    }
  }
}
</script>