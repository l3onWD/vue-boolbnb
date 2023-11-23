<script></script>


<template>
    <div>
        <h2 class="placeholder col-12 mb-3"></h2>

        <div class="placeholder placeholder-img col-12 mb-3"></div>

        <p class="placeholder col-3 mb-3"></p>
        <div class="w-100"></div>
        <p class="placeholder col-4"></p>

    </div>
</template>



<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.placeholder {
    animation: fade 1s linear infinite alternate;
    border-radius: 5px;

    &.placeholder-img {
        height: 100vw;
    }
}

@keyframes fade {
    from {
        background-color: $col-grey;
    }

    to {
        background-color: $light-grey;
    }
}
</style>