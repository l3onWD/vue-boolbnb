<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';


//*** PROPS ***//
const props = defineProps({
    apartment: {
        type: Object,
        required: true
    }
});


//*** DATA ***//
const imagePlaceholderUrl = 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=';
const route = useRoute();


//*** COMPUTED ***//
/**
* Get image url or placeholder url
*/
const apartmentImageUrl = computed(() => {
    if (!props.apartment.image) return imagePlaceholderUrl;
    return `http://127.0.0.1:8000/storage/${props.apartment.image}`
});

/**
 * Get distance in Km (only Search Page)
 */
const distance = computed(() => {
    if (props.apartment.distance === undefined) return '';
    return Math.ceil(parseInt(props.apartment.distance) / 1000) + ' Km';
});

/**
 * Get the list of services filters applyed
 */
const filteredServiceIds = computed(() => {
    if (!route.query['services[]']) return [];
    return route.query['services[]'];
});

/**
* Get main searched services
*/
const mainServices = computed(() => {

    // Reorder Services by filtered
    const services = props.apartment.services.sort((a, b) => {

        const firstService = filteredServiceIds.value.includes(a.id.toString()) ? 1 : 0;
        const secondService = filteredServiceIds.value.includes(b.id.toString()) ? 1 : 0;

        return secondService - firstService
    });

    // Return only 4 services
    return services.slice(0, 4);
});

</script>


<template>
    <div class="card">

        <RouterLink :to="{ name: 'apartment', params: { id: apartment.id } }">

            <!-- Card Img -->
            <div class="card-img">

                <img :src="apartmentImageUrl" :alt="apartment.title">

                <!-- Promoted Badge -->
                <div v-if="apartment.promotions_max_apartment_promotionend_date" class="promoted-badge">
                    Consigliato
                </div>

            </div>

            <!-- Card Info -->
            <div class="card-content">
                <!-- Title -->
                <h6>{{ apartment.title }}</h6>

                <!-- Address -->
                <div>
                    {{ apartment.address }}
                </div>

                <!-- Distance -->
                <div v-if="apartment.distance !== undefined">
                    Distanza dal centro {{ distance }}
                    <FontAwesomeIcon :icon="['fas', 'location-dot']" class="me-1" />
                </div>

                <!-- Services -->
                <div v-if="apartment.distance !== undefined" class="services-icon">
                    Servizi principali
                    <ul>
                        <li v-for="service in mainServices" :key="service.id">
                            <div class="service-icon"
                                :class="{ 'selected': filteredServiceIds.includes(service.id.toString()) }"
                                :title="service.name">
                                <img :src="`http://127.0.0.1:8000/img/service/${service.icon}`" :alt="service.name">
                            </div>
                        </li>
                    </ul>
                </div>

                <!-- Price -->
                <div class="price"><b>{{ apartment.price }}€</b> a notte</div>
            </div>

        </RouterLink>

    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.card {
    border: none;
    border-radius: 0;
}

.card-img {
    position: relative;

    aspect-ratio: 1;
    overflow: hidden;

    img {
        @include square(100%);

        transition: all 0.3s;
        object-fit: cover;
    }

    // Promoted Badge
    .promoted-badge {
        position: absolute;
        left: -40px;
        top: 18px;
        padding: 0.5rem;
        width: 150px;

        text-align: center;
        font-weight: bold;
        color: #fff;
        background-color: $brand-color;

        transform: rotate(315deg);
        box-shadow: 0 0 8px 4px rgba($color: #000, $alpha: 0.1);
    }
}

.card-content {
    padding: 10px 0;

    @include flex(center, start, column, $gap: 7px);
    color: #717171;
    font-size: 17px;
    font-weight: 300;
    overflow: hidden;

    h6,
    .price {
        font-size: 16px;
        color: black
    }

    .service-icon {
        @include square(20px);
        overflow: hidden;

        img {
            @include max-size;

            display: block;
            object-fit: contain;
            filter: contrast(0.1);

        }

        &.selected {
            @include square(25px);
            padding: 2px;

            // border: 1px solid $brand-color;
            background-color: #000;
            border-radius: 0.25rem;

            img {
                // filter: contrast(1);
                filter: invert(100%) sepia(0%) saturate(19%) hue-rotate(285deg) brightness(105%) contrast(104%);
            }
        }
    }
}

.services-icon {
    @include flex(start, $wrap: nowrap, $gap: 3px);
    max-width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ul {
        @include flex($gap: 5px);
    }
}
</style>