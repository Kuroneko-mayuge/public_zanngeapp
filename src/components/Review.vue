<template>
  <v-container>
    評価してください！
    <Rating></Rating>
  </v-container>
</template>

<script>
import Rating from '@/components/StarRating'
export default {
  name: "Review",
  components: {
    Rating
  },
}
</script>