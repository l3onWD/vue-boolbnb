<script>
export default {


}
</script>


<template>
    <RouterLink :to="{ name: 'home' }" class="logo">
        <!-- Logo -->
        <img src="@/assets/img/logo.png" alt="logo">

        <!-- Brand -->
        <h1 class="d-none d-xl-inline-block">boolbnb</h1>

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
        @include font(700, 25px, $color: $brand-color, $spacing: -1px);
    }
}
</style>