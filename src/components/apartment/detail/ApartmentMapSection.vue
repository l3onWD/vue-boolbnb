<script setup>
import { onMounted, ref } from 'vue';
// TomTom Map
import tt from "@tomtom-international/web-sdk-maps";
import '@tomtom-international/web-sdk-maps/dist/maps.css';


//*** PROPS ***//
const props = defineProps({
    address: {
        type: String,
        default: '-'
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});


//*** DEFINE MAP ***//
const mapElem = ref(null);

onMounted(() => {

    // Calculate center
    const center = [props.longitude, props.latitude];

    // Create map
    const map = tt.map({
        key: import.meta.env.VITE_TT_API_KEY,
        container: mapElem.value,
        center,
        zoom: 8
    });

    // Add controls
    map.addControl(new tt.NavigationControl());

    // Add marker
    new tt.Marker().setLngLat(center).addTo(map);

});

</script>


<template>
    <div class="py-4">

        <h3 class="mb-3">Dove ti troverai</h3>

        <div id="map" ref="mapElem"></div>

        <div class="mt-2">{{ address }}</div>

    </div>
</template>


<style scoped>
#map {
    height: 480px;
    border-radius: 15px;
}
</style>