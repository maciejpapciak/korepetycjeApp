<template>
    <div class="wrapper offer-page">
        <div class="offer">
            <div class="offer-item">
                <div class="offer-title">
                    <h2>{{ this.offer.class_name }}</h2>
                    <h1>{{ this.offer.title }}</h1>
                </div>
                <div class="offer-description">
                    <p>{{ this.offer.content }}</p>
                </div>
                <div class="price-follow">
                    <div class="offer-item-price">
                        {{ this.offer.price }} zł <span>/ {{ this.offer.type_id == 1 ? 'godzina' : 'pakiet' }}</span>
                    </div>
                    <div class="offer-follow followed" v-if="this.followedArray.includes(this.offer.ad_id)" @click="handleFollow(this.offer.ad_id)">
                        <p><i class="fa fa-heart"></i> {{ $t('favorite.unfollow') }}</p>
                    </div>
                    <div class="offer-follow" v-else @click="handleFollow(this.offer.ad_id)">
                        <p><i class="fa fa-heart"></i> {{ $t('favorite.follow') }}</p>
                    </div>
                </div>
            </div>
        </div>
        <router-link :to="`/profile/${this.offer.user_id}`" class="user-info">
            <Avatar :avatarUrl="this.offer.avatar" size=8 />
            <UserData
                :userName="this.offer.nickname"
                :rating="this.offer.Rating"
                :email="this.offer.email"
                :phoneNumber="this.offer.phone_number"
            />
            <p class="view-count">{{ $t('favorite.viewCount') }}{{ this.offer.view_count }}</p>
        </router-link>
    </div>
</template>

<script>
import Avatar from '@/components/Avatar.vue';
import UserData from '@/components/UserData.vue';
import {mapState, mapGetters} from 'vuex';

export default {
    name: 'ViewOffer',
    components: {
        Avatar,
        UserData
    },
    async created() {
        this.$store.dispatch('offer/fetchOffer', this.$route.params.id);
        this.$store.dispatch('follow/fetchFollowed');
    },
    computed: {
        ...mapState('offer', [
            'offer'
        ]),
        ...mapState('follow',[
        'followed'
      ]),
      ...mapGetters('follow', [
        'followedArray'
      ])
    },
    methods: {
        handleFollow(id) {
            console.log(id);
            if (this.followedArray.includes(id)) {
                this.$store.dispatch('follow/handleUnfollow', id);
            }
            else {
                this.$store.dispatch('follow/handleFollow', id);
            }
            //this.$store.dispatch('follow/handleFollow', $event);
        }
    }
    
}
</script>