import axios from 'axios';
import { ConfigureMission } from 'types/ConfigureMission';

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
        let session_key = response.data.account.session_key;
        let the_username = response.data.account.username;
        let the_email = response.data.account.email;
        let api_key = response.data.account.api_key;

        window.localStorage.setItem("session_key", session_key);
        window.localStorage.setItem("username", the_username);
        window.localStorage.setItem("email", the_email);
        window.localStorage.setItem("api_key", api_key);

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

export const logout = (email:string, done:any, err:any) => {
    api.post("/user/logout/", {
        email: email
    })
    .then(response => {
        window.localStorage.removeItem("session_key");

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

export const createMission = (mission:ConfigureMission, done:any, err:any) => {
    api.post("/mission/create/", JSON.stringify(mission))
    .then(response => {
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