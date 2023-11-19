<script>
import { apiClient } from '@/http/';

//*** COMPONENTS ***/
import FilterCategories from '@/components/filters/FilterCategories.vue';
import FilterAdvanced from '@/components/filters/FilterAdvanced.vue';


export default {

    components: { FilterCategories, FilterAdvanced },

    data: () => ({
        categories: []
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
            <FilterCategories :categories="categories" class="flex-grow-1" />

            <!-- Advanced Filters -->
            <FilterAdvanced />

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
}
</style>