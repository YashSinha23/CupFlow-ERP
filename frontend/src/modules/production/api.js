import { get, post, put } from "../../api/apiClient";

export function getProductionOrders() {
  return get("/production/orders");
}

export function getEligibleWorkers() {
  return get("/production/workers");
}

export function assignProductionWorker(orderId, workerId) {
  return put(`/production/orders/${orderId}/assignment`, { workerId });
}

export function advanceProductionOrder(orderId, payload) {
  return post(`/production/orders/${orderId}/advance`, payload);
}

export function getProductionHistory(orderId) {
  return get(`/production/orders/${orderId}/history`);
}
