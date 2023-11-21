<script>
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import TheBackTopButton from '@/components/base/TheBackTopButton.vue';
import ApartmentsList from '@/components/apartment/ApartmentsList.vue';



export default {

    components: { ApartmentsList, TheBackTopButton },

    data: () => ({
        apartmentsPromoted: [],
        apartmentsRandom: [],
        rand_seed: null,
        currentPage: 1,
        lastPage: null,

        isBackTopVisible: false,

        isLoading: false,
        scrollThrottling: false
    }),

    methods: {

        fetchApartments(endpoint = '', successCallback) {

            this.isLoading = true;

            apiClient.get('/apartments' + endpoint)
                .then(successCallback)
                .catch(err => {
                    console.error(err);
                })
                .then(() => {
                    this.isLoading = false;
                });
        },

        handleScroll() {

            // Scroll Throttling
            if (!this.scrollThrottling) {

                window.requestAnimationFrame(() => {

                    // Settings
                    const scrollTollerance = 10;
                    const backTopVisibilityThreshold = 200;

                    // Element sroll data
                    const elem = this.$refs.mainContent;
                    const scrollTop = elem.scrollTop;
                    const scrollBottom = scrollTop + elem.getBoundingClientRect().height;
                    const scrollTotalHeight = elem.scrollHeight;
                    const isBottomReached = (scrollTotalHeight - scrollBottom) <= scrollTollerance;


                    // Infinite scroll logic
                    if (this.currentPage < this.lastPage && isBottomReached && !this.isLoading) {

                        this.currentPage++

                        // Call api for another 10 apartments
                        this.fetchApartments(`/random?page=${this.currentPage}&rand_seed=${this.rand_seed}`, res => {
                            this.apartmentsRandom.push(...res.data.data);
                        });
                    }


                    // Back top visibility logic
                    if (scrollTop >= backTopVisibilityThreshold) this.isBackTopVisible = true;
                    else this.isBackTopVisible = false;


                    this.scrollThrottling = false;
                });

                this.scrollThrottling = true;
            }


        },

        backTop() {
            this.$refs.mainContent.scrollTop = 0;
        },

        test() {
            console.log('TEST');
        }

    },
    created() {

        // Set random seed (to avoid duplicates)
        this.rand_seed = Math.random();

        // Fetch Promoted List
        this.fetchApartments('/promoted', res => {
            this.apartmentsPromoted = res.data;
        });

        // Fetch Random List
        this.fetchApartments(`/random?page=${this.currentPage}&rand_seed=${this.rand_seed}`, res => {
            this.apartmentsRandom = res.data.data;
            this.lastPage = res.data.last_page;
        });
    },

    mounted() {
        this.$refs.mainContent.addEventListener('scroll', this.handleScroll);
    },

    unmounted() {
        this.$refs.mainContent.removeEventListener('scroll', this.handleScroll);
    }
}
</script>

<template>
    <main ref="mainContent">

        <!-- Promoted Appartments -->
        <ApartmentsList v-if="apartmentsPromoted.length" :apartments="apartmentsPromoted"
            infoMessage="I boolbnb in evidenza sono consigliati dal nostro team!" title="Boolbnb in evidenza" />

        <!-- Random Appartments -->
        <ApartmentsList :apartments="apartmentsRandom" title="I nostri boolbnb"
            infoMessage="I boolbnb vengono mostrati in ordine casuale" :isLoading="isLoading" />

        <!-- Back-top-button -->
        <TheBackTopButton :isVisible="isBackTopVisible" @@back-top="backTop" />

    </main>
</template>

<style>
main {
    position: relative;

    scroll-behavior: smooth;
}
</style>