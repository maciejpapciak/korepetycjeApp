<template>
    <div class="wrapper ranking">
        <h1 class="ranking-heading">{{ $t('ranking.rankingHeading') }}</h1>
        <ul class="ranking-list">
            <li v-for="(user, index) in rankingList" :key="user.user_id" class="ranking-list__item">
                <UserBox
                    :nickname="user.nickname"
                    :userId="user.user_id"
                    :avatar="user.avatar"
                    :rating="user.Rating.toFixed(2)"
                    :placement="index+1"
                />
            </li>
        </ul>
    </div>
</template>

<script>
import UserBox from '@/components/UserBox.vue';
import {mapState} from 'vuex';

export default {
    name: 'Ranking',
    components: {
        UserBox
    },
    async created() {
        this.$store.dispatch('ranking/fetchRanking');
    },
    computed: {
        ...mapState('ranking',[
            'rankingList',
        ])
    }
}
</script>
