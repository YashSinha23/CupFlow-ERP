package com.cupflow.CupFlow_ERP.user;

public enum UserRole {
    ADMIN,
    MANAGER,
    HR_MANAGER,
    FLOOR_SUPERVISOR,
    WORKER;

    // Java Enum -> DBstring
    // this means CURRENT_ENUM_OBJECT
    public String toDBValue() {
        return switch (this) {
            case FLOOR_SUPERVISOR -> "FLOOR SUPERVISOR";
            default -> this.name();
        };
    }

    // DBstring -> Java Enum
    public static UserRole fromDBValue(String value) {
        return switch (value) {
            case "FLOOR SUPERVISOR" -> FLOOR_SUPERVISOR;
            case "ADMIN" -> ADMIN;
            case "MANAGER" -> MANAGER;
            case "HR_MANAGER" -> HR_MANAGER;
            case "WORKER" -> WORKER;
            default -> throw new IllegalArgumentException("Unknown UserRole DB Value: " + value);
        };
    }
}
