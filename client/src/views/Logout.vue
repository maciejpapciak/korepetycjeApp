<template>
  
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'Logout',
    methods: {
        ...mapActions('auth', [
            'logout'
        ])
    },
    created() {
        this.logout();
    }
}
</script>

<style>

</style>