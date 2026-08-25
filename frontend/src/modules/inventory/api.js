import { get, post } from "../../api/apiClient";

export function getStockSummary() {
    return get('/inventory/stock');
}

export function stockIn(payload) {
    return post('/inventory/stock-in', payload)
}
// export const getStockSummary = () => apiClient.get("/inventory/stock");

// export const stockIn = (payload) => apiClient.post("/inventory/stock-in", payload);