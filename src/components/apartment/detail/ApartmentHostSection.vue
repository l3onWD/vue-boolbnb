<script setup>
import { computed } from 'vue';


//*** PROPS ***//
const props = defineProps({
    hostName: {
        type: String,
        default: 'sconosciuto'
    }
});


//*** COMPUTED ***//
const hostNameInitial = computed(() => props.hostName.charAt(0).toUpperCase());
const capitalizedHostName = computed(() => hostNameInitial.value + props.hostName.slice(1));

</script>


<template>
    <section class="d-flex align-items-center justify-content-between py-4">

        <div class="d-flex align-items-center gap-4">

            <div class="host-icon"> {{ hostNameInitial }}</div>

            <h3>Nome dell'host: {{ capitalizedHostName }}</h3>

        </div>

        <a href="#message-form" class="button button-light">
            Contatta {{ capitalizedHostName }}
        </a>

    </section>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.host-icon {
    @include circle(calc(40px + 2vw));

    @include flex;
    color: white;
    background-color: black;
    font-size: calc(10px + 2vw);
}
</style>