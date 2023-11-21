<script setup>
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import TheBackTopButton from '@/components/base/TheBackTopButton.vue';
import ApartmentsList from '@/components/apartment/ApartmentsList.vue';


//*** GENERAL ***//
// Data
const isLoading = ref(false);
const mainContent = ref(null);
const scrollThrottling = ref(false);

// Functions
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

            // Random List Infinite Scroll
            handleInfiniteScroll()


            // Back top visibility logic
            handleBackTopVisibility();


            scrollThrottling.value = false;
        });

        scrollThrottling.value = true;
    }

}

// Lifehooks
onMounted(() => {
    mainContent.value.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    mainContent.value.removeEventListener('scroll', handleScroll);
});



//*** PROMOTED APARTMENTS ***//
// Data
const apartmentsPromoted = reactive([]);

// Fetch Promoted List
fetchApartments('/promoted', res => {
    apartmentsPromoted.push(...res.data);
});



//*** RANDOM APARTMENTS ***//
// Data
const rand_seed = Math.random();
const apartmentsRandom = reactive([]);
const currentRandomPage = ref(1);
const lastRandomPage = ref(null);
const scrollTollerance = 10;

// Functions
const handleInfiniteScroll = () => {
    const scrollTop = mainContent.value.scrollTop;
    const scrollBottom = scrollTop + mainContent.value.getBoundingClientRect().height;
    const scrollTotalHeight = mainContent.value.scrollHeight;

    const isBottomReached = (scrollTotalHeight - scrollBottom) <= scrollTollerance;


    // Infinite scroll logic
    if (currentRandomPage.value < lastRandomPage.value && isBottomReached && !isLoading.value) {

        currentRandomPage.value++

        // Call api for another 10 apartments
        fetchApartments(`/random?page=${currentRandomPage.value}&rand_seed=${rand_seed}`, res => {
            apartmentsRandom.push(...res.data.data);
        });
    }
}

// Fetch Random List
fetchApartments(`/random?page=${currentRandomPage}&rand_seed=${rand_seed}`, res => {
    apartmentsRandom.push(...res.data.data);
    lastRandomPage.value = res.data.last_page;
});



//*** BACK TOP BUTTON ***//
// Data
const backTopVisibilityThreshold = 200;
const isBackTopVisible = ref(false);

// Functions
const handleBackTopVisibility = () => {
    if (mainContent.value.scrollTop >= backTopVisibilityThreshold) isBackTopVisible.value = true;
    else isBackTopVisible.value = false;
}

const backTop = () => {
    mainContent.value.scrollTop = 0;
}

</script>


<template>
    <main ref="mainContent">

        <div class="container">

            <!-- Promoted Appartments -->
            <ApartmentsList v-if="apartmentsPromoted.length" :apartments="apartmentsPromoted"
                infoMessage="I boolbnb in evidenza sono consigliati dal nostro team!" title="Boolbnb in evidenza" />

            <!-- Random Appartments -->
            <ApartmentsList :apartments="apartmentsRandom" title="I nostri boolbnb"
                infoMessage="I boolbnb vengono mostrati in ordine casuale" :isLoading="isLoading" />
        </div>

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