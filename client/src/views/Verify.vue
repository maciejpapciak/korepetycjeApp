<template>
  <div class="wrapper">
      <h2 v-if="this.message.content">{{ this.message.content }}</h2>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
export default {
    name: 'Verify',
    computed: {
        ...mapState('auth',[
        'message',
        'loading'
        ])
    },
    methods: {
        ...mapActions({
            verify: 'auth/verify'
        }),
    },
    async created() {
        this.verify({email: this.$route.params.email, token: this.$route.params.token});
    }
}
</script>