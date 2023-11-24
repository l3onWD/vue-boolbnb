import axios from 'axios';


//*** TOM TOM CLIENT ***/
const TOMTOM_API_KEY = import.meta.env.VITE_TT_API_KEY;
const ttBaseURL = 'https://api.tomtom.com/search/2/geocode/';

// Create Tom Tom Axios instance
const ttClient = axios.create({ baseURL: ttBaseURL });

// Inject Tom Tom Api key
ttClient.interceptors.request.use(config => {
    config.params = config.params || {};
    config.params.key = TOMTOM_API_KEY;
    return config;
});


//*** API CLIENT ***/
const apiBaseURL = 'http://localhost:8000';

// Create API Axios instance
const apiClient = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true
});

export { ttClient, apiClient };