<script>
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import AppLoader from '@/components/AppLoader.vue';
import ApartmentImageSection from '@/components/apartment/detail/ApartmentImageSection.vue';
import ApartmentInfoSection from '@/components/apartment/detail/ApartmentInfoSection.vue';
import ApartmentHostSection from '@/components/apartment/detail/ApartmentHostSection.vue';
import ApartmentDescriptionSection from '@/components/apartment/detail/ApartmentDescriptionSection.vue';
import ApartmentMapSection from '@/components/apartment/detail/ApartmentMapSection.vue';
import ApartmentServicesSection from '@/components/apartment/detail/ApartmentServicesSection.vue';


export default {

    components: { AppLoader, ApartmentImageSection, ApartmentInfoSection, ApartmentHostSection, ApartmentMapSection, ApartmentDescriptionSection, ApartmentServicesSection },

    data() {
        return {
            apartment: '',
            services: [],
            isLoading: true,
            form: {
                name: '',
                email: '',
                content: '',
            },
            errors: {},
            successMessage: '',
            loadingMessage: false
        }
    },

    computed: {
        hasErrors() {
            return Object.entries(this.errors).length
        }
    },

    methods: {

        // Get apartment details
        getApartment() {
            apiClient.get('/apartments/' + this.$route.params.id)
                .then(res => { this.apartment = res.data })
                .catch(() => { this.$router.push({ name: 'not-found', query: { error: 404 } }) })
                .then(() => { this.isLoading = false; });
        },


        // Send a message to the host
        sendMessage() {
            // Validation
            this.validation();

            // If there isn't errors
            if (!this.hasErrors) {
                // Small loader
                this.loadingMessage = true;
                // Send message
                apiClient.post('/messages', {
                    name: this.form.name,
                    email: this.form.email,
                    content: this.form.content,
                    apartment_id: this.apartment.id
                })
                    .then(() => { this.form = { name: '', email: '', content: '', apartment_id: '' }; this.errors = {}; this.successMessage = 'Messaggio inviato'; })
                    .catch(err => {
                        if (err.response.status === 400) {
                            const { errors } = err.response.data;
                            const errorMessages = {};
                            for (let field in errors) errorMessages[field] = errors[field][0];
                            this.errors = errorMessages;

                        } else {
                            this.errors = { network: 'si è verificato un errore' }
                        }
                        this.successMessage = ''
                    })
                    .then(() => { this.loadingMessage = false })
            }
        },


        validation() {
            this.errors = {};
            if (!this.form.name) { this.errors.name = 'Il nome è obbligatorio' }
            if (!this.form.content) { this.errors.content = 'Il contenuto della mail è obbligatorio' }
            if (!this.form.email) {
                this.errors.email = 'La mail è obbligatoria'
            } else if (!this.form.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                this.errors.email = 'La mail inserita non è valida'
            }
        },


        isEmpty(obj) {
            return Object.entries(obj).length
        },

    },


    created() {
        this.getApartment();
    }
}
</script>


