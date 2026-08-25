import { get, post } from "../../api/apiClient";

export function getOrders() {
    return get("/orders");
}

export function getOrderById(id) {
    return get(`/orders/${id}`);
}

export function createOrder(payload) {
    return post("/orders", payload);
}

export function advanceOrder(orderId, payload) {
    return post(`/production/orders/${orderId}/advance`, payload);
}

export function getOrderHistory(orderId) {
    return get(`/production/orders/${orderId}/history`);
}

export function dispatchOrder(orderId, payload) {
    return post(`/dispatch/orders/${orderId}`, payload);
}

export function retryReservation(orderId) {
    return post(`/orders/${orderId}/retry-reservation`);
}