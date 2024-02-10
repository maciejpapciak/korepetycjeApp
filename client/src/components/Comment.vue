<template>
  <div class="comment">
    <label class="comment-description">{{comment}}</label>
    <div class="comment-bottom">
      <Rating :size=1.3 :rating=rating />

      <div class="comment-user-flex">
          <button v-if="this.isSelf" class="btn btn-primary user-data-change comment-user-delete" v-on:click="deleteComment()">Usuń</button>
        <div class="comment-user comment-user-container" v-on:click="navigateToUser()">
          <label class="comment-user-name">{{userName}}</label>
          <Avatar :size=3 :avatarUrl=this.avatar />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Rating from '@/components/Rating.vue';
import Avatar from '@/components/Avatar.vue';
import { mapState } from "vuex";

export default {
  name: "Comment",
   components: {
    Rating,
    Avatar
  },
  computed: {
    ...mapState("auth", ["userData"]),
  },
  props: {
    comment: String,
    rating: Number,
    userId: Number,
    ratingId: Number
  },
  data() {
    return {
      userName: null,
      avatar: null,
      isSelf: false
    }
  },
  methods: {
    async loadUser() {
        const response = await fetch(
          `${process.env.VUE_APP_API_URL}/api/v1/korepetytors/${this.userId}`
        );
        this.isSelf = (Number(this.userId) === Number(this.userData.user_id))
        const data = await response.json();
        var korepetytor = data.data.korepetytor;
        this.userName = korepetytor.name;
        this.avatar = korepetytor.avatar;
    },
    navigateToUser() {
      this.$router.push({path: `/profile/${this.userId}`});
    },
    async deleteComment() {
      const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('JWTtoken')}`
            }
        };
      const response = await fetch(`${process.env.VUE_APP_API_URL}/api/v1/comment/${this.ratingId}`, requestOptions);
      this.$emit('refresh', true);
    }
  },
  async created() {
    this.loadUser();
  },
};
</script>