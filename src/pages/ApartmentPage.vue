<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import DetailPagePlaceholder from '@/components/placeholders/DetailPagePlaceholder.vue';
import ApartmentImageSection from '@/components/apartment/detail/ApartmentImageSection.vue';
import ApartmentInfoSection from '@/components/apartment/detail/ApartmentInfoSection.vue';
import ApartmentHostSection from '@/components/apartment/detail/ApartmentHostSection.vue';
import ApartmentDescriptionSection from '@/components/apartment/detail/ApartmentDescriptionSection.vue';
import ApartmentMapSection from '@/components/apartment/detail/ApartmentMapSection.vue';
import ApartmentServicesSection from '@/components/apartment/detail/ApartmentServicesSection.vue';
import ApartmentMessagesSection from '@/components/apartment/detail/ApartmentMessagesSection.vue';


//*** APARTMENT DETAIL ***//
// Data
const apartment = ref(null);
const isLoading = ref(true);
const router = useRouter();
const route = useRoute();

// Get apartment
apiClient.get('/apartments/' + route.params.id)
    .then(res => { apartment.value = res.data })
    .catch(() => { router.push({ name: 'not-found', query: { error: 404 } }) })
    .then(() => { isLoading.value = false; });

</script>


<template>
    <div class="container">

        <!-- Loader -->
        <DetailPagePlaceholder v-if="isLoading" class="my-4" />

        <!-- Page Content -->
        <div v-else>

            <!-- Header -->
            <header class="d-flex align-items-center justify-content-between py-4">

                <h2>{{ apartment.title }}</h2>

                <button class="circle-button" @click="router.back()">
                    <FontAwesomeIcon :icon="['fas', 'chevron-left']" />
                </button>

            </header>


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
</template>