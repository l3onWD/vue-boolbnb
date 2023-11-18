<script>
import AppLoader from '../components/AppLoader.vue';
import ApartmentsList from '../components/apartment/ApartmentsList.vue';

import { apiClient } from '@/http/';


export default {
    components: { ApartmentsList, AppLoader },
    data: () => ({
        apartmentsPromoted: [],
        apartmentsRandom: [],
        isLoading: true,
        currentPage: 1,
        lastPage: null,
        cardLoader: false,
        rand_seed: null,
    }),
    methods: {
        fetchApartments(endpoint = '', successCallback) {
            apiClient.get('/apartments' + endpoint)
                .then(successCallback)
                .catch(err => {
                    console.error(err);
                })
                .then(() => {
                    this.isLoading = false;
                });
        },
        infiniteScroll() {
            if ((this.currentPage >= this.lastPage || this.cardLoader)) return;

            // Height of apartment list (section that you see on the page)
            const apartmentListHeight = this.$refs.apartmentList.getBoundingClientRect().height;
            // The pixels that scrolled the apartment list from the top side of the window
            const apartemntListTopScroll = this.$refs.apartmentList.scrollTop;
            // Total height of the entire element, visible and invisible
            const totalHeight = this.$refs.apartmentList.scrollHeight;
            // How many pixels before the bottom does the call start
            const tollerance = 10;

            if ((apartemntListTopScroll + apartmentListHeight) + tollerance >= totalHeight) {
                this.currentPage++

                if (!this.cardLoader) {
                    window.requestAnimationFrame(() => {
                        this.cardLoader = true;

                        // Call api for another 10 apartments
                        this.fetchApartments(`/random?page=${this.currentPage}&rand_seed=${this.rand_seed}`, res => { this.apartmentsRandom.push(...res.data.data) });

                        setTimeout(() => {
                            this.cardLoader = false;
                        }, 1000)
                    });
                }
            }

            // Button scroll-top
            if (apartemntListTopScroll >= 200) {
                this.$refs.topButton.classList.add('show');
            } else {
                this.$refs.topButton.classList.remove('show')
            }

        },
        backTop() {
            this.$refs.apartmentList.scrollTop = 0;
        }

    },
    created() {
        // Set random seed (to avoid duplication)
        this.rand_seed = Math.random();

        // Fetch Promoted List
        this.fetchApartments('/promoted', res => { this.apartmentsPromoted = res.data; });

        // Fetch Random List
        this.fetchApartments(`/random?page=${this.currentPage}&rand_seed=${this.rand_seed}`, res => { this.apartmentsRandom = res.data.data; this.lastPage = res.data.last_page });
    }
}
</script>

<template>
    <main @scroll="infiniteScroll" ref="apartmentList">

        <!-- Promoted Appartments -->
        <ApartmentsList v-if="!isLoading && apartmentsPromoted.length" :apartments="apartmentsPromoted"
            infoMessage="I boolbnb in evidenza sono consigliati dal nostro team!" title="Boolbnb in evidenza" />

        <!-- Random Appartments -->
        <ApartmentsList v-if="!isLoading" :apartments="apartmentsRandom" title="I nostri boolbnb"
            infoMessage="I boolbnb vengono mostrati in ordine casuale" :cardLoader="cardLoader" />

        <!-- Loader -->
        <AppLoader :is-loading="isLoading" :cardLoading="true" />

        <!-- Back-top-button -->
        <button ref="topButton" class="back-top circle-button" @click="backTop()">
            <FontAwesomeIcon icon="angles-up" />
        </button>
    </main>
</template>

<style lang="scss">
main {
    position: relative;
    scroll-behavior: smooth;
    overflow-x: hidden;
}

.back-top {
    position: fixed;
    inset: auto 11px 60px auto;
    background-color: white;
    scale: 0.1;
    opacity: 0;
    transition: all .2s linear;

    &.show {
        opacity: 1;
        scale: 1;
    }
}
</style>