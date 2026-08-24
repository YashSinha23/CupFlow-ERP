const BASE_URL = "http://10.6.87.67:8080/api";

export class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

async function request(endpoint, { method = 'GET', body, headers = {} } = {}) {
    
    // 1.Prepare the Request
    const token = localStorage.getItem("token");

    const finalHeaders = {
        "Content-Type" : "application/json",
        ...headers,
    };

    if(token) {
        finalHeaders["Authorization"] = `Bearer ${token}`;
    }

    // 2.Send the Request
    let response;
    try {
        response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: finalHeaders,
            body: body ? JSON.stringify(body) : undefined,
        });
    } catch (networkError) {
        throw new ApiError("Network error - could not reach the server.", 0, null);
    }

    // 3.Read the Response
    let envelope = null;
    try{
        envelope = await response.json();
    } catch {
        envelope = null;
    }


    // 4.Handle Errors
    if(response.status === 401) {
        localStorage.removeItem("token");
        if(unauthorizedHandler) {
            unauthorizedHandler();
        }
        throw new ApiError(
            envelope?.message || "Session expired. Please log in again.",
            401,
            null
        );
    }

    if(!response.ok || envelope?.success === false) {
        throw new ApiError(
            envelope?.message || `Request failed with status ${response.status}`,
            response.status,
            envelope?.data ?? null
        );
    }

    // 5.Reutrn only Useful data
    return envelope?.data;
}

export function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: "GET" });
}

export function post(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: "POST", body });
}

export function put(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: "PUT", body });
}

export function patch(endpoint, body, options = {}) {
  return request(endpoint, { ...options, method: "PATCH", body });
}

export function del(endpoint, options = {}) {
  return request(endpoint, { ...options, method: "DELETE" });
}