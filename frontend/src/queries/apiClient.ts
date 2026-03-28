import axios from 'axios';

const apiClient = axios.create({
    withCredentials: true,  // Wichtig für CSRF-Token-Cookie-Handling
    xsrfCookieName: 'csrftoken',  // Django's Standard-CSRF-Cookie-Name
    xsrfHeaderName: 'X-CSRFToken', // Django's Standard-CSRF-Header-Name
});

export default apiClient;
