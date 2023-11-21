<script setup>

//*** PROPS ***/
const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Modal Title'
    }
});


//*** EMITS ***/
const emit = defineEmits(['@close']);


//*** LOGIC ***/
const onClickOutside = (e) => {
    if (!props.isVisible || e.currentTarget !== e.target) return;

    emit('@close');
}

</script>


<template>
    <Teleport to="body">
        <Transition name="fade">

            <div v-if="isVisible" @click="onClickOutside" class="modal-panel">

                <div class="modal-panel-content">

                    <!-- Header -->
                    <div class="modal-panel-header">
                        <h5>{{ title }}</h5>
                        <button @click="$emit('@close')" type="button" class="btn-close"></button>
                    </div>

                    <!-- Body -->
                    <div class="modal-panel-body">
                        <slot></slot>
                    </div>

                </div>
            </div>

        </Transition>
    </Teleport>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;


.modal-panel {
    padding: 0.5rem;
    position: fixed;
    inset: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba($color: #000, $alpha: 0.6);
    z-index: 2;
    overflow-y: auto;

    &-content {
        margin: auto;
        max-width: 500px;

        background-color: #fff;
        border-radius: 0.5rem;
        border: 1px solid $light-grey;
    }

    &-header {
        padding: 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid $light-grey;
    }

    &-body {
        padding: 1rem;
    }

}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>