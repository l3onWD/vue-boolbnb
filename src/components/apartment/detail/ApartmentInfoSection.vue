<script setup>
import { computed } from 'vue';


//*** PROPS ***//
const props = defineProps({
    address: {
        type: String,
        default: '-'
    },
    rooms: {
        type: Number,
        default: 0
    },
    beds: {
        type: Number,
        default: 0
    },
    bathrooms: {
        type: Number,
        default: 0
    }
});


//*** COMPUTED ***//
const formattedRooms = computed(() => props.rooms + ' camer' + (props.rooms !== 1 ? 'e' : 'a'));
const formattedBeds = computed(() => props.beds + ' lett' + (props.beds !== 1 ? 'i' : 'o'));
const formattedBathrooms = computed(() => props.bathrooms + ' bagn' + (props.bathrooms !== 1 ? 'i' : 'o'));

</script>


<template>
    <section class="py-4">

        <!-- Address -->
        <h3 class="mb-2">{{ address }}</h3>

        <!-- Info -->
        <ul>
            <li>{{ formattedRooms }}</li>
            <li>{{ formattedBeds }}</li>
            <li>{{ formattedBathrooms }}</li>
        </ul>

    </section>
</template>


<style lang="scss" scoped>
ul {
    display: flex;
    font-size: 16px;

    li {
        display: flex;

        &::after {
            margin: 0 20px;
            content: '-';

            display: block;
        }

        &:last-child::after {
            content: '';
        }
    }
}
</style>