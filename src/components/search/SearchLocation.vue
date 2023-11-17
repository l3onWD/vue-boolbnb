<script>
import { ttClient } from '@/http/';
import { store } from '@/js/store.js';


export default {

    data: () => ({
        address: '',
        lat: null,
        lon: null,

        searchTimeoutId: null,
        locations: [],
        store: store
    }),

    methods: {

        searchLocation() {
            clearTimeout(this.searchTimeoutId);
            this.searchTimeoutId = setTimeout(this.findLocation, 500);
        },

        // Go to Filter Page
        goToFilterPage(address, lat, lon) {

            if (!lat && !lon) return;

            // Create query params
            const query = {
                address,
                lat,
                lon,
                category: this.$route?.query.category,
                rooms: this.$route?.query.rooms,
                beds: this.$route?.query.beds,
                radius: this.$route?.query.radius,
                'services[]': this.$route?.query['services[]']
            }

            this.$router.push({ name: 'search', query })
        },

        // Find the position
        findLocation() {

            // Resets
            this.setLocationCoords();
            this.locations = [];
            this.store.show = true;

            if (!this.address) {
                this.store.show = false;
                return;
            }


            ttClient.get(`${encodeURIComponent(this.address)}.json?limit=5&countrySet=IT`)
                .then(response => {
                    this.locations = response.data.results;
                })
                .catch(error => {
                    console.error('Errore durante la ricerca del luogo:', error);
                });

        },

        // Get latitude, longitude and address
        handleSelectLocation(address, lat, lon) {
            this.address = address;
            this.setLocationCoords(lat, lon);
            this.goToFilterPage(address, lat, lon)
        },


        setLocationCoords(lat = null, lon = null) {
            this.lat = lat;
            this.lon = lon;
        }
    },

    watch: {
        '$route': {
            handler(newRoute) {
                if (newRoute.name !== 'search') {
                    this.address = '';
                    this.setLocationCoords();
                }
                else {
                    this.address = this.$route.query.address || '';
                    this.setLocationCoords(this.$route.query.address, this.$route.query.lat, this.$route.query.lon);
                }
            }
        }
    }
}
</script>


<template>
    <!-- Search Location -->
    <form @submit.prevent="goToFilterPage(address, lat, lon)" class="search-location">

        <input v-model.trim="address" type="text" class="form-control" placeholder="Inserisci un luogo"
            @keyup="searchLocation">

        <button v-if="address" type="button" class="search-reset" @click="address = ''">
            <FontAwesomeIcon :icon="['fas', 'x']" />
        </button>

        <button type="submit" class="search-submit">
            <FontAwesomeIcon icon="magnifying-glass" />
        </button>
    </form>

    <!-- Search Suggestions -->
    <ul class="search-suggestions" :class="{ 'd-none': !store.show }">

        <li v-if="!locations.length" class="p-0">Continua a scrivere...</li>

        <li v-for="location in locations"
            @click="handleSelectLocation(location.address.freeformAddress, location.position.lat, location.position.lon)">

            <div class="location-dot">
                <FontAwesomeIcon :icon="['fas', 'location-dot']" />
            </div>

            <span>{{ location.address.freeformAddress }}</span>

        </li>

    </ul>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.search-location {
    padding: 0;

    @include flex;
    flex-grow: 1;
    border: 1px solid $light-grey;
    border-radius: 40px;

    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
    overflow: hidden;

    &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
    }

    input {
        padding: 0 0 0 12px;

        border: none;

        &:focus {
            border: none;
            box-shadow: none;
        }
    }

    .search-reset {
        padding: 8px 10px;
    }

    .search-submit {
        padding: 12px;

        @include flex;
        color: white;
        background-color: $brand-color;
        border-radius: 0 50% 50% 0;
    }
}



// Search Suggestions
.search-suggestions {
    padding: 20px;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;

    @include flex(space-between, stretch, column);
    background-color: white;
    border-radius: 10px;

    box-shadow: 0 0 8px 4px rgba($color: #000, $alpha: 0.1);
    z-index: 1;

    li {
        padding: 10px;

        @include flex(start, $gap: 15px);

        cursor: pointer;
    }

    li:hover {
        background-color: rgb(245, 245, 245);
    }

    .location-dot {
        @include square(40px, 10px);
        flex: 0 0 40px;

        @include flex;
        background-color: #ebebeb;
    }
}
</style>