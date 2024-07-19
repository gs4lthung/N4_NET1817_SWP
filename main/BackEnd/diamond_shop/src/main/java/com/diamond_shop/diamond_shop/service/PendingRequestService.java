package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.CreatePendingRequestImgDTO;
import com.diamond_shop.diamond_shop.dto.PendingRequestDTO;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.pojo.ResponsePojo;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PendingRequestService {
    Page<PendingRequestsEntity> getAllPendingRequests(int page);

    Page<PendingRequestsEntity> getAllByCustomerId(int page, int customerId);

    ResponsePojo makePendingRequest(PendingRequestDTO pendingRequestDTO);

    String cancelPendingRequest(int id, String type);

    String checkCustomerPendingRequest(int customerId);

    List<String> getPendingRequestImage(int pendingRequestId);

    List<String> getPendingRequestImageByProcessId(int processId);

    String createPendingRequestImage(CreatePendingRequestImgDTO createPendingRequestImgDTO);

    String deletePendingRequestImage(String imageId);
}
