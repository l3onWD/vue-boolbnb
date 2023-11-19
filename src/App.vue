<script setup>

//*** COMPONENTS ***/
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

</script>

<template>
    <!-- Header -->
    <AppHeader />

    <!-- Pages Content -->
    <RouterView />

    <!-- Footer -->
    <AppFooter />
</template>

<style lang="scss">
@use '@/assets/scss/style.scss';
</style>
