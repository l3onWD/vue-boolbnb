<script>

//*** COMPONENTS ***//
import ApartmentCard from '@/components/apartment/ApartmentCard.vue';
import HeaderPlaceholder from '@/components/placeholders/HeaderPlaceholder.vue';
import CardPlaceholder from '@/components/placeholders/CardPlaceholder.vue';


export default {
    props: {
        apartments: Array,
        title: String,
        infoMessage: String,
        isLoading: Boolean
    },

    components: { ApartmentCard, HeaderPlaceholder, CardPlaceholder },

    computed: {

        placeholdersCount() {
            return this.isLoading ? 10 : 0;
        }
    }
}
</script>


<template>
    <div class="container">

        <!-- List Header -->
        <div v-if="!isLoading">
            <!-- Title -->
            <h5 v-if="title">{{ title }}</h5>

            <!-- Info Message -->
            <div class="d-flex align-items-center gap-1 mb-3">

                <h6>Come ordiniamo i risultati</h6>

                <button class="button-info" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <FontAwesomeIcon :icon="['fas', 'question']" size="xs" />
                </button>

                <div class="dropdown-menu">{{ infoMessage }} </div>

            </div>
        </div>

        <!-- Header Placeholder -->
        <HeaderPlaceholder v-else class="mb-3" />


        <!-- List Cards -->
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 row-cols-xxl-5 g-5 g-sm-3">

            <!-- Cards -->
            <div v-for="apartment in apartments" :key="apartment.id" class="col">
                <ApartmentCard :apartment="apartment" />
            </div>

            <!-- Cards Placeholders -->
            <div v-for="card in placeholdersCount" class="col">
                <CardPlaceholder />
            </div>

        </div>

        <!-- Empty List -->
        <h4 v-if="!apartments.length" class="text-center mt-5">Nessun risultato</h4>

    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.container {
    margin: 20px auto;
}

h6 {
    font-size: 12px;
    color: #717171;
    font-weight: 300;
}

.button-info {
    @include circle(15px);
    @include flex;
    border: 2px solid#717171;
    color: #717171;
}

.dropdown-menu {
    font-size: 14px;
    padding: 8px 10px;
}
</style>
