<script setup>

//*** PROPS ***//
defineProps({
    name: {
        type: String,
        required: true
    },
    iconFile: {
        type: String,
        required: true
    },
    missing: {
        type: Boolean,
        default: false
    }
});

</script>


<template>
    <div class="services-card">

        <div>
            <img :src="`http://127.0.0.1:8000/img/service/${iconFile}`" :alt="name">
        </div>

        <span :class="{ 'service-missing': missing }">{{ name }}</span>

    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;


.services-card {
    padding: 10px;

    @include flex(start, center, $gap: 7px);
    border: 1px solid $col-lightgrey;
    border-radius: 15px;

    div {
        @include square(20px);
        overflow: hidden;

        img {
            @include max-size;

            display: block;
            object-fit: contain;
            filter: brightness(0) saturate(100%);
        }
    }

    .service-missing {
        text-decoration: line-through;
    }
}
</style>