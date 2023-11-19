<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiClient } from '@/http/';

//*** COMPONENTS ***/
import BaseModal from '@/components/base/BaseModal.vue';



//*** SERVICES ***/
// Data
const servicesList = reactive([]);

// Functions
const fetchServices = () => {

    apiClient.get('/services')
        .then(({ data }) => {
            servicesList.splice(-1);
            servicesList.push(...data);
        })
        .catch(err => {
            console.error(err);
        });

}

// Get services
fetchServices();



//*** FILTERS MODAL ***/
// Data
const filters = reactive({
    rooms: null,
    beds: null,
    radiusKm: 20,
    'services[]': []
});
const isModalVisible = ref(false);
const router = useRouter();
const route = useRoute();

// Compute Filters Count
const filtersCount = computed(() => {

    // Check if route is initialized
    if (!route) return 0;

    // Get data
    const { rooms, beds, radius, 'services[]': services } = route.query;
    let count = 0;

    // Count query params
    if (rooms) count++;
    if (beds) count++;
    if (radius != 20000) count++;
    if (services) count += services.length;

    return count;
});

// Compute Radius in meters (for API)
const radius = computed(() => {
    return parseInt(filters.radiusKm) * 1000;
});


// Functions
const applyFilters = () => {

    // Create query params
    const query = {
        address: route?.query.address,
        lat: route?.query.lat,
        lon: route?.query.lon,
        category: route?.query.category,

        rooms: filters.rooms,
        beds: filters.beds,
        radius: radius.value,
        'services[]': filters['services[]'],
    }

    // Apply query
    router.push({ name: 'search', query });

    // Close modal
    isModalVisible.value = false;
}

const resetFilters = () => {

    // Reset filters to default
    filters.rooms = null;
    filters.beds = null;
    filters.radiusKm = 20;
    filters['services[]'] = [];

    applyFilters();
}

const updateFilters = () => {

    // Check if route is initialized
    if (!route) return;

    // Get data
    const { rooms, beds, radius, 'services[]': services } = route.query;

    // Reset filters to default
    filters.rooms = null;
    filters.beds = null;
    filters.radiusKm = 20;
    filters['services[]'] = [];

    // Check query params
    if (rooms) filters.rooms = rooms;
    if (beds) filters.beds = beds;
    if (radius && radius != 20000) filters.radiusKm = parseInt(radius) / 1000;
    if (services && services.length) filters['services[]'] = [...services];
}

const onModalClose = () => {

    // Reset unsetted filters
    updateFilters();

    // Close modal
    isModalVisible.value = false;
}

// Update filters on create
updateFilters();

</script>


<template>
    <!-- Advanced Filters Toggler -->
    <button class="filter-advanced-toggler flex-shrink-0 ms-3" :class="{ 'has-filter': filtersCount }"
        @click="isModalVisible = !isModalVisible">
        <FontAwesomeIcon icon="sliders" />
        <span class="d-none d-md-inline">Filtri</span>

        <!-- Count Badge -->
        <span v-if="filtersCount" class="filter-number">{{ filtersCount }}</span>
    </button>

    <!-- Advanced Filters Modal -->
    <BaseModal title="Filtri" :isVisible="isModalVisible" @@close="onModalClose">

        <!-- Filters -->
        <form @submit.prevent="applyFilters" class="container-fluid">
            <div class="row">

                <!-- Rooms -->
                <div class="col-12 col-sm-4 mb-3">
                    <label for="rooms" class="form-label fw-bold">Numero di stanze</label>
                    <input v-model.trim="filters.rooms" type="number" class="form-control" id="rooms" min="0">
                </div>

                <!-- Beds -->
                <div class="col-12 col-sm-4 mb-3">
                    <label for="beds" class="form-label fw-bold">Numero di letti</label>
                    <input v-model.trim="filters.beds" type="number" class="form-control" id="beds" min="0">
                </div>

                <!-- Radius -->
                <div class="col-12 col-sm-4 mb-3">
                    <label for="radiusKm" class="form-label fw-bold">Raggio ricerca [km]</label>
                    <input v-model.trim="filters.radiusKm" type="number" class="form-control" id="radiusKm" min="0">
                </div>

                <!-- Services -->
                <div class="col-12 mb-3">

                    <p class="fw-bold mb-2">Servizi</p>

                    <div class="row">
                        <div v-for="service in servicesList" :key="service.id" class="col-6 form-check">

                            <!-- Checkbox -->
                            <input v-model.trim="filters['services[]']" class="form-check-input" type="checkbox"
                                :id="service.id" :value="service.id">

                            <!-- Service Label -->
                            <label class="form-label d-flex align-items-center gap-2" :for="service.id">
                                <div class="service-icon">
                                    <img :src="`http://127.0.0.1:8000/img/service/${service.icon}`" :alt="service.name">
                                </div>
                                {{ service.name }}
                            </label>

                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="col-12 border-top text-end pt-3">
                    <button @click="resetFilters" type="button" class="btn btn-secondary">Cancella
                        Tutto</button>
                    <button type="submit" class="btn btn-success ms-2">Applica</button>
                </div>

            </div>
        </form>

    </BaseModal>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.filter-advanced-toggler {
    position: relative;

    @include circle(40px);

    @include flex;
    gap: 10px;
    border: 1px solid $light-grey;

    &.has-filter {
        border: 2px solid #000;
    }

    .filter-number {
        @include circle(20px);
        position: absolute;
        top: -8px;
        left: 65%;

        @include flex();
        background-color: #000;
        font-size: 10px;
        color: #fff;
    }
}

// MEDIA MD
@media (min-width: 768px) {
    .filter-advanced-toggler {
        @include circle(auto);
        border-radius: 10px;
        padding: 15px 12px;

        .filter-number {
            left: 85%;
        }
    }
}

.service-icon {
    @include square(30px);
    overflow: hidden;

    img {
        @include max-size;
        object-fit: contain;
        filter: brightness(0) saturate(100%);
    }
}
</style>