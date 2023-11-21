<script setup>

//*** PROPS ***/
defineProps({
    isVisible: {
        type: Boolean,
        required: true
    }
});


//*** EVENTS ***//
const emit = defineEmits(['@back-top']);

</script>


<template>
    <Transition name="back-top">
        <button v-if="isVisible" class="back-top circle-button" @click="emit('@back-top')">
            <FontAwesomeIcon icon="angles-up" />
        </button>
    </Transition>
</template>


<style lang="scss" scoped>
.back-top {
    position: fixed;
    inset: auto 11px 60px auto;

    background-color: white;
    scale: 1;
    opacity: 1;
}

// Animation
.back-top-enter-active,
.back-top-leave-active {
    transition: all .2s linear;
}

.back-top-enter-from,
.back-top-leave-to {
    scale: 0.1;
    opacity: 0;
}
</style>