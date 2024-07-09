import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_GROUNDSIM_URL,
    headers: {
        "Content-Type": "application/json"
    },
});

export default api;

export const login = (username: string, password: string, done: any, err:any) => {
    api.post('/user/login/', {
        username: username,
        password: password
    }).then(response => {
        const session_key = response.data.session_key;

        window.localStorage.setItem("session_key", session_key);
        if (done) {
            done();
        }
    }).catch(error => {
        if (err) {
            err();
        }
    });
}

export const register = (username: string, email:string, password: string, password2: string, done:any, err:any) => {
    api.post("/user/register/", {
        username: username,
        password: password,
        email: email,
        password2: password2,
    })
    .then(response => {
        const session_key = response.data.session_key;

        window.localStorage.setItem("session_key", session_key);

        if (done) {
            done();
        }
    })
    .catch(error => {
        if (err) {
            err();
        }
    });
}