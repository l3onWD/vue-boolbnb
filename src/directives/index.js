export const clickOutside = {
    mounted(el, binding) {

        // Listener callback
        el.clickOutsideEvent = e => {
            if (!el.contains(e.target)) binding.value();
        };

        // Create listener
        document.addEventListener('click', el.clickOutsideEvent);
    },

    unmounted(el) {
        // Remove listener
        document.removeEventListener('click', el.clickOutsideEvent);
    }
}