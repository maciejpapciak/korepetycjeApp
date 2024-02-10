<template>
  <ul class="page">
    <li v-if="currentPage-1 != 0" @click="$emit('setPage', currentPage-1)" class="page__btn"><i class="fas fa-angle-left"></i></li>
    <li @click="$emit('setPage', page)" :key="page" v-for="page in (totalPages-1)" class="page__numbers" :class="{'active': page == currentPage}">
        {{page}}
    </li>
    <li v-if="currentPage != totalPages-1" @click="$emit('setPage', currentPage+1)" class="page__btn"><i class="fas fa-angle-right"></i></li>
  </ul>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
      currentPage: Number,
      totalPages: Number
    }
}
</script>