package com.diamond_shop.diamond_shop.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "process_results")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ProcessResultEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "valuation_staff_id")
    private AccountEntity valuationStaffId;

    @OneToOne
    @JoinColumn(name = "valuation_result_id")
    private ValuationResultEntity valuationResultId;

    @Column(name = "status")
    private String status;

    @Column(name = "created_date")
    private Date createdDate;

    public ProcessResultEntity(AccountEntity valuationStaffId, ValuationResultEntity valuationResultId, String status, Date createdDate) {
        this.valuationStaffId = valuationStaffId;
        this.valuationResultId = valuationResultId;
        this.status = status;
        this.createdDate = createdDate;
    }
}
