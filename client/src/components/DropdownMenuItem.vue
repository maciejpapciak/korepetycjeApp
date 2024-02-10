<template>
    <li class="dropdown__menu-item">
        <router-link :to="linkTo" class="dropdown__menu-link" :title="name">
            <div class="dropdown__menu-svg">
                <i :class="icon"></i>
            </div>
            <div class="dropdown__menu-text">{{ name }}</div>
        </router-link>
    </li>
</template>

<script>
export default {
    name: 'DropdownMenuItem',
    props: {
        icon: String,
        linkTo: String,
        name: String
    }
}
</script>