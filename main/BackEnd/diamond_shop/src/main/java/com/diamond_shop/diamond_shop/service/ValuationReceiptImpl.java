package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.entity.ValuationReceiptEntity;
import com.diamond_shop.diamond_shop.entity.ValuationRequestEntity;
import com.diamond_shop.diamond_shop.repository.ValuationReceiptRepository;
import com.diamond_shop.diamond_shop.repository.ValuationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ValuationReceiptImpl implements ValuationReceiptService {

    private final ValuationReceiptRepository valuationReceiptRepository;
    private final ValuationRequestRepository valuationRequestRepository;

    @Override
    public String createReceipt(int valuationRequestId) {
        Optional<ValuationRequestEntity> valuationRequest = valuationRequestRepository.getById(valuationRequestId);
        if (valuationRequest.isEmpty())
            return "Cannot find valuation request";
        Optional<ValuationReceiptEntity> valuationReceipt = valuationReceiptRepository.checkByValuationRequestId(valuationRequestId);
        if (valuationReceipt.isPresent())
            return "Valuation Receipt has already exists";
        Date date = new Date();
        ValuationReceiptEntity valuationReceiptEntity = new ValuationReceiptEntity(valuationRequest.get(), date);
        valuationReceiptRepository.save(valuationReceiptEntity);
        return "Valuation Receipt created successful";
    }

    @Override
    public Page<ValuationReceiptEntity> getValuationReceiptsByCustomerId(int customerId, int page) {
        int pageNumber = --page, pageSize = 5;
        return valuationReceiptRepository.findByCustomerId(PageRequest.of(pageNumber, pageSize, Sort.by("createdDate").descending()), customerId);
    }

    @Override
    public Page<ValuationReceiptEntity> getValuationReceiptsByConsultingStaffId(int consultingStaffId, int page) {
        int pageNumber = --page, pageSize = 5;
        return valuationReceiptRepository.findByConsultingStaffId(PageRequest.of(pageNumber, pageSize, Sort.by("createdDate").descending()), consultingStaffId);
    }

    @Override
    public Optional<ValuationReceiptEntity> findByValuationRequestId(int valuationRequestId) {
        return valuationReceiptRepository.findByValuationRequestId(valuationRequestId);
    }
}
