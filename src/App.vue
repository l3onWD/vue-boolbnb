<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';

//*** COMPONENTS ***/
import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import TheBackTopButton from '@/components/base/TheBackTopButton.vue';


//*** SCROLL HANDLING ***//
// Data
const pageContent = ref(null);
const scrollThrottling = ref(false);

// Functions
const handleScroll = () => {

    // Scroll Throttling
    if (!scrollThrottling.value) {

        window.requestAnimationFrame(() => {

            // Update Scroll End
            updateScrollEnd();

            // Back top visibility logic
            handleBackTopVisibility();

            scrollThrottling.value = false;
        });

        scrollThrottling.value = true;
    }

}

// Lifehooks
onMounted(() => {
    pageContent.value.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    pageContent.value.removeEventListener('scroll', handleScroll);
});


//*** SCROLL END UPDATE ***//
// Data
const isScrollEnd = ref(false);
const scrollTollerance = 10;


// Functions
const updateScrollEnd = () => {
    const scrollTop = pageContent.value.scrollTop;
    const scrollBottom = scrollTop + pageContent.value.getBoundingClientRect().height;
    const scrollTotalHeight = pageContent.value.scrollHeight;

    isScrollEnd.value = (scrollTotalHeight - scrollBottom) <= scrollTollerance;
}


//*** BACK TOP BUTTON ***//
// Data
const backTopVisibilityThreshold = 200;
const isBackTopVisible = ref(false);


// Functions
const handleBackTopVisibility = () => {
    if (pageContent.value.scrollTop >= backTopVisibilityThreshold) isBackTopVisible.value = true;
    else isBackTopVisible.value = false;
}

const backTop = () => {
    pageContent.value.scrollTop = 0;
}

</script>


<template>
    <!-- Header -->
    <AppHeader />

    <!-- Pages Content -->
    <main ref="pageContent">

        <!-- Pages -->
        <RouterView :is-scroll-end="isScrollEnd" />

        <!-- Back-top-button -->
        <TheBackTopButton :isVisible="isBackTopVisible" @@back-top="backTop" />
    </main>

    <!-- Footer -->
    <AppFooter />
</template>


<style lang="scss">
@use '@/assets/scss/style.scss';
</style>
