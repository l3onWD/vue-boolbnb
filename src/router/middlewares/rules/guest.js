import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';


export default (to, from, next) => {
    const userStore = useUserStore();
    const { isLogged } = storeToRefs(userStore);

    if (isLogged.value) next({ name: 'dashboard' });
    else next();
}