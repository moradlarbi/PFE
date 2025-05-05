import axios from 'axios';

const instance = axios.create({
    baseURL: "https://probable-chainsaw-5r6j9x5xx96cp6vj-3000.app.github.dev/api",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default instance;