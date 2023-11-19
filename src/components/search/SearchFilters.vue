<script>
import { store } from '@/js/store.js';
import { apiClient } from '@/http/';

//*** COMPONENTS ***/
import FilterCategories from '@/components/filters/FilterCategories.vue';


export default {

    components: { FilterCategories },

    data: () => ({
        categories: [],
        store: store
    }),

    methods: {

        fetchCategories() {
            apiClient.get('/categories')
                .then(res => { this.categories = res.data })
                .catch(err => { console.error(err) });
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
            <FilterCategories :categories="categories" />

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