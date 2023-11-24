<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import { apiClient } from '@/http/';


//*** FORM ***//
// Data
const form = reactive({
    email: '',
    password: ''
});
const errors = ref({});

const hasErrors = computed(() => Object.entries(errors.value).length);


// Functions
const submitForm = () => {

    if (isLoading.value) return;

    // Validation
    validateForm();
    if (hasErrors.value) return;

    // Login
    login();
}

const validateForm = () => {
    errors.value = {};

    // Email Validation
    if (!form.email) errors.value.email = 'La mail è obbligatoria';

    else if (!form.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        errors.value.email = 'La mail inserita non è valida'
    }

    // Password Validation
    if (!form.password) errors.value.password = 'La password è obbligatoria';

    else if (form.password.length < 5) errors.value.password = 'La password è troppo corta';
}


//*** LOGIN ***//
const userStore = useUserStore();
const { setUser } = userStore;
const isLoading = ref(false);
const router = useRouter();

const login = async () => {

    isLoading.value = true;

    try {
        // Get cookie with token
        await apiClient.get('/sanctum/csrf-cookie');

        // Attempt login
        const { data } = await apiClient.post('/api/login', form);

        // Save user to local storage
        localStorage.user = JSON.stringify(data);

        // Set user
        setUser(data);

        // Redirect
        router.push({ name: 'dashboard' })

    } catch (err) {
        errors.value.generic = 'Le Credenziali non sono valide';
    } finally {
        isLoading.value = false;
    }

}

</script>


<template>
    <div id="login-page" class="container my-4">

        <div class="login-panel">

            <h2 class="mb-4">Accedi</h2>

            <!-- Generic Error -->
            <div v-if="errors.generic" class="alert alert-danger">{{ errors.generic }}</div>

            <!-- Form -->
            <form @submit.prevent="submitForm" novalidate>

                <!-- Email -->
                <div class="row mb-4">
                    <label for="email" class="col-form-label col-12 col-md-4">E-Mail</label>
                    <div class="col-12 col-md-6">
                        <!-- Input -->
                        <input v-model.trim="form.email" id="email" type="email" class="form-control"
                            :class="{ 'is-invalid': errors.email }" autocomplete="email" :disabled="isLoading">
                        <!-- Errors -->
                        <div class="invalid-feedback"> {{ errors.email }} </div>
                    </div>
                </div>

                <!-- Password -->
                <div class="row mb-4">
                    <label for="password" class="col-form-label col-12 col-md-4">Password</label>
                    <div class="col-12 col-md-6">
                        <!-- Input -->
                        <input v-model.trim="form.password" id="password" type="password" class="form-control"
                            :class="{ 'is-invalid': errors.password }" :disabled="isLoading">
                        <!-- Errors -->
                        <div class="invalid-feedback"> {{ errors.password }} </div>
                    </div>
                </div>

                <!-- Submit -->
                <div class="d-flex justify-content-md-center">
                    <button class="button button-brand">
                        <div v-if="isLoading" class="spinner-border" role="status"></div>
                        <span v-else>Login</span>
                    </button>
                </div>
            </form>
        </div>

    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

#login-page {

    display: flex;
    justify-content: center;

    .login-panel {
        padding: 1.5rem;
        width: 100%;

        border-radius: 0.5rem;
        box-shadow: 0 0 8px 4px rgba($color: #000, $alpha: 0.1);
    }

    .spinner-border {
        @include circle(20px);
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