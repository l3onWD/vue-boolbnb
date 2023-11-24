<script setup>
import { reactive } from 'vue';
import { apiClient } from '@/http/';

//*** COMPONENTS ***/
import FilterCategories from '@/components/filters/FilterCategories.vue';
import FilterAdvanced from '@/components/filters/FilterAdvanced.vue';


//*** CATEGORIES ***/
// Data
const categories = reactive([]);

// Functions
const fetchCategories = () => {
    apiClient.get('/api/categories')
        .then(({ data }) => {
            categories.splice(0, categories.length);
            categories.push(...data);
        })
        .catch(err => { console.error(err) });
}

// Get Categories
fetchCategories();

</script>

<template>
    <div class="filters-bar">

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


.filters-bar {
    background-color: white;

    >.container {
        display: flex;
        align-items: center;
    }
}
</style>