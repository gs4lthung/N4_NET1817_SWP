package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.dto.PendingRequestDTO;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.service.PendingRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/api/pending-request")
public class PendingRequestController {
    @Autowired
    private PendingRequestService pendingRequestService;

    @GetMapping(path = "/get/all")
    public Page<PendingRequestsEntity> getAllPendingRequests(@RequestParam("page") int page) {
        return pendingRequestService.getAllPendingRequests(page);
    }

    @GetMapping(path = "/customer/get")
    public Page<PendingRequestsEntity> getPendingRequestsByCustomerId(@RequestParam("page") int page, @RequestParam("id") int customerId) {
        return pendingRequestService.getAllByCustomerId(page, customerId);
    }

    @PostMapping(path = "/create")
    public String createPendingRequest(@RequestBody PendingRequestDTO pendingRequestDTO) {
        if (pendingRequestService.makePendingRequest(pendingRequestDTO) != 0)
            return "Successful. Our team will contact you soon !";
        else return "Please login first !";
    }
}
