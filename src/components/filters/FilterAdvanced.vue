<script>
import { apiClient } from '@/http/';


//*** COMPONENTS ***/
import BaseModal from '@/components/base/BaseModal.vue';


export default {

    components: { BaseModal },

    data: () => ({
        servicesList: [],
        filters: {
            rooms: null,
            beds: null,
            radiusKm: 20,
            'services[]': [],
        },
        isModalVisible: false,
        totalFilters: 0

    }),
    computed: {
        radius() {
            return parseInt(this.filters.radiusKm) * 1000;
        }
    },
    methods: {
        fetchServices() {

            apiClient.get('/services')
                .then(({ data }) => {
                    this.servicesList = data;
                })
                .catch(err => {
                    console.error(err);
                });

        },

        resetFilters() {

            // Reset Filters
            this.filters = {
                rooms: null,
                beds: null,
                radiusKm: 20,
                'services[]': [],
            }

            // Call API
            this.applyFilters();
        },

        applyFilters() {

            // Create query params
            const query = {
                address: this.$route?.query.address,
                lat: this.$route?.query.lat,
                lon: this.$route?.query.lon,
                category: this.$route?.query.category,
                rooms: this.filters.rooms,
                beds: this.filters.beds,
                radius: this.radius,
                'services[]': this.filters['services[]'],
            }

            // Apply query

            this.$router.push({ name: 'search', query })
            this.addFilters();
        },


        // Check if are any filters in the URL
        assignFilters() {

            if (this.$route?.query.rooms && this.$route?.query.rooms > 0) {
                this.filters.rooms = this.$route?.query.rooms;
            };

            if (this.$route?.query.beds && this.$route?.query.beds > 0) {
                this.filters.beds = this.$route?.query.beds;
            };

            if (this.$route?.query.radius && this.$route?.query.radius != 20000) {
                this.filters.radiusKm = parseInt(this.$route?.query.radius) / 1000;
            };

            if (this.$route?.query['services[]'] && this.$route?.query['services[]'].length) {
                this.filters['services[]'] = [...this.$route?.query['services[]']];
            };

        },

        // Update Filters Counter
        addFilters() {

            this.totalFilters = 0;


            // Count Filters
            if (this.filters.rooms) {
                this.totalFilters += 1;
            };

            if (this.filters.beds) {
                this.totalFilters += 1;
            }

            if (this.filters.radiusKm != 20) {
                this.totalFilters += 1;
            }

            this.totalFilters += this.filters['services[]'].length;
        },

    },

    created() {
        this.fetchServices();
        this.assignFilters();
        this.addFilters();

    },

    emits: ['@close']
}
</script>


<template>
    <!-- Advanced Filters Toggler -->
    <button class="filter-advanced-toggler flex-shrink-0 ms-3" :class="{ 'has-filter': totalFilters }"
        @click="isModalVisible = !isModalVisible">
        <FontAwesomeIcon icon="sliders" />
        <span class="d-none d-md-inline">Filtri</span>

        <!-- Count Badge -->
        <span v-if="totalFilters" class="filter-number">{{ totalFilters }}</span>
    </button>

    <!-- Advanced Filters Modal -->
    <BaseModal title="Filtri" :isVisible="isModalVisible" @@close="isModalVisible = false">

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

                            <input v-model.trim="filters['services[]']" class="form-check-input" type="checkbox"
                                :id="service.id" :value="service.id">

                            <label class="form-label d-flex align-items-center gap-1" :for="service.id">
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
                    <button type="submit" class="btn btn-success ms-2" @click="isModalVisible = false">Mostra</button>
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