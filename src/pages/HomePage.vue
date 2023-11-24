<script setup>
import { reactive, ref, watch } from 'vue';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import ApartmentsList from '@/components/apartment/ApartmentsList.vue';


//*** ROUTER PROPS ***//
const props = defineProps({
    isScrollEnd: {
        type: Boolean,
        default: false
    }
});


//*** GENERAL ***//
// Data
const isLoading = ref(false);


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

// Fetch Random List
fetchApartments(`/random?page=${currentRandomPage}&rand_seed=${rand_seed}`, res => {
    apartmentsRandom.push(...res.data.data);
    lastRandomPage.value = res.data.last_page;
});

// Infinite scroll watcher
watch(() => props.isScrollEnd, () => {

    // Infinite scroll logic
    if (props.isScrollEnd && currentRandomPage.value < lastRandomPage.value && !isLoading.value) {

        currentRandomPage.value++

        // Call api for another 10 apartments
        fetchApartments(`/random?page=${currentRandomPage.value}&rand_seed=${rand_seed}`, res => {
            apartmentsRandom.push(...res.data.data);
        });
    }
});

</script>


<template>
    <div class="container">

        <!-- Promoted Appartments -->
        <ApartmentsList v-if="apartmentsPromoted.length" :apartments="apartmentsPromoted"
            infoMessage="I boolbnb in evidenza sono consigliati dal nostro team!" title="Boolbnb in evidenza" />

        <!-- Random Appartments -->
        <ApartmentsList :apartments="apartmentsRandom" title="I nostri boolbnb"
            infoMessage="I boolbnb vengono mostrati in ordine casuale" :isLoading="isLoading" />
    </div>
</template>