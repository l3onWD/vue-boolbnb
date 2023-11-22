<script>
import { apiClient } from '@/http/';

//*** COMPONENTS ***//
import AppLoader from '@/components/AppLoader.vue';
import ApartmentImageSection from '@/components/apartment/detail/ApartmentImageSection.vue';
import ApartmentInfoSection from '@/components/apartment/detail/ApartmentInfoSection.vue';
import ApartmentHostSection from '@/components/apartment/detail/ApartmentHostSection.vue';
import ApartmentMapSection from '@/components/apartment/detail/ApartmentMapSection.vue';


export default {

    components: { AppLoader, ApartmentImageSection, ApartmentInfoSection, ApartmentHostSection, ApartmentMapSection },

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

    methods: {
        // Get all services
        fetchServices() {
            apiClient.get('/services')
                .then(res => { this.services = res.data });
        },

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

        // Services not available in the apartment
        serviceNotAvailable() {
            // Services of the apartament (Available Services)
            const avServ = this.apartment.services;

            // Array with ids of available services
            const avServId = avServ.map(s => s.id);

            // Array with services not available
            return this.services.filter(s => !avServId.includes(s.id));

        },

        getServiceClass() {
            if (this.apartment.services.length <= 5) {
                return 'services-small'
            } else if (this.apartment.services.length <= 10) {
                return 'services-medium'
            } else if (this.apartment.services.length > 10) {
                return 'services-large'
            }
        },

        isEmpty(obj) {
            return Object.entries(obj).length
        },

    },

    created() {
        this.getApartment();
        this.fetchServices();
    },

    computed: {
        hasErrors() {
            return Object.entries(this.errors).length
        }
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

                <div class="py-4">
                    <h3 class="mb-2">Descrizione</h3>
                    <p>{{ apartment.description }}</p>
                </div>


                <!-- Services -->
                <hr>

                <div :id="getServiceClass()" class="py-4">

                    <h3 class="mb-3">Cosa troverai</h3>

                    <div>

                        <ul class="service-list onPage">
                            <li v-for="service in apartment.services">
                                <div><img :src="`http://127.0.0.1:8000/img/service/${service.icon}`" :alt="service.name">
                                </div>
                                <span>{{ service.name }}</span>
                            </li>
                        </ul>

                        <div class="service-all">

                            <h2>Scopri tutti i servizi</h2>

                            <div>
                                <!-- Modal Button -->
                                <button type="button" class="services-button button button-light" data-bs-toggle="modal"
                                    data-bs-target="#serviceModal">Mostra tutti i {{ services.length }}
                                    servizi </button>
                            </div>

                        </div>

                        <!-- Service modal -->
                        <div class="modal fade modal-lg" id="serviceModal" tabindex="-1" aria-labelledby="serviceModalLabel"
                            aria-hidden="true">

                            <div class="modal-dialog">
                                <div class="modal-content">

                                    <div class="modal-header">
                                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                                            aria-label="Close"></button>
                                    </div>

                                    <div class="modal-body">

                                        <h3 class="mb-3">Cosa troverai</h3>

                                        <ul class="service-list modal-services">
                                            <li v-for="service in apartment.services">
                                                <div><img :src="`http://127.0.0.1:8000/img/service/${service.icon}`"
                                                        :alt="service.name"></div>
                                                <span>{{ service.name }}</span>
                                            </li>
                                        </ul>

                                        <div v-if="serviceNotAvailable().length">

                                            <h3 class="mt-5 mb-3">Non incluso</h3>

                                            <ul class="service-list modal-services">
                                                <li v-for="service in serviceNotAvailable()">
                                                    <div>
                                                        <img :src="`http://127.0.0.1:8000/img/service/${service.icon}`"
                                                            :alt="service.name">
                                                    </div>
                                                    <span class="text-decoration-line-through">{{ service.name }}</span>
                                                </li>
                                            </ul>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                </div>


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

// Apartment image
img {
    @include max-size;
    object-fit: cover;
}

ul {
    display: flex;
    gap: 20px;
    font-size: 16px;
}

// _____________SERVICES
// LEFT PART
// Service list generics
.service-list {
    @include flex(stretch, stretch, column, wrap, 10px);
    flex-grow: 1;

    li {
        @include flex(start, center, $gap: 7px);
        border: 1px solid $light-grey;
        border-radius: 15px;
        padding: 10px;

        div {
            @include square(20px);
            overflow: hidden;

            img {
                @include max-size;
                object-fit: contain;
                filter: brightness(0) saturate(100%);
                display: block
            }
        }
    }
}

// Service list on apartment page
.service-list.onPage {
    max-height: 270px;
    overflow: hidden;
    flex-wrap: nowrap;
}

// RIGHT PART
.service-all {
    @include flex(center, center, column, $gap: 10px);
    padding: 20px 0;

    h2 {
        display: none;
    }
}

// Button modal
.services-button {
    display: flex;
}

#services-small>div,
#services-medium>div,
#services-large>div {
    display: flex;
    flex-direction: column;
}

// Service list on modal
.service-list.modal-services {
    @include flex(center, stretch, column, wrap, 10px);

    li div {
        @include square(30px);
    }
}

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

/////////////////
// MEDIA QUERY //
/////////////////

@media (min-width: 576px) {
    .service-list.onPage {
        flex-wrap: wrap;
    }

    #services-large .service-list.onPage {
        gap: 5px;

        li {
            width: calc(50% - 7px / 2);
        }
    }

    .service-all {
        flex-basis: 50%;
    }
}

@media (min-width: 768px) {

    #services-small,
    #services-medium {
        flex-basis: 45%;

        &>div {
            flex-direction: row;
        }

        h2 {
            display: flex;
        }
    }

    #services-large .service-list.onPage {
        li {
            width: 32%
        }
    }

    .service-list.onPage {
        gap: 7px;
    }

    .service-list.modal-services {
        @include flex(start, center, row, wrap, 10px);

        li {
            flex: 0 0 calc(50% - 5px);
        }
    }
}

@media (min-width: 992px) {
    .service-list.onPage {
        gap: 10px;
    }

    #services-large .service-list.onPage {
        gap: 7px;
    }

    .service-all {
        flex-basis: 50%;
    }
}
</style>