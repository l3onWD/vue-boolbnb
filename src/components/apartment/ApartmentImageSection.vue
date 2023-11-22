<script setup>

//*** PROPS ***//
defineProps({
    imageFile: {
        type: String,
        default: ''
    },
    imageTitle: {
        type: String,
        default: 'image'
    }
});

</script>


<template>
    <div class="slider">

        <div v-if="imageFile" class="image-container">
            <img :src="`http://127.0.0.1:8000/storage/${imageFile}`" :alt="imageTitle">
        </div>

        <!-- Without image -->
        <div v-else class="no-image">

            <div class="icon">
                <img src="@/assets/img/camera.png" alt="camera">
            </div>

            <h3>L'host non ha ancora inserito immagini, contattalo per saperne di più!</h3>

            <a href="#message-form">
                <FontAwesomeIcon :icon="['fas', 'arrow-down']" bounce size="2xl" />
            </a>

        </div>

    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.slider {
    display: flex;

    &::after,
    &::before {
        flex-grow: 1;
        content: '';

        display: none;
        background-color: $light-grey;
        border-radius: 20px;
    }

    img {
        @include max-size;
        object-fit: cover;
    }

    .image-container {
        @include square(calc(100vw - 24px), 20px);
        @include max-size($max: true, $max-width: 100%, $max-height: 360px);
        overflow: hidden;
    }

    .no-image {
        padding: 15px;

        @include flex($direction: column, $gap: 20px);
        border: 1px solid $light-grey;
        border-radius: 15px;

        .icon {
            width: 30%;

            @include flex;

            img {
                width: 100%;
                filter: invert(44%) sepia(52%) saturate(6771%) hue-rotate(329deg) brightness(101%) contrast(101%);
            }
        }
    }
}


// Media MD
@media (min-width: 768px) {

    .slider {

        &::after,
        &::before {
            display: block;
        }

        .image-container {
            @include max-size($max: true, $max-width: 696px, $max-height: 400px);
        }

        .no-image {
            margin: 0 20px;
        }
    }
}


// Media LG
@media (min-width: 992px) {
    .slider {
        gap: 20px;

        .no-image {
            margin: 0;
        }
    }
}
</style>