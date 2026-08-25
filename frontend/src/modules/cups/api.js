import { get, post, patch } from "../../api/apiClient";

export function getCups() {
    return get('/cups');
}

export function createCup(data) {
    return post('/cups', data);
}

export function updateCup(id, data) {
    return patch(`/cups/${id}`, data);
}