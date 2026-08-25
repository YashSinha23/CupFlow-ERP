package com.cupflow.CupFlow_ERP.cup;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
        name = "cups",
        uniqueConstraints = @UniqueConstraint(
                name = "unique_cup_name",
                columnNames = "cup_name"
        )
)
@Getter
@Setter
public class Cup {

    @Id
    @UuidGenerator
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "cup_name", nullable = false, length = 100)
    private String cupName;

    @Column(name = "cavity", nullable = false)
    private Integer cavity;

    @Column(name = "diameter", nullable = false, precision = 10, scale = 5)
    private BigDecimal diameter;

    @Column(name = "height", nullable = false, precision = 10, scale = 5)
    private BigDecimal height;

    @Column(name = "lip_size", nullable = false, precision = 10, scale = 5)
    private BigDecimal lipSize;
}
