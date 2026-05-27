package com.cupflow.CupFlow_ERP.user;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class UserRoleType implements UserType<UserRole> {

    @Override
    public int getSqlType() {
        return Types.OTHER;
    }

    @Override
    public Class<UserRole> returnedClass() {
        return UserRole.class;
    }

    @Override
    public boolean equals(UserRole x, UserRole y) {
        return x == y;
    }

    @Override
    public int hashCode(UserRole x) {
        return x == null ? 0 : x.hashCode();
    }

    @Override
    public UserRole nullSafeGet(ResultSet rs, int position,
                                SharedSessionContractImplementor session,
                                Object owner) throws SQLException {
        String value = rs.getString(position);
        if (rs.wasNull() || value == null) return null;
        return UserRole.fromDBValue(value);
    }

    @Override
    public void nullSafeSet(PreparedStatement st, UserRole value, int index,
                            SharedSessionContractImplementor session) throws SQLException {
        if (value == null) {
            st.setNull(index, Types.OTHER);
        } else {
            st.setObject(index, value.toDBValue(), Types.OTHER);
        }
    }

    @Override
    public UserRole deepCopy(UserRole value) {
        return value;
    }

    @Override
    public boolean isMutable() {
        return false;
    }

    @Override
    public Serializable disassemble(UserRole value) {
        return value;
    }

    @Override
    public UserRole assemble(Serializable cached, Object owner) {
        return (UserRole) cached;
    }
}