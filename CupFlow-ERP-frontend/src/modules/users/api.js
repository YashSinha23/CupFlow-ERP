import { get, post, patch } from "../../api/apiClient";

export function getUsers() {
    return get('/users');
}

export function createUser(payload) {
    return post('/users', payload);
}

export function activateUser(id) {
    return patch(`/users/${id}/activate`);
}

export function deactivateUser(id) {
    return patch(`/users/${id}/deactivate`);
}