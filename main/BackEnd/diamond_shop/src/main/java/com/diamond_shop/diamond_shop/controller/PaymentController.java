package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping(value = "/income")
    public int getIncome() {
        return paymentService.getIncome();
    }

    @GetMapping(value = "/income/month")
    public int getIncomeMonth(@RequestParam("id") int id) {
        return paymentService.getIncomeByMonth(id);
    }
}
