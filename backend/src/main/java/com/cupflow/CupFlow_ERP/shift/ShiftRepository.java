package com.cupflow.CupFlow_ERP.shift;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShiftRepository extends JpaRepository<Shift, UUID> {

    List<Shift> findAllByOrderByCodeAsc();

    Optional<Shift> findByCode(String code);
}
