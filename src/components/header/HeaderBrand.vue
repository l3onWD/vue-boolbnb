<script setup>

//*** BRAND NAME ***/
const appName = import.meta.env.VITE_APP_NAME || 'Brand';

</script>


<template>
    <RouterLink :to="{ name: 'home' }" class="logo">
        <!-- Logo -->
        <img src="@/assets/img/logo.png" alt="logo">

        <!-- Brand -->
        <h1 class="d-none d-xl-inline-block">{{ appName }}</h1>

    </RouterLink>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.logo {
    @include flex;

    img {
        width: 35px;
        margin-right: 5px;
        filter: brightness(0) saturate(100%) invert(36%) sepia(43%) saturate(4027%) hue-rotate(328deg) brightness(99%) contrast(105%);
    }

    h1 {
        @include font(700, 25px, $color: $col-brand, $spacing: -1px);
    }
}
</style>