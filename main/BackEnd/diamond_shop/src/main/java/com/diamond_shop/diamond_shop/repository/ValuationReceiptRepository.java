package com.diamond_shop.diamond_shop.repository;

import com.diamond_shop.diamond_shop.entity.ValuationReceiptEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@Repository
public interface ValuationReceiptRepository extends JpaRepository<ValuationReceiptEntity, Integer> {

    @Query("SELECT v FROM ValuationReceiptEntity v WHERE v.valuationRequest.id=:id")
    Optional<ValuationReceiptEntity> checkByValuationRequestId(@RequestParam("id") int id);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationReceiptPojo (" +
            "v.id," +
            "v.createdDate, " +
            "v.valuationRequest.pendingRequestId.processRequestEntity.id," +
            "v.valuationRequest.paymentId.customerId.fullname," +
            "v.valuationRequest.paymentId.customerId.phone_number," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.staffId.fullname," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.staffId.phone_number," +
            "v.valuationRequest.pendingRequestId.description," +
            "v.valuationRequest.paymentId.createdDate," +
            "v.valuationRequest.paymentId.bank," +
            "v.valuationRequest.paymentId.amount," +
            "v.valuationRequest.paymentId.transaction," +
            "v.valuationRequest.paymentId.orderInfo) " +
            "FROM ValuationReceiptEntity as v " +
            "WHERE v.valuationRequest.id=:id")
    Optional<ValuationReceiptEntity> findByValuationRequestId(@RequestParam("id") int id);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationReceiptPojo (" +
            "v.id," +
            "v.createdDate," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.id," +
            "v.valuationRequest.paymentId.customerId.fullname," +
            "v.valuationRequest.paymentId.customerId.phone_number," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.staffId.fullname," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.staffId.phone_number," +
            "v.valuationRequest.pendingRequestId.description," +
            "v.valuationRequest.paymentId.createdDate," +
            "v.valuationRequest.paymentId.bank," +
            "v.valuationRequest.paymentId.amount," +
            "v.valuationRequest.paymentId.transaction," +
            "v.valuationRequest.paymentId.orderInfo) " +
            "FROM ValuationReceiptEntity as v " +
            "WHERE v.valuationRequest.pendingRequestId.customerId.id=:customerId")
    Page<ValuationReceiptEntity> findByCustomerId(Pageable pageable, @RequestParam("customerId") int customerId);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationReceiptPojo (" +
            "v.id," +
            "v.createdDate," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.id," +
            "v.valuationRequest.paymentId.customerId.fullname," +
            "v.valuationRequest.paymentId.customerId.phone_number," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.staffId.fullname," +
            "v.valuationRequest.pendingRequestId.processRequestEntity.staffId.phone_number," +
            "v.valuationRequest.pendingRequestId.description," +
            "v.valuationRequest.paymentId.createdDate," +
            "v.valuationRequest.paymentId.bank," +
            "v.valuationRequest.paymentId.amount," +
            "v.valuationRequest.paymentId.transaction," +
            "v.valuationRequest.paymentId.orderInfo) " +
            "FROM ValuationReceiptEntity as v " +
            "WHERE v.valuationRequest.pendingRequestId.processRequestEntity.staffId.id=:consultingStaffId")
    Page<ValuationReceiptEntity> findByConsultingStaffId(Pageable pageable, @RequestParam("consultingStaffId") int consultingStaffId);
}
