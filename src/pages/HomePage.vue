<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import TheBackTopButton from '@/components/base/TheBackTopButton.vue';
import ApartmentsList from '@/components/apartment/ApartmentsList.vue';


//*** SETTINGS ***//
const scrollTollerance = 10;
const backTopVisibilityThreshold = 200;


//*** DATA ***//
const apartmentsPromoted = reactive([]);
const apartmentsRandom = reactive([]);
const currentPage = ref(1);
const lastPage = ref(null);

const isBackTopVisible = ref(false);

const isLoading = ref(false);
const scrollThrottling = ref(false);
const mainContent = ref(null);


//*** FUNCTIONS ***//
const fetchApartments = (endpoint = '', successCallback) => {

    isLoading.value = true;

    apiClient.get('/apartments' + endpoint)
        .then(successCallback)
        .catch(err => {
            console.error(err);
        })
        .then(() => {
            isLoading.value = false;
        });
}

const handleScroll = () => {

    // Scroll Throttling
    if (!scrollThrottling.value) {

        window.requestAnimationFrame(() => {

            // Element sroll data
            const scrollTop = mainContent.value.scrollTop;
            const scrollBottom = scrollTop + mainContent.value.getBoundingClientRect().height;
            const scrollTotalHeight = mainContent.value.scrollHeight;

            const isBottomReached = (scrollTotalHeight - scrollBottom) <= scrollTollerance;


            // Infinite scroll logic
            if (currentPage.value < lastPage.value && isBottomReached && !isLoading.value) {

                currentPage.value++

                // Call api for another 10 apartments
                fetchApartments(`/random?page=${currentPage.value}&rand_seed=${rand_seed}`, res => {
                    apartmentsRandom.push(...res.data.data);
                });
            }


            // Back top visibility logic
            if (scrollTop >= backTopVisibilityThreshold) isBackTopVisible.value = true;
            else isBackTopVisible.value = false;


            scrollThrottling.value = false;
        });

        scrollThrottling.value = true;
    }

}

const backTop = () => {
    mainContent.value.scrollTop = 0;
}



//*** LOGIC ***//
// Fetch Promoted List
fetchApartments('/promoted', res => {
    apartmentsPromoted.push(...res.data);
});

// Fetch Random List
const rand_seed = Math.random();
fetchApartments(`/random?page=${currentPage}&rand_seed=${rand_seed}`, res => {
    apartmentsRandom.push(...res.data.data);
    lastPage.value = res.data.last_page;
});

onMounted(() => {
    mainContent.value.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    mainContent.value.removeEventListener('scroll', handleScroll);
})

</script>

<template>
    <main ref="mainContent">

        <!-- Promoted Appartments -->
        <ApartmentsList v-if="apartmentsPromoted.length" :apartments="apartmentsPromoted"
            infoMessage="I boolbnb in evidenza sono consigliati dal nostro team!" title="Boolbnb in evidenza" />

        <!-- Random Appartments -->
        <ApartmentsList :apartments="apartmentsRandom" title="I nostri boolbnb"
            infoMessage="I boolbnb vengono mostrati in ordine casuale" :isLoading="isLoading" />

        <!-- Back-top-button -->
        <TheBackTopButton :isVisible="isBackTopVisible" @@back-top="backTop" />

    </main>
</template>

<style>
main {
    position: relative;

    scroll-behavior: smooth;
}
</style>