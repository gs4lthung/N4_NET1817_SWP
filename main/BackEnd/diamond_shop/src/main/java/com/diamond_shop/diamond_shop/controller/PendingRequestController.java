package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.dto.CreatePendingRequestImgDTO;
import com.diamond_shop.diamond_shop.dto.PendingRequestDTO;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.pojo.ResponsePojo;
import com.diamond_shop.diamond_shop.service.PendingRequestService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/pending-request")
@RequiredArgsConstructor
public class PendingRequestController {
    private final PendingRequestService pendingRequestService;

    @GetMapping(path = "/get/all")
    public Page<PendingRequestsEntity> getAllPendingRequests(@RequestParam("page") int page) {
        return pendingRequestService.getAllPendingRequests(page);
    }

    @GetMapping(path = "/customer/get")
    public Page<PendingRequestsEntity> getPendingRequestsByCustomerId(@RequestParam("page") int page, @RequestParam("id") int customerId, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return pendingRequestService.getAllByCustomerId(page, customerId);
    }

    @PostMapping(path = "/create")
    public ResponsePojo createPendingRequest(@Valid @RequestBody PendingRequestDTO pendingRequestDTO) {
        return pendingRequestService.makePendingRequest(pendingRequestDTO);
    }

    @DeleteMapping(path = "/delete")
    public String cancelPendingRequest(@RequestParam int id, @RequestParam("type") String type) {
        return pendingRequestService.cancelPendingRequest(id, type);
    }

    @GetMapping(path = "/customer/check")
    public String checkCustomerPendingRequest(@RequestParam("id") int customerId) {
        return pendingRequestService.checkCustomerPendingRequest(customerId);
    }

    @GetMapping("/image/get")
    public List<String> getPendingRequestImage(@RequestParam("id") int id) {
        return pendingRequestService.getPendingRequestImage(id);
    }

    @GetMapping("/process-request/image/get")
    public List<String> getPendingRequestImageByProcessId(@RequestParam("id") int processId) {
        return pendingRequestService.getPendingRequestImageByProcessId(processId);
    }

    @PostMapping("/image/create")
    public String createPendingRequestImage(@Valid @RequestBody CreatePendingRequestImgDTO createPendingRequestImgDTO) {
        return pendingRequestService.createPendingRequestImage(createPendingRequestImgDTO);
    }

    @DeleteMapping("/image/delete")
    public String deletePendingRequestImage(@RequestParam("id") String id) {
        return pendingRequestService.deletePendingRequestImage(id);
    }
}
