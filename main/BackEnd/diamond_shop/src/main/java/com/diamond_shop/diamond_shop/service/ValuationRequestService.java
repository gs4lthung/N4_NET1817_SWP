package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.ValuationRequestDTO;
import com.diamond_shop.diamond_shop.entity.ValuationRequestEntity;

import java.util.List;

import org.springframework.data.domain.Page;


public interface ValuationRequestService {
    String makeRequest(int pendingId, int serviceId, int paymentId);
//
//    Page<ValuationRequestEntity> viewRequest(String search, int pageId, String filter);
//
//    String checkFinishDate(int valuationRequestId);
//
//    List<ValuationRequestDTO> viewCustomerRequestId(int id);
}
