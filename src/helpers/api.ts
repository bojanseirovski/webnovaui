import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_API_GROUNDSIM_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

api.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem('session_key');
        if (token) {
            config.headers.Authorization = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await refreshToken();
                    const { accessToken } = rs.data;
                    window.localStorage.setItem("session_key", accessToken);
                    api.defaults.headers.common["x-access-token"] = accessToken;

                    return api(originalConfig);
                } catch (_error:any) {
                    if (_error.response && _error.response.data) {
                        return Promise.reject(_error.response.data);
                    }

                    return Promise.reject(_error);
                }
            }

            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data);
            }
        }

        return Promise.reject(err);
    }
);

export default api;

function getLocalRefreshToken() {
    const refreshToken = window.localStorage.getItem("refreshToken");
    return refreshToken;
}

function refreshToken() {
    return api.post("/token/refresh", {
        refreshToken: getLocalRefreshToken(),
    });
}

export const getLocalAccessToken = () => {
    const accessToken = window.localStorage.getItem("accessToken");
    return accessToken;
}

export const getUid = () => {
    return window.localStorage.getItem("uid");;
}