<script>
import { store } from '@/js/store.js';
import { apiClient } from '@/http/';


export default {

    data: () => ({
        categories: [],
        store: store
    }),

    methods: {
        fetchCategories() {
            apiClient.get('/categories').then(res => { this.categories = res.data })
        },

        setQueryParams(category_id) {
            return {
                address: this.$route?.query.address,
                lat: this.$route?.query.lat,
                lon: this.$route?.query.lon,
                category: category_id,
                rooms: this.$route?.query.rooms,
                beds: this.$route?.query.beds,
                radius: this.$route?.query.radius,
                'services[]': this.$route?.query['services[]'],
            };
        }
    },

    created() {
        this.fetchCategories();
    }
}
</script>

<template>
    <div class="search-filters">

        <div class="container">

            <!-- Categories Filter -->
            <ul class="filter-categories">
                <li v-for="category in categories" :key="category.id">
                    <RouterLink :to="{ name: 'search', query: setQueryParams(category.id) }" class="filter-categories-link"
                        :class="{ 'active': $route.query?.category == category.id }">
                        <img :src="`src/assets/img/category/${category.img}`" :alt="category.name">
                        <div>{{ category.name }}</div>
                    </RouterLink>
                </li>
            </ul>

            <!-- Advanced Filters Toggle -->
            <button class="filter-advanced-toggle flex-shrink-0 ms-3" data-bs-toggle="modal" data-bs-target="#searchModal"
                :class="{ 'has-filter': store.filters > 0 }">
                <FontAwesomeIcon icon="sliders" />
                <span class="d-none d-md-inline">Filtri</span>

                <!-- Count Badge -->
                <span v-if="store.filters > 0" class="filter-number">{{ store.filters }}</span>
            </button>

        </div>
    </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;


.search-filters {
    background-color: white;

    >.container {
        display: flex;
        align-items: center;
    }

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
                border-color: $col-grey;
                color: black;

                img {
                    filter: brightness(0) saturate(100%);
                }
            }
        }
    }


    .filter-advanced-toggle {
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
        .filter-advanced-toggle {
            @include circle(auto);
            border-radius: 10px;
            padding: 15px 12px;

            .filter-number {
                left: 85%;
            }
        }
    }
}
</style>