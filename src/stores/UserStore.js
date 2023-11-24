import { defineStore } from 'pinia';
import { computed, ref } from 'vue';


export const useUserStore = defineStore('user', () => {

    //*** DATA ***//
    const user = ref(null);

    //*** GETTERS ***//
    const isLogged = computed(() => user.value !== null);

    //*** ACTIONS ***//
    const setUser = newUser => { user.value = newUser };
    const removeUser = () => { user.value = null };


    return { user, isLogged, setUser, removeUser };

});