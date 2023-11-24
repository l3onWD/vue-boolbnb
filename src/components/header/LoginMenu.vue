<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { apiClient } from '@/http/';


//*** DATA ***/
const router = useRouter();
const userStore = useUserStore();
const { user, isLogged } = storeToRefs(userStore);
const { removeUser } = userStore;
const isLoading = ref(false);

// Calculate username first letter
const userNameChar = computed(() => {
    if (!user.value) return '';
    return user.value.name.substring(0, 1).toUpperCase();
});


// Logout logic
const logout = () => {

    isLoading.value = true;

    apiClient.delete('/api/logout')
        .then(() => {
            // Reset browser store
            localStorage.removeItem('user');

            // Reset user store
            removeUser();

            // Redirect to login
            router.push({ name: 'login' })
        })
        .catch(err => {
            console.error(err);
        })
        .then(() => {
            isLoading.value = false;
        });
}

</script>


<template>
    <div class="login-menu dropdown">

        <!-- Menu Toggle -->
        <button class="dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">

            <!-- Bars icon -->
            <FontAwesomeIcon icon="bars" class="d-none d-md-block me-2" />

            <div class="login-menu-icon">

                <!-- Bootstrap Spinner -->
                <div v-if="isLoading" class="spinner-border" role="status"></div>

                <!-- User Logged Letter -->
                <span v-else-if="isLogged">{{ userNameChar }}</span>

                <!-- User Disconnected Icon -->
                <FontAwesomeIcon v-else icon="user" />

            </div>

        </button>


        <!-- Menu -->
        <ul class="dropdown-menu">

            <!-- Account Menu -->
            <li v-if="isLogged">
                <ul>
                    <li>
                        <a class="dropdown-item" href="http://127.0.0.1:8000/admin/apartments">I miei
                            Boolbnb</a>
                    </li>
                    <li>
                        <a class="dropdown-item " href="http://127.0.0.1:8000/admin">Il mio Profilo</a>
                    </li>
                    <li>
                        <a class="dropdown-item disabled" href="http://127.0.0.1:8000/login">Messaggi</a>
                    </li>
                    <li>
                        <button class="dropdown-item" @click="logout">Logout</button>
                    </li>

                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <a class="dropdown-item" href="http://127.0.0.1:8000/admin/apartments/create">Apri un
                            Boolbnb</a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="http://127.0.0.1:8000/profile">Account</a>
                    </li>
                </ul>
            </li>

            <!-- Login Menu -->
            <li v-else>
                <ul>
                    <li>
                        <RouterLink class="dropdown-item" :to="{ name: 'login' }">
                            <strong>Accedi</strong>
                        </RouterLink>
                    </li>
                    <li>
                        <a class="dropdown-item" href="http://127.0.0.1:8000/register">Registrati</a>
                    </li>
                </ul>
            </li>

            <!-- General Links -->
            <li>
                <hr class="dropdown-divider">
            </li>

            <li>
                <RouterLink class="dropdown-item" :to="{ name: 'home' }">Torna alla Home</RouterLink>
            </li>
        </ul>

    </div>
</template>


<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

.login-menu {
    @include flex;

    .dropdown-toggle:after {
        display: none;
    }

    .login-menu-icon {
        @include circle(40px);

        @include flex;
        color: white;
        background-color: black;
    }

    .spinner-border {
        @include circle(15px);
    }

    ul.dropdown-menu.show {
        @include font();
    }
}

// MEDIA MD
@media (min-width: 768px) {
    .login-menu {
        padding: 0 6px 0 10px;

        border: 1px solid $col-lightgrey;
        border-radius: 40px;

        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1);

        &:hover {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
        }

        .login-menu-icon {
            @include circle(30px);
        }
    }

}
</style>