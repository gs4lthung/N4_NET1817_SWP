package com.diamond_shop.diamond_shop.service;

import org.springframework.stereotype.Service;

@Service
public class ValuationReceiptImpl implements ValuationReceiptService {

//    @Autowired
//    ValuationRequestRepository valuationRequestRepository;
//
//    @Autowired
//    ValuationReceiptRepository valuationReceiptRepository;
//
//    @Override
//    public String createReceipt(int valuationRequestId) {
//        ValuationRequestEntity valuationRequest = valuationRequestRepository.findById(valuationRequestId);
//        if (valuationRequest == null)
//            return "Valuation Request Not Found";
//        ValuationReceiptEntity valuationReceipt = valuationReceiptRepository.findByValuationRequestId(valuationRequestId);
//        if (valuationReceipt != null)
//            return "Valuation Receipt Has Already Been Created";
//        Date date = new Date();
//        ValuationReceiptEntity valuationReceiptEntity = new ValuationReceiptEntity(date, valuationRequest);
//        valuationReceiptRepository.save(valuationReceiptEntity);
//        return "success";
//    }
//
//    @Override
//    public Optional<ValuationReceiptEntity> findByValuationRequestId(int valuationRequestId) {
//        ValuationRequestEntity valuationRequest = valuationRequestRepository.findById(valuationRequestId);
//        if (valuationRequest == null)
//            return null;
//        return valuationReceiptRepository.getValuationReceiptByValuationRequestId(valuationRequestId);
//    }
}
