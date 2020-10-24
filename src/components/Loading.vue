<template>
  <div>
    <vue-loading 
      type="spiningDubbles"
      color="#aaa"
      :size="{ width: '100%', height: '100%' }"
      >
    </vue-loading>
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'

export default {
  name: 'Loading',
  components: {
    VueLoading,
  },

}
</script>