<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ttClient } from '@/http/';


//*** DATA ***//
// Selected Location
const location = reactive({
    address: '',
    lat: null,
    lon: null
});

// Search
const searchTimeoutId = ref(null);
const searchInput = ref(null);

// Suggestions
const suggestions = ref([]);
const areSuggestionsVisible = ref(false);

// Router
const router = useRouter();
const route = useRoute();


// Calculate if the actual route is the search page
const isSearchPage = computed(() => route.name === 'search');


//*** FUNCTIONS ***//
// Search Throttling
const searchLocation = () => {
    clearTimeout(searchTimeoutId.value);
    searchTimeoutId.value = setTimeout(getSuggestions, 500);
}

// Get a list of suggested places from API
const getSuggestions = () => {

    // Resets
    setLocationCoords();

    // Check if address is empty
    if (!location.address) return;
    areSuggestionsVisible.value = true;

    // Fetch TT API
    ttClient.get(`${encodeURIComponent(location.address)}.json?limit=5&countrySet=IT`)
        .then(response => {

            // Get suggestions data
            suggestions.value = response.data.results.map(location => {
                return {
                    address: location.address.freeformAddress,
                    lat: location.position.lat,
                    lon: location.position.lon
                };
            });

        })
        .catch(error => {
            console.error('Errore durante la ricerca del luogo:', error);
        });

}

// Go to Filter Page
const goToFilterPage = (address, lat, lon) => {

    if (!lat && !lon) return;

    // Create query params
    const query = {
        address,
        lat,
        lon,
        category: route?.query.category,
        rooms: route?.query.rooms,
        beds: route?.query.beds,
        radius: route?.query.radius,
        'services[]': route?.query['services[]']
    }

    router.push({ name: 'search', query })
}

// Get latitude, longitude and address
const handleSelectLocation = (address, lat, lon) => {
    location.address = address;
    setLocationCoords(lat, lon);
    goToFilterPage(address, lat, lon)
}

// Reset Search data and input
const handleResetSearch = () => {
    location.address = '';
    setLocationCoords();
    suggestions.value = [];
    searchInput.value.focus();
}

// Set selected location coords
const setLocationCoords = (lat = null, lon = null) => {
    location.lat = lat;
    location.lon = lon;
}

// Close suggestions panel
const handleSuggestionsClose = () => {
    areSuggestionsVisible.value = false;
}


//*** WATCHERS ***//
watch(isSearchPage, (isSearchPage) => {
    if (!isSearchPage) {
        location.address = '';
        setLocationCoords();
    }
    else {
        location.address = route.query.address || '';
        setLocationCoords(route.query.lat, route.query.lon);
    }
});

</script>


<template>
    <!-- Search Location -->
    <form @submit.prevent="goToFilterPage(location.address, location.lat, location.lon)" class="search-location"
        v-click-outside="handleSuggestionsClose">

        <input ref="searchInput" v-model.trim="location.address" type="text" class="form-control"
            placeholder="Inserisci un luogo" @keyup="searchLocation"
            @click="areSuggestionsVisible = !areSuggestionsVisible">

        <button v-if="location.address" type="button" class="search-reset" @click="handleResetSearch">
            <FontAwesomeIcon :icon="['fas', 'x']" />
        </button>

        <button type="submit" class="search-submit">
            <FontAwesomeIcon icon="magnifying-glass" />
        </button>
    </form>

    <!-- Search Suggestions -->
    <ul v-if="areSuggestionsVisible" class="search-suggestions">

        <li v-if="!suggestions.length" class="p-0">Continua a scrivere...</li>

        <li v-for="suggestion in suggestions" :key="suggestion.address"
            @click="handleSelectLocation(suggestion.address, suggestion.lat, suggestion.lon)">

            <div class="location-dot">
                <FontAwesomeIcon :icon="['fas', 'location-dot']" />
            </div>

            <span>{{ suggestion.address }}</span>

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