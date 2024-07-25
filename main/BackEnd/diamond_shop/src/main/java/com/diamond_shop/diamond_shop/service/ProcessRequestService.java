package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.ReceivePendingRequestDTO;
import com.diamond_shop.diamond_shop.dto.UpdateProcessRequestDTO;
import com.diamond_shop.diamond_shop.entity.ProcessRequestEntity;
import com.diamond_shop.diamond_shop.pojo.ResponsePojo;
import org.springframework.data.domain.Page;

import java.util.Date;
import java.util.Optional;


public interface ProcessRequestService {
    int statusTotal(String status);

    Optional<ProcessRequestEntity> getProcessRequestById(int id);

    Page<ProcessRequestEntity> viewAllProcessRequests(int page);

    Page<ProcessRequestEntity> viewProcessRequestsByConsultingStaffId(int page, int consultingStaff);

    Page<ProcessRequestEntity> viewProcessRequestsByCustomerId(int page, int customerId);

    ResponsePojo createProcessRequest(ReceivePendingRequestDTO receivePendingRequestDTO);

    ResponsePojo updateProcessRequest(int id, UpdateProcessRequestDTO updateProcessRequestDTO);

    String createReceiveDate(int id, Date receiveDate);

    String checkReceiveDate(int id);
}
