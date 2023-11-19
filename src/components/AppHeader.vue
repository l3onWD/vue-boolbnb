<script setup>

//*** COMPONENTS ***/
import LoginMenu from '@/components/header/LoginMenu.vue';
import HeaderBrand from '@/components/header/HeaderBrand.vue';
import SearchLocation from '@/components/search/SearchLocation.vue';

</script>

<template>
    <header class="app-header">

        <!-- Top Header -->
        <div class="app-header-top">
            <div class="container">
                <div class="row">

                    <!-- Left side -->
                    <div class="col-md-1 col-xl-4 d-none d-md-flex justify-content-start">

                        <HeaderBrand />

                    </div>

                    <!-- Center -->
                    <div class="col-10 col-md-6 col-xl-4 d-flex align-items-center position-relative">

                        <SearchLocation />

                    </div>

                    <!-- Right side -->
                    <div class="col-2 col-md-5 d-flex col-xl-4 justify-content-end gap-2">

                        <!-- Actions -->
                        <div class="d-none d-md-flex">
                            <!-- Open BnB Button -->
                            <a href="http://127.0.0.1:8000/admin/apartments/create" class="button-light">Apri un Boolbnb</a>

                            <!-- Globe Button -->
                            <button class="button-light">
                                <FontAwesomeIcon icon="globe" />
                            </button>
                        </div>

                        <!-- Login Dropdown -->
                        <LoginMenu />

                    </div>

                </div>
            </div>
        </div>

    </header>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;


.app-header {
    position: sticky;
    top: 0;

    background-color: white;
    z-index: 1;

    .app-header-top {
        border-bottom: 1px solid $light-grey;
    }

    .row {
        height: 80px;

        align-items: center;
        flex-wrap: nowrap;
    }

    div[class*="col"] {
        height: 48px
    }

}
</style>