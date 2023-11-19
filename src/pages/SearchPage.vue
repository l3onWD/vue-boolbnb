<script>
import AppLoader from '@/components/AppLoader.vue';
import SearchFilters from '@/components/search/SearchFilters.vue';
import ApartmentsList from '@/components/apartment/ApartmentsList.vue';

import { apiClient } from '@/http/';


export default {
    components: { SearchFilters, ApartmentsList, AppLoader },

    data: () => ({
        apartments: [],
        isLoading: true,
        errorMessage: '',
        address: ''
    }),

    watch: {
        '$route.query': {
            handler(newQuery) {
                this.fetchApartments();
            }
        }
    },

    methods: {
        fetchApartments() {

            this.isLoading = true;
            this.errorMessage = '';

            // Get query
            const params = this.$route.query;
            this.address = this.$route.query.address


            // Call API
            apiClient.get('apartments/filter', { params })
                .then(res => {
                    this.apartments = res.data;
                })
                .catch(err => {
                    console.error(err.response.data);
                    const status = err.response.status;

                    if (status === 400) {
                        this.errorMessage = 'Inserisci un indirizzo valido.';
                    } else {
                        this.errorMessage = `Errore ${status}`;
                    }
                })
                .then(() => {
                    this.isLoading = false;
                });
        }
    },
    created() {
        this.fetchApartments();
    }
}
</script>

<template>
    <main>

        <!-- Filters -->
        <div class="search-filters">
            <SearchFilters />
        </div>

        <!-- Page Cotent -->
        <div v-if="!isLoading">

            <!-- Error Message -->
            <div v-if="errorMessage" class="container">
                <h4 class="text-danger text-center mt-5">{{ errorMessage }}</h4>
            </div>

            <!-- Apartments -->
            <ApartmentsList v-else :apartments="apartments" :title="`Risultati in questa località: ${address}`"
                infoMessage="Vengono visualizzati per primi i boolbnb consigliati dal nostro team" />
        </div>
    </main>

    <!-- Loader -->
    <AppLoader :is-loading="isLoading" />
</template>

<style scoped>
.search-filters {
    position: sticky;
    top: 0;
    z-index: 1;
}
</style>