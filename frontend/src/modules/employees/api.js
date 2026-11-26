import { del, get, patch, post, put } from "../../api/apiClient";

export function getEmployees() {
  return get("/employees");
}

export function createEmployee(payload) {
  return post("/employees", payload);
}

export function updateEmployee(id, payload) {
  return put(`/employees/${id}`, payload);
}

export function updateEmployeeStatus(id, status, reactivateLogin = false) {
  return patch(`/employees/${id}/status`, { status, reactivateLogin });
}

export function linkEmployeeLogin(id, userId) {
  return put(`/employees/${id}/login-account`, { userId });
}

export function unlinkEmployeeLogin(id) {
  return del(`/employees/${id}/login-account`);
}
