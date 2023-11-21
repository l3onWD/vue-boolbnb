<script></script>


<template>
    <div class="card" aria-hidden="true">

        <div class="img-card-top card-img placeholder"></div>

        <div class="card-body">

            <h5 class="card-title placeholder-glow">
                <span class="placeholder col-8"></span>
            </h5>

            <p class="card-text placeholder-glow">
                <span class="placeholder col-7"></span>
                <span class="placeholder col-6"></span>
            </p>

        </div>

    </div>
</template>



<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.placeholder {
    animation: fade 1s linear infinite alternate;
    border-radius: 5px;
}

.card {
    border: none;
    border-radius: 0;
}

.card-img {
    position: relative;
    aspect-ratio: 1;
    overflow: hidden;
}

.card-body {
    padding: 16px 0;
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