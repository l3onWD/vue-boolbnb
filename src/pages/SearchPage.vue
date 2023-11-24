<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
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

</script>


<template>
    <!-- Filters -->
    <div class="filters-bar-container">
        <FiltersBar />
    </div>

    <!-- Page Cotent -->
    <div class="container" v-bind="$attrs">

        <!-- Error Message -->
        <div v-if="!isLoading && errorMessage" class="mt-5">
            <h4 class="text-danger text-center">{{ errorMessage }}</h4>
        </div>

        <!-- Apartments -->
        <ApartmentsList :apartments="apartments" :title="`Risultati in questa località: ${address}`"
            infoMessage="Vengono visualizzati per primi i boolbnb consigliati dal nostro team" :isLoading="isLoading" />
    </div>
</template>


<style scoped>
.filters-bar-container {
    position: sticky;
    top: 0;
    z-index: 1;
}
</style>