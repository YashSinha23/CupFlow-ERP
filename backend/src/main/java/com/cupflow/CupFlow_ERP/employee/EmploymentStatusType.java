package com.cupflow.CupFlow_ERP.employee;

import org.hibernate.type.descriptor.WrapperOptions;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class EmploymentStatusType implements UserType<EmploymentStatus> {

    @Override
    public int getSqlType() {
        return Types.OTHER;
    }

    @Override
    public Class<EmploymentStatus> returnedClass() {
        return EmploymentStatus.class;
    }

    @Override
    public boolean equals(EmploymentStatus first, EmploymentStatus second) {
        return first == second;
    }

    @Override
    public int hashCode(EmploymentStatus value) {
        return value == null ? 0 : value.hashCode();
    }

    @Override
    public EmploymentStatus nullSafeGet(ResultSet resultSet, int position,
                                        WrapperOptions options) throws SQLException {
        String value = resultSet.getString(position);
        if (resultSet.wasNull() || value == null) return null;
        return EmploymentStatus.valueOf(value);
    }

    @Override
    public void nullSafeSet(PreparedStatement statement, EmploymentStatus value, int index,
                            WrapperOptions options) throws SQLException {
        if (value == null) {
            statement.setNull(index, Types.OTHER);
        } else {
            statement.setObject(index, value.name(), Types.OTHER);
        }
    }

    @Override
    public EmploymentStatus deepCopy(EmploymentStatus value) {
        return value;
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(EmploymentStatus value) {
        return value;
    }

    @Override
    public EmploymentStatus assemble(Serializable cached, Object owner) {
        return (EmploymentStatus) cached;
    }
}
