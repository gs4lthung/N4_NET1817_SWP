package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.dto.ReceivePendingRequestDTO;
import com.diamond_shop.diamond_shop.dto.UpdateProcessRequestDTO;
import com.diamond_shop.diamond_shop.entity.ProcessRequestEntity;
import com.diamond_shop.diamond_shop.pojo.ResponsePojo;
import com.diamond_shop.diamond_shop.service.ProcessRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("api/process-request")
@RequiredArgsConstructor
public class ProcessRequestController {
    private final ProcessRequestService processRequestService;

    @GetMapping(path = "/get")
    public Optional<ProcessRequestEntity> getProcessRequest(@RequestParam("id") int id) {
        return processRequestService.getProcessRequestById(id);
    }

    @GetMapping(path = "/get/all")
    public Page<ProcessRequestEntity> viewAllProcessRequest(@RequestParam("page") int page) {
        return processRequestService.viewAllProcessRequests(page);
    }

    @GetMapping(path = "/get/consulting-staff")
    public Page<ProcessRequestEntity> viewProcessRequestsByStaff(@RequestParam("page") int page, @RequestParam("id") int consultingStaffId) {
        return processRequestService.viewProcessRequestsByConsultingStaffId(page, consultingStaffId);
    }

    @GetMapping(path = "/get/customer")
    public Page<ProcessRequestEntity> viewProcessRequestsByCustomer(@RequestParam("page") int page, @RequestParam("id") int customerId) {
        return processRequestService.viewProcessRequestsByCustomerId(page, customerId);
    }

    @PostMapping(path = "/create")
    public ResponsePojo createProcessRequest(@Valid @RequestBody ReceivePendingRequestDTO receivePendingRequestDTO) {
        return processRequestService.createProcessRequest(receivePendingRequestDTO);
    }

    @PutMapping(path = "/update")
    public ResponsePojo updateProcessRequest(@Valid @RequestParam("id") int id, @RequestBody UpdateProcessRequestDTO updateProcessRequestDTO) {
        return processRequestService.updateProcessRequest(id, updateProcessRequestDTO);
    }

    @GetMapping(path = "/total")
    public int statusTotal(@RequestParam("status") String status) {
        return processRequestService.statusTotal(status);
    }

    @PostMapping(path = "/receive-date/create")
    public String createReceiveDate(@RequestParam("id") int id, @RequestParam("date") String date) {
        LocalDateTime receiveDate = LocalDateTime.parse(date);
        return processRequestService.createReceiveDate(id, Date.from(receiveDate.atZone(ZoneId.systemDefault()).toInstant()));
    }

    @GetMapping(path = "/receive-date/check")
    public String checkReceiveDate(@RequestParam("id") int id) {
        return processRequestService.checkReceiveDate(id);
    }
}
