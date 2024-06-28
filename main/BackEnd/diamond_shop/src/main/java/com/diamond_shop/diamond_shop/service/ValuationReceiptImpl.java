package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.entity.ValuationReceiptEntity;
import com.diamond_shop.diamond_shop.entity.ValuationRequestEntity;
import com.diamond_shop.diamond_shop.repository.ValuationReceiptRepository;
import com.diamond_shop.diamond_shop.repository.ValuationRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class ValuationReceiptImpl implements ValuationReceiptService {

    @Autowired
    ValuationRequestRepository valuationRequestRepository;

    @Autowired
    ValuationReceiptRepository valuationReceiptRepository;

    @Override
    public String createReceipt(int valuationRequestId) {
        Optional<ValuationRequestEntity> valuationRequest = valuationRequestRepository.findById(valuationRequestId);
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
    public Optional<ValuationReceiptEntity> findByValuationRequestId(int valuationRequestId) {
        return valuationReceiptRepository.findByValuationRequestId(valuationRequestId);
    }
}