<template>
    <main>

        <div v-if="!isLoading" class="container">

            <!-- Header -->
            <header class="d-flex align-items-center justify-content-between py-4">

                <h2>{{ apartment.title }}</h2>

                <button class="circle-button" @click="$router.back()">
                    <FontAwesomeIcon :icon="['fas', 'chevron-left']" />
                </button>

            </header>


            <!-- Page Content -->
            <div>

                <!-- Image -->
                <ApartmentImageSection :image-file="apartment.image" :image-title="apartment.title" />


                <!-- Info -->
                <ApartmentInfoSection :address="apartment.address" :rooms="apartment.rooms" :beds="apartment.beds"
                    :bathrooms="apartment.bathrooms" />


                <!-- Host information -->
                <hr v-if="apartment.user.name">

                <ApartmentHostSection v-if="apartment.user.name" :hostName="apartment.user.name" />


                <!-- Description -->
                <hr>

                <ApartmentDescriptionSection :description="apartment.description" />


                <!-- Services -->
                <hr>

                <ApartmentServicesSection :services="apartment.services" />


                <!-- Map -->
                <hr v-if="apartment.address">

                <ApartmentMapSection v-if="apartment.address" :address="apartment.address" :latitude="apartment.latitude"
                    :longitude="apartment.longitude" />


                <!-- Messages -->
                <hr>

                <section id="message-form">

                    <h3 class="mb-3">Hai domande? Invia un messaggio all'host</h3>

                    <!-- Form -->
                    <form class="form-floating needs-validation" @submit.prevent="sendMessage" novalidate>

                        <!-- Name -->
                        <div class="mb-4">

                            <label for="name" class="form-label">
                                Inserisci il tuo nome
                                <span class="form-text text-danger fs-5">*</span>
                            </label>

                            <input type="text" class="form-control" :class="{ 'is-invalid': errors.name }" id="name"
                                v-model.trim="form.name" autocomplete="name" required>

                            <span v-if="errors.name" class="invalid-feedback" role="alert">{{ errors.name }}</span>

                            <span id="title-error" class="text-danger"></span>

                        </div>

                        <!-- Email -->
                        <div class="mb-4">

                            <label for="email" class="form-label">
                                Inserisci la tua email
                                <span class="form-text text-danger fs-5">*</span>
                            </label>

                            <input type="email" class="form-control" :class="{ 'is-invalid': errors.email }" id="email"
                                placeholder="nome@esempio.com" v-model.trim="form.email" autocomplete="email" required>

                            <span v-if="errors.email" class="invalid-feedback" role="alert">{{ errors.email }}</span>

                        </div>

                        <!-- Content -->
                        <div class="mb-2">

                            <label for="floatingTextarea" class="form-label">
                                Contenuto del messaggio
                                <span class="form-text text-danger fs-5">*</span>
                            </label>

                            <textarea class="form-control" :class="{ 'is-invalid': errors.content }"
                                placeholder="Scrivi un messaggio" id="floatingTextarea" style="height: 160px;"
                                v-model.trim="form.content" required></textarea>

                            <span v-if="errors.content" class="invalid-feedback" role="alert">{{ errors.content
                            }}</span>

                        </div>

                        <div class="dropdown mb-3">
                            <button class="button-info" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon :icon="['fas', 'question']" size="xs" />
                            </button>
                            <div class="dropdown-menu text-danger  ">
                                I campi contrassegnati (*) sono obbligatori.
                            </div>
                        </div>

                        <!-- Send form -->
                        <div class="d-flex align-items-center gap-4">

                            <button type="submit" class="button button-light">Invia messaggio</button>

                            <!-- Small loader -->
                            <div v-if="loadingMessage">
                                <div class="spinner-border" role="status"></div>
                            </div>

                            <!-- Alert success -->
                            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">

                                <strong>
                                    {{ successMessage }}
                                    <FontAwesomeIcon :icon="['fas', 'thumbs-up']" bounce size="lg" />
                                </strong>

                                <button type="button" class="button-close" data-bs-dismiss="alert" aria-label="Close">
                                    <FontAwesomeIcon :icon="['fas', 'x']" />
                                </button>

                            </div>

                            <!-- Alert error -->
                            <div v-if="isEmpty(errors)" class="alert alert-danger alert-dismissible fade show" role="alert">

                                <strong>Si è verificato un errore!</strong>

                                <button type="button" class="button-close" data-bs-dismiss="alert" aria-label="Close">
                                    <FontAwesomeIcon :icon="['fas', 'x']" />
                                </button>
                            </div>

                        </div>
                    </form>
                </section>

            </div>

        </div>

    </main>


    <!-- Loader -->
    <AppLoader :is-loading="isLoading" />
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;


// Section message
#message-form {
    padding: 24px 0;
}

// Alert messages
.alert {
    margin: 0;
    padding: 12px;
    border-radius: 20px;
}

.button-close {
    padding-left: 10px;
}

// Small loader
.spinner-border {
    @include circle(40px);
    color: $brand-color;
}

.dropdown-menu {
    @include font;
    padding: 8px 5px;
}
</style>