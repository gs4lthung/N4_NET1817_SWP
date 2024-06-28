package com.diamond_shop.diamond_shop.service;


import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PaymentEntity;
import com.diamond_shop.diamond_shop.repository.AccountRepository;
import com.diamond_shop.diamond_shop.repository.PaymentRepository;

@Service
public class PaymentImpl implements PaymentService{
    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    AccountRepository accountRepository;

    @Override
    public int createPayment(int customerId) {
        AccountEntity accountEntity = accountRepository.findById(customerId).orElse(null);
        Date createdDate = new Date();
        PaymentEntity paymentEntity = new PaymentEntity(
            accountEntity,
            createdDate,
            "VNpay"
        );
        paymentRepository.save(paymentEntity);
        return paymentEntity.getId();
    }
}
