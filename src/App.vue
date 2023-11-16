<script>
import { store } from '@/js/store.js';

//*** COMPONENTS ***/
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';

export default {

    components: { AppHeader, AppFooter },

    data() {
        return {
            store: store,

        }
    },
    methods: {

        hide() {
            this.store.show = false;
        }
    }
} 
</script>

<template>
    <div @click="hide">
        <!-- Header -->
        <AppHeader />

        <!-- Pages Content -->
        <RouterView />

        <!-- Footer -->
        <AppFooter />

    </div>
</template>

<style lang="scss">
@use '@/assets/scss/style.scss';
</style>
