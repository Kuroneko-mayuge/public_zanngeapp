<template>
  <div>
    <vue-loading 
      type="spiningDubbles"
      color="#aaa"
      :size="{ width: '100px', height: '100px' }"
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