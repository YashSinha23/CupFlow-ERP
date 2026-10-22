export const WORKFLOW_STAGES = [
  "ORDER_RECEIVED",
  "RAW_MATERIAL_ISSUED",
  "SHEET_MAKING_IN_PROGRESS",
  "SHEET_READY",
  "CUP_MOLDING_IN_PROGRESS",
  "CUPS_READY_FOR_PRINTING",
  "PRINTING_IN_PROGRESS",
  "READY_TO_DISPATCH",
];

export const PRODUCTION_LANES = [
  {
    title: "Awaiting materials",
    hint: "Orders not yet issued to production",
    stages: ["ORDER_RECEIVED"],
    tone: "slate",
  },
  {
    title: "Materials issued",
    hint: "Ready to begin sheet production",
    stages: ["RAW_MATERIAL_ISSUED"],
    tone: "blue",
  },
  {
    title: "Sheet production",
    hint: "Making and preparing sheets",
    stages: ["SHEET_MAKING_IN_PROGRESS", "SHEET_READY"],
    tone: "violet",
  },
  {
    title: "Cup molding",
    hint: "Forming cups from prepared sheets",
    stages: ["CUP_MOLDING_IN_PROGRESS", "CUPS_READY_FOR_PRINTING"],
    tone: "amber",
  },
  {
    title: "Printing",
    hint: "Printing customer designs",
    stages: ["PRINTING_IN_PROGRESS"],
    tone: "teal",
  },
  {
    title: "Ready to dispatch",
    hint: "Production is complete",
    stages: ["READY_TO_DISPATCH"],
    tone: "green",
  },
];

export function formatStage(stage) {
  return (stage || "")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatDate(value) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export function getDueState(value) {
  if (!value) return "normal";
  const due = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntil = Math.ceil((due - today) / 86400000);
  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 2) return "soon";
  return "normal";
}

export function orderMatches(order, search) {
  if (!search) return true;
  return [order.orderCode, order.cupName, order.assignedWorkerName]
    .filter(Boolean)
    .some((value) => value.toLowerCase().includes(search));
}
