package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.entity.ValuationReceiptEntity;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface ValuationReceiptService {
    String createReceipt(int valuationRequestId);

    Page<ValuationReceiptEntity> getValuationReceiptsByCustomerId(int customerId, int page);

    Page<ValuationReceiptEntity> getValuationReceiptsByConsultingStaffId(int consultingStaffId, int page);

    Optional<ValuationReceiptEntity> findByValuationRequestId(int valuationRequestId);
}
