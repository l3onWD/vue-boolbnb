<script setup>
import { computed, reactive, ref } from 'vue';
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import BaseModal from '@/components/base/BaseModal.vue';
import ServiceCard from '@/components/services/ServiceCard.vue';


//*** PROPS ***//
const props = defineProps({
    services: {
        type: Array,
        default: []
    }
});


//*** DATA ***//
const allServices = reactive([]);
const isModalVisible = ref(false);



//*** COMPUTED ***//
const servicesNotAvailable = computed(() => {
    // Services of the apartament (Available Services)
    const avServ = props.services;

    // Array with ids of available services
    const avServId = avServ.map(s => s.id);

    // Array with services not available
    return allServices.filter(s => !avServId.includes(s.id));
});

const servicesContainerId = computed(() => {
    if (props.services.length > 10) return 'services-large'
    return '';
});


//*** LOGIC ***//
// Get all services
apiClient.get('/services')
    .then(res => { allServices.push(...res.data) });

</script>


<template>
    <section :id="servicesContainerId" class="py-4">

        <!-- Title -->
        <h3 class="mb-3">Cosa troverai</h3>

        <!-- Content -->
        <div class="services-container">

            <!-- Service List -->
            <ul class="service-list pe-md-3">
                <li v-for="service in services">
                    <ServiceCard :name="service.name" :iconFile="service.icon" />
                </li>
            </ul>

            <!-- Services Discover -->
            <div class="services-discover">

                <h2>Scopri tutti i servizi</h2>

                <div>
                    <!-- Modal Toggler -->
                    <button type="button" class="button button-light" @click="isModalVisible = !isModalVisible">
                        Mostra tutti i {{ services.length }} servizi
                    </button>
                </div>

            </div>

            <!-- Service Modal -->
            <BaseModal title="Servizi" :isVisible="isModalVisible" @@close="isModalVisible = false">
                <!-- Available Services -->
                <h3 class="mb-3">Cosa troverai</h3>

                <ul class="row row-cols-1 row-cols-md-2 row-gap-2">
                    <li v-for="service in services" class="col">
                        <ServiceCard :name="service.name" :iconFile="service.icon" />
                    </li>
                </ul>

                <!-- Unavailable Services -->
                <div v-if="servicesNotAvailable.length">

                    <h3 class="mt-5 mb-3">Non incluso</h3>

                    <ul class="row row-cols-1 row-cols-md-2 row-gap-2">
                        <li v-for="service in servicesNotAvailable">
                            <ServiceCard :name="service.name" :iconFile="service.icon" missing />
                        </li>
                    </ul>

                </div>

            </BaseModal>

        </div>
    </section>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

ul {
    font-size: 16px;
}

.services-container {
    display: flex;
    flex-direction: column;
}

// LEFT PART
.service-list {
    max-height: 270px;

    @include flex(stretch, stretch, column, nowrap, 10px);
    overflow: hidden;
}

// RIGHT PART
.services-discover {
    flex-grow: 1;
    padding: 20px;

    @include flex(center, center, column, $gap: 10px);

    h2 {
        display: none;
    }
}


// Media SM
@media (min-width: 576px) {

    .service-list {
        flex-wrap: wrap;
    }

    #services-large {

        .service-list {
            gap: 5px;

            li {
                width: calc(50% - 7px / 2);
            }
        }
    }

}


// Media MD
@media (min-width: 768px) {

    .services-container {
        flex-direction: row;
    }

    .service-list {
        gap: 7px;
    }

    .services-discover {

        h2 {
            display: block;
        }

    }

    #services-large {

        .services-container {
            flex-direction: column;
        }

        .service-list {

            li {
                width: 32%
            }
        }

        .services-discover {

            h2 {
                display: none;
            }

        }
    }

}


// Media LG
@media (min-width: 992px) {

    .service-list {
        gap: 10px;
    }

    #services-large {
        .service-list {
            gap: 7px;
        }
    }

}
</style>