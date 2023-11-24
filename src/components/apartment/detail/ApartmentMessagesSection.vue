<script setup>
import { computed, reactive, ref } from 'vue';
import { apiClient } from '@/http/';


//*** PROPS ***//
const props = defineProps({
    apartmentId: {
        type: Number,
        required: true
    }
});


//*** DATA ***//
// Form
const form = reactive({
    name: '',
    email: '',
    content: '',
});
const errors = ref({});

// Loader
const isLoading = ref(false);

// Alert
const alertType = ref('success');
const alertMsg = ref('');
const alertShow = ref(false);


//*** COMPUTED ***//
const hasErrors = computed(() => Object.entries(errors.value).length);


//*** FUNCTIONS ***//
// Send a message to the host
const sendMessage = () => {

    // Reset alert
    alertMsg.value = '';
    alertShow.value = false;

    // Check Frontend Validation
    validation();

    // Frontend Error
    if (hasErrors.value) {
        alertMsg.value = 'Si è verificato un errore!';
        alertType.value = 'danger';
        alertShow.value = true;
        return;
    }

    // Small loader
    isLoading.value = true;

    // Prepare parmas
    const params = {
        name: form.name,
        email: form.email,
        content: form.content,
        apartment_id: props.apartmentId
    };

    // Send message
    apiClient.post('/api/messages', params)
        .then(() => {

            // Reset form
            form.name = '';
            form.email = '';
            form.content = '';
            form.apartment_id = '';
            errors.value = {};

            // Set Success Alert
            alertType.value = 'success';
            alertMsg.value = 'Messaggio inviato';
            alertShow.value = true;

        })
        .catch(err => {

            // Backend Validation Error
            if (err.response.status === 400) {

                // Get Errors
                const { errors } = err.response.data;

                // Reset Messages
                const errorMessages = {};

                // Set Error Messages
                for (let field in errors) errorMessages[field] = errors[field][0];
                errors.value = { ...errorMessages };

            } else {
                // Other Errors
                errors.value = { network: 'si è verificato un errore' }
            }

            // Set Fail Alert
            alertType.value = 'danger';
            alertMsg.value = 'Si è verificato un errore!';
            alertShow.value = true;

        })
        .then(() => { isLoading.value = false })

}

const validation = () => {
    // Reset errors
    errors.value = {};

    // Name Validation
    if (!form.name) errors.value.name = 'Il nome è obbligatorio';

    // Content Validation
    if (!form.content) errors.value.content = 'Il contenuto della mail è obbligatorio';

    // Email Validation
    if (!form.email) errors.value.email = 'La mail è obbligatoria';

    else if (!form.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        errors.value.email = 'La mail inserita non è valida'
    }
}

</script>


<template>
    <section id="message-form" class="py-4">

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

                <textarea class="form-control" :class="{ 'is-invalid': errors.content }" placeholder="Scrivi un messaggio"
                    id="floatingTextarea" style="height: 160px;" v-model.trim="form.content" required></textarea>

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
                <div v-if="isLoading">
                    <div class="spinner-border" role="status"></div>
                </div>

                <!-- Alert -->
                <div class="alert fade" role="alert" :class="[`alert-${alertType}`, { 'show': alertShow }]">

                    <strong>
                        {{ alertMsg }}
                        <FontAwesomeIcon v-if="alertType === 'success'" :icon="['fas', 'thumbs-up']" bounce size="lg" />
                    </strong>

                    <button type="button" class="button-close ms-2" aria-label="Close" @click="alertShow = false">
                        <FontAwesomeIcon :icon="['fas', 'x']" />
                    </button>
                </div>

            </div>
        </form>
    </section>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

// Alert messages
.alert {
    margin: 0;
    padding: 12px;

    border-radius: 20px;
}

// Small loader
.spinner-border {
    @include circle(40px);

    color: $col-brand;
}

.dropdown-menu {
    padding: 8px 5px;

    @include font;
}
</style>