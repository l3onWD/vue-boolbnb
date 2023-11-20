<script></script>

<template>
    <footer>
        <div class="container">

            <div class="d-flex justify-content-between align-items-center h-100">

                <!-- Copyright -->
                <div>© 2023 Boolbnb, inc.</div>

                <!-- Social Bar -->
                <ul>
                    <li>
                        <a href="https://www.facebook.com/">
                            <FontAwesomeIcon icon="fa-brands fa-facebook" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com/">
                            <FontAwesomeIcon icon="fa-brands fa-instagram" />
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com/">
                            <FontAwesomeIcon icon="fa-brands fa-x-twitter" />
                        </a>
                    </li>
                </ul>

            </div>

        </div>
    </footer>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/vars' as *;

footer {
    height: 40px;
    border-top: 1px solid $light-grey;

    .container {
        height: 100%;
    }

    ul {
        @include flex;
        gap: 15px;
    }
}
</style>