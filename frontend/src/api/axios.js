import axios from 'axios';

const backend_url = 'http://localhost:2000/';

const httpRequest = axios.create({
    baseURL: backend_url,
    timeout: 20000,
})

export default httpRequest;