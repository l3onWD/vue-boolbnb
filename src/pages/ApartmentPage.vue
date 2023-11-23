<script>
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import AppLoader from '@/components/AppLoader.vue';
import ApartmentImageSection from '@/components/apartment/detail/ApartmentImageSection.vue';
import ApartmentInfoSection from '@/components/apartment/detail/ApartmentInfoSection.vue';
import ApartmentHostSection from '@/components/apartment/detail/ApartmentHostSection.vue';
import ApartmentDescriptionSection from '@/components/apartment/detail/ApartmentDescriptionSection.vue';
import ApartmentMapSection from '@/components/apartment/detail/ApartmentMapSection.vue';
import ApartmentServicesSection from '@/components/apartment/detail/ApartmentServicesSection.vue';
import ApartmentMessagesSection from '@/components/apartment/detail/ApartmentMessagesSection.vue';


export default {

    components: { AppLoader, ApartmentImageSection, ApartmentInfoSection, ApartmentHostSection, ApartmentMapSection, ApartmentDescriptionSection, ApartmentServicesSection, ApartmentMessagesSection },

    data() {
        return {
            apartment: null,
            services: [],
            isLoading: true
        }
    },

    methods: {

        // Get apartment details
        getApartment() {
            apiClient.get('/apartments/' + this.$route.params.id)
                .then(res => { this.apartment = res.data })
                .catch(() => { this.$router.push({ name: 'not-found', query: { error: 404 } }) })
                .then(() => { this.isLoading = false; });
        }

    },


    created() {
        this.getApartment();
    }
}
</script>


<template>
    <main>

        <div v-if="!isLoading" class="container">

            <!-- Header -->
            <header class="d-flex align-items-center justify-content-between py-4">

                <h2>{{ apartment.title }}</h2>

                <button class="circle-button" @click="$router.back()">
                    <FontAwesomeIcon :icon="['fas', 'chevron-left']" />
                </button>

            </header>


            <!-- Page Content -->
            <div>

                <!-- Image -->
                <ApartmentImageSection :image-file="apartment.image" :image-title="apartment.title" />


                <!-- Info -->
                <ApartmentInfoSection :address="apartment.address" :rooms="apartment.rooms" :beds="apartment.beds"
                    :bathrooms="apartment.bathrooms" />


                <!-- Host information -->
                <hr v-if="apartment.user.name">

                <ApartmentHostSection v-if="apartment.user.name" :hostName="apartment.user.name" />


                <!-- Description -->
                <hr>

                <ApartmentDescriptionSection :description="apartment.description" />


                <!-- Services -->
                <hr>

                <ApartmentServicesSection :services="apartment.services" />


                <!-- Map -->
                <hr v-if="apartment.address">

                <ApartmentMapSection v-if="apartment.address" :address="apartment.address" :latitude="apartment.latitude"
                    :longitude="apartment.longitude" />


                <!-- Messages -->
                <hr>

                <ApartmentMessagesSection :apartment-id="apartment.id" />

            </div>

        </div>

    </main>


    <!-- Loader -->
    <AppLoader :is-loading="isLoading" />
</template>