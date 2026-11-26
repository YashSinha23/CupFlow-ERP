import { get, put } from "../../api/apiClient";

export function getShiftDefinitions() {
  return get("/shifts");
}

export function getShiftEmployees() {
  return get("/shifts/employees");
}

export function getShiftAssignments(from, to) {
  const query = new URLSearchParams({ from, to });
  return get(`/shifts/assignments?${query.toString()}`);
}

export function saveShiftAssignments(assignments) {
  return put("/shifts/assignments/bulk", { assignments });
}
