import axios from "axios";

/**
 * Base client for all requests to the api.
 */
const apiClient = axios.create({
    headers: {
        "Content-type": "application/json"
    }
});

apiClient.defaults.xsrfHeaderName = "X-CSRFTOKEN";
apiClient.defaults.xsrfCookieName = "csrftoken";

export default apiClient