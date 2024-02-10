<template>
  <div class="user-data">
    <h1>{{userName}}</h1>
    <h2>{{email}}</h2>
    <Rating v-if="rating > 0" :size=2 :rating=rating />
    <h3 v-show="phoneNumber != null"><i class="fas fa-phone-alt"></i> {{phoneNumber}}</h3>
  </div>
</template>

<script>
import Rating from "@/components/Rating.vue";

export default {
  name: "UserData",
  components: {
    Rating
  },
  props: {
    userName: String,
    rating: Number,
    email: String,
    phoneNumber: String,
  }
};
</script>