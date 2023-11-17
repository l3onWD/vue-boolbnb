<script>
import { ttClient } from '@/http/';
import { store } from '@/js/store.js';


export default {
    data: () => ({
        searchedText: '',
        locations: [],
        timeout: null,
        store: store,
        address: null,
        lat: null,
        lon: null,
    }),

    methods: {

        searchLocation() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(this.findLocation, 500);
        },

        // Go to Filter Page
        goToFilterPage(router, address, lat, lon) {

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

            router.push({ name: 'search', query })
        },

        checkIfBlank() {
            if (this.searchedText === '') {
                this.address = '';
                this.lat = '';
                this.lon = '';
            }
        },

        // Find the position
        findLocation() {
            if (this.searchedText !== '') {
                this.store.show = true;
                ttClient.get(`${encodeURIComponent(this.searchedText)}.json?limit=5&countrySet=IT`)
                    .then(response => {
                        this.locations = response.data.results;
                    })
                    .catch(error => {
                        console.error('Errore durante la ricerca del luogo:', error);
                    });
            }
            else {
                this.locations = [];
                this.store.show = false;
            }
        },

        // Get latitude, longitude and value
        selectAddress(value, address, lat, lon, router) {
            this.searchedText = value;
            this.address = address;
            this.lat = lat;
            this.lon = lon;

            this.goToFilterPage(router, address, lat, lon)
        }
    },

    watch: {
        '$route': {
            handler(newRoute) {
                if (newRoute.name !== 'search') this.searchedText = '';
                else this.searchedText = this.$route.query.address ? this.$route.query.address : '';
            }
        }
    }
}
</script>


<template>
    <form @submit.prevent="goToFilterPage($router, address, lat, lon)" class="search-bar">

        <input v-model.trim="searchedText" type="text" class="form-control" placeholder="Inserisci un luogo"
            @keyup="searchLocation">

        <span v-if="searchedText.length" class="remove-text" @click="searchedText = ''">
            <FontAwesomeIcon :icon="['fas', 'x']" />
        </span>

        <button type="submit" class="input-icon" @click="checkIfBlank">
            <FontAwesomeIcon icon="magnifying-glass" />
        </button>
    </form>

    <!-- Address Modal -->
    <div class="filter-modal" :class="{ 'hide': !store.show }">
        <ul>
            <li v-if="!locations.length" class="p-0">Continua a scrivere...</li>
            <li v-for="location in this.locations"
                @click="selectAddress(`${location.address.freeformAddress} ${location.address.countrySubdivision}`, location.address.freeformAddress, location.position.lat, location.position.lon, $router)">

                <div class="searched-result">
                    <div class="location-dot">
                        <FontAwesomeIcon :icon="['fas', 'location-dot']" />
                    </div>
                    <span>{{ location.address.freeformAddress }}</span>
                </div>

            </li>
        </ul>
    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.search-bar {
    @include flex;
    flex-grow: 1;
    padding: 0;
    border: 1px solid $light-grey;
    border-radius: 40px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);
    overflow: hidden;

    &:hover {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
    }
}

// Input 
.form-control {
    border: none;
    padding: 0 12px;

    &:focus {
        border: none;
        box-shadow: none;
    }
}

.remove-text {
    margin-right: 10px;
    cursor: pointer;
}


// Search icon
.input-icon {
    @include flex;
    border-radius: 0 50% 50% 0;
    padding: 12px;
    color: white;
    background-color: $brand-color;
}


// Address Modal
.filter-modal {
    top: 100%;
    width: 100%;
    background-color: white;
    border-radius: 10px;
    position: absolute;
    left: 0;
    padding: 20px;
    box-shadow: 0 0 8px 4px rgba($color: #000, $alpha: 0.1);
    z-index: 1;

    ul {
        @include flex(space-between, stretch, column, $gap: 7px);
        height: 100%;
    }
}

.location-dot {
    @include square(40px, 10px);
    @include flex;
    flex: 0 0 40px;
    background-color: #ebebeb;
}

.searched-result {
    @include flex(start, $gap: 15px);
    flex-basis: 100%;
    cursor: pointer;
}

li {
    padding: 3px 10px;
}

li:hover {
    background-color: rgb(245, 245, 245);
}

.hide {
    display: none;
}
</style>