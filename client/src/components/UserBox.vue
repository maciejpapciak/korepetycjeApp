<template>
  <router-link :to="`/profile/${userId}`" class="ranking-list__link">
    <div class="user-box__avatar">
        <span class="placement-number">{{ placement }}</span>
        <Avatar :avatarUrl="avatar" size=5 />
    </div>
    <div class="user-box__data">
        <h3 class="user-box__nickname">{{ nickname }}</h3>
        <div class="rating-container">
            <Rating :rating="rating" size=1 />
            <span>{{ $t('user.rating') }}: {{rating}}</span>
        </div>
    </div>
  </router-link>
</template>

<script>
import Avatar from "@/components/Avatar.vue";
import UserData from "@/components/UserData.vue";
import Rating from "@/components/Rating.vue";

export default {
    name: 'UserBox',
    components: {
        Avatar,
        UserData,
        Rating
    },
    props: {
        avatar: String,
        nickname: String,
        rating: Number,
        placement: Number,
        userId: Number
    }
}
</script>