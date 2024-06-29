import axios from 'axios';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

const axiosInstance = axios.create({
    baseURL: apiEndpoint
});

export default axiosInstance;