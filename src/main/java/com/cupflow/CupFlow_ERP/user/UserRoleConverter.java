package com.cupflow.CupFlow_ERP.user;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class UserRoleConverter implements AttributeConverter<UserRole, String> {

    @Override
    public String convertToDatabaseColumn(UserRole attribute){
        if(attribute == null) return null;
        return attribute.toDBValue();
    }

    @Override
    public UserRole convertToEntityAttribute(String dbData){
        if(dbData == null) return null;
        return UserRole.fromDBValue(dbData);
    }

}
