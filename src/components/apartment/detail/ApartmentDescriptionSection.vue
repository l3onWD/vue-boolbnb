<script setup>

//*** PROPS ***//
defineProps({
    description: {
        type: String,
        default: ''
    }
});

</script>


<template>
    <div class="py-4">
        <h3 class="mb-2">Descrizione</h3>
        <p>{{ description }}</p>
    </div>
</template>