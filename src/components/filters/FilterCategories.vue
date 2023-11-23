<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';


//*** PROPS ***/
defineProps({
    categories: {
        type: Array,
        default: []
    }
});


//*** CATEGORIES ***/
// Data
const route = useRoute();

// Compute query params
const queryParams = computed(() => {

    // Check if route is initialized
    if (!route) return null;

    // Get data
    const { address, lat, lon, rooms, beds, radius, 'services[]': services } = route.query;

    return {
        address,
        lat,
        lon,
        rooms,
        beds,
        radius,
        'services[]': services
    }
});

</script>


<template>
    <ul class="filter-categories">
        <li v-for="category in categories" :key="category.id">
            <RouterLink :to="{ name: 'search', query: { ...queryParams, category: category.id } }"
                class="filter-categories-link" :class="{ 'active': route?.query.category == category.id }">
                <img :src="`src/assets/img/category/${category.img}`" :alt="category.name">
                <div>{{ category.name }}</div>
            </RouterLink>
        </li>
    </ul>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.filter-categories {
    height: 80px;

    @include flex(start);
    gap: 15px;

    overflow-x: scroll;

    li {
        height: 100%;
    }

    .filter-categories-link {
        height: 100%;
        padding: 0 10px;

        @include flex($direction: column);
        gap: 5px;
        color: $col-grey;
        font-size: 12px;
        border-bottom: 3px solid transparent;
        font-weight: 500;
        text-wrap: nowrap;

        transition: all 0.5s;

        img {
            width: 25px;

            filter: invert(40%) sepia(55%) saturate(0%) hue-rotate(206deg) brightness(113%) contrast(83%);
        }

        &:hover,
        &.active {
            border-color: $col-brand;
            color: #000;

            img {
                filter: brightness(0) saturate(100%);
            }
        }
    }
}
</style>