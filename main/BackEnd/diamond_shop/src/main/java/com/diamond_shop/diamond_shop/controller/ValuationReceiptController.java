package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.entity.ValuationReceiptEntity;
import com.diamond_shop.diamond_shop.service.ValuationReceiptService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("api/valuation-receipt")
@RequiredArgsConstructor
public class ValuationReceiptController {

    private final ValuationReceiptService valuationReceiptService;

    @GetMapping(path = "/valuation-request/get")
    public Optional<ValuationReceiptEntity> getValuationReceiptByValuationRequestId(@RequestParam("id") int id) {
        return valuationReceiptService.findByValuationRequestId(id);
    }

    @GetMapping("/customer/get")
    public Page<ValuationReceiptEntity> getValuationReceiptByCustomerId(@RequestParam("id") int id, @RequestParam("page") int page) {
        return valuationReceiptService.getValuationReceiptsByCustomerId(id, page);
    }

    @GetMapping("/consulting-staff/get")
    public Page<ValuationReceiptEntity> getValuationReceiptByConsultingStaffId(@RequestParam("id") int id, @RequestParam("page") int page) {
        return valuationReceiptService.getValuationReceiptsByConsultingStaffId(id, page);
    }

    @PostMapping(path = "/create")
    public String createValuationReceiptByValuationRequestId(@RequestParam("valuationRequestId") int valuationRequestId) {
        return valuationReceiptService.createReceipt(valuationRequestId);
    }
}
