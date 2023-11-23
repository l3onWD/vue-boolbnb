<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import TheBackTopButton from '@/components/base/TheBackTopButton.vue';
import FiltersBar from '@/components/filters/FiltersBar.vue';
import ApartmentsList from '@/components/apartment/ApartmentsList.vue';


//*** SEARCH APARTMENTS ***//
// Data
const apartments = reactive([]);
const address = ref('');
const errorMessage = ref('');
const isLoading = ref(true);
const route = useRoute();

// Computed
const routeQuery = computed(() => route.query);

// Functions
const fetchApartments = () => {

    isLoading.value = true;
    errorMessage.value = '';
    apartments.splice(0, apartments.length);

    // Get query
    const params = route.query;
    address.value = route.query.address


    // Call API
    apiClient.get('apartments/filter', { params })
        .then(res => {
            apartments.push(...res.data);
        })
        .catch(err => {
            console.error(err.response.data);
            const status = err.response.status;

            if (status === 400) {
                errorMessage.value = 'Inserisci un indirizzo valido.';
            } else {
                errorMessage.value = `Errore ${status}`;
            }
        })
        .then(() => {
            isLoading.value = false;
        });
}

// Watch query cahnges
watch(routeQuery, () => {
    fetchApartments();
}, { immediate: true });



//*** BACK TOP BUTTON ***//
// Data
const backTopVisibilityThreshold = 200;
const isBackTopVisible = ref(false);
const mainContent = ref(null);
const scrollThrottling = ref(false);

// Functions
const handleBackTopVisibility = () => {
    if (mainContent.value.scrollTop >= backTopVisibilityThreshold) isBackTopVisible.value = true;
    else isBackTopVisible.value = false;
}

const backTop = () => {
    mainContent.value.scrollTop = 0;
}

const handleScroll = () => {

    // Scroll Throttling
    if (!scrollThrottling.value) {

        window.requestAnimationFrame(() => {

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

</script>


<template>
    <main ref="mainContent">

        <!-- Filters -->
        <div class="filters-bar-container">
            <FiltersBar />
        </div>

        <!-- Page Cotent -->
        <div class="container">

            <!-- Error Message -->
            <div v-if="!isLoading && errorMessage" class="mt-5">
                <h4 class="text-danger text-center">{{ errorMessage }}</h4>
            </div>

            <!-- Apartments -->
            <ApartmentsList :apartments="apartments" :title="`Risultati in questa località: ${address}`"
                infoMessage="Vengono visualizzati per primi i boolbnb consigliati dal nostro team" :isLoading="isLoading" />
        </div>


        <!-- Back-top-button -->
        <TheBackTopButton :isVisible="isBackTopVisible" @@back-top="backTop" />

    </main>
</template>


<style scoped>
.filters-bar-container {
    position: sticky;
    top: 0;
    z-index: 1;
}
</style>