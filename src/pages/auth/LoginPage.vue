<script setup>

</script>


<template>
    <div id="login-page" class="container my-4">

        <div class="login-panel">

            <h2 class="mb-4">Accedi</h2>

            <form>
                <div class="row mb-4">
                    <label for="email" class="col-form-label col-12 col-md-4">E-Mail</label>
                    <div class="col-12 col-md-6">
                        <input id="email" type="email" class="form-control" autocomplete="email">
                    </div>
                </div>

                <div class="row mb-4">
                    <label for="password" class="col-form-label col-12 col-md-4">Password</label>
                    <div class="col-12 col-md-6">
                        <input id="password" type="password" class="form-control">
                    </div>
                </div>

                <div class="d-flex justify-content-md-center">
                    <button class="button button-brand">Login</button>
                </div>
            </form>
        </div>

    </div>
</template>


<style lang="scss" scoped>
#login-page {

    display: flex;
    justify-content: center;

    .login-panel {
        padding: 1.5rem;
        width: 100%;

        border-radius: 0.5rem;
        box-shadow: 0 0 8px 4px rgba($color: #000, $alpha: 0.1);
    }
}

// Media MD
@media screen and (min-width: 768px) {
    #login-page {

        .login-panel {
            max-width: 500px;
        }
    }
}
</style>