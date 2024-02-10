<template>
    <div class="modal">
        <div class="modal-icon">
            <i v-if="type == 'success'" class="fas fa-check-circle"></i>
            <i v-else-if="type == 'error'" class="fas fa-exclamation-circle"></i>
            <i v-else class="fas fa-question-circle"></i>
        </div>
        <div class="modal-headding">
            <h2 v-if="type == 'success'" class="modal-heading">{{ $t('global.success') }}</h2>
            <h2 v-else-if="type == 'error'" class="modal-heading">{{ $t('global.error') }}</h2>
        </div>
        <div class="modal-content">
            <p>{{content}}</p>
        </div>
        <button @click="this.$emit('closeModal')" class="btn btn-primary">OK</button>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        type: String,
        content: String
    }
}
</script>

<style>

</style>