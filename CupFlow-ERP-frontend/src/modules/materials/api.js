import { get, post, patch } from "../../api/apiClient";

export function getMaterials() {
    return get('/materials');
}

export function createMaterial(data) {
    return post('/materials', data);
}

export function updateMaterial(id, data) {
    return patch(`/materials/${id}`, data);
}