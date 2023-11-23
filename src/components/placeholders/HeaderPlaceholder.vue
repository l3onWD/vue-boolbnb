<script></script>


<template>
    <div>
        <h5 class="placeholder-glow mb-2">
            <span class="placeholder col-4 col-md-3 col-lg-2"></span>
        </h5>
        <h6 class="placeholder-glow">
            <span class="placeholder col-5 col-md-4 col-lg-3"></span>
        </h6>
    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.placeholder {
    animation: fade 1s linear infinite alternate;
    border-radius: 5px;
}

@keyframes fade {
    from {
        background-color: $col-grey;
    }

    to {
        background-color: $col-lightgrey;
    }
}
</style>
