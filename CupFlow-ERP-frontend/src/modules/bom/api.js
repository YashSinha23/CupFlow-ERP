import { get, post, patch, del } from "../../api/apiClient";

export function getBomByCup(cupId) {
    return get(`/bom/${cupId}`);
}

export function createBomEntry(data) {
    return post('/bom', data);
}

export function updateBomEntry(id, data) {
    return patch(`/bom/${id}`, data);
}

export function deleteBomEntry(id) {
    return del(`/bom/${id}`);
}