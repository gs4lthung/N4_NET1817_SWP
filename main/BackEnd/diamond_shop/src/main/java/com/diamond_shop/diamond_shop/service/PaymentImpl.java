package com.diamond_shop.diamond_shop.service;


import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PaymentEntity;
import com.diamond_shop.diamond_shop.repository.AccountRepository;
import com.diamond_shop.diamond_shop.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class PaymentImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private AccountRepository accountRepository;

    public PaymentImpl(PaymentRepository paymentRepository, AccountRepository accountRepository) {
        this.paymentRepository = paymentRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public int createPayment(int userid,
                             String created_date,
                             String bank,
                             String amount,
                             String transactionNo,
                             String orderInfo) {

        AccountEntity accountEntity = accountRepository.findById(userid).orElse(null);

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        Date createdDate = null;
        try {
            createdDate = dateFormat.parse(created_date);
        } catch (ParseException e) {
            System.out.println(e.getMessage());
        }
        int amountInt = Integer.parseInt(amount) / 100;

        if (accountEntity == null) {
            throw new IllegalArgumentException("User not found with id: " + userid);
        }

        PaymentEntity paymentEntity = new PaymentEntity(
                accountEntity,
                createdDate,
                bank,
                amountInt,
                transactionNo,
                orderInfo
        );

        paymentRepository.save(paymentEntity);
        return paymentEntity.getId();
    }

    @Override
    public Page<PaymentEntity> getTransaction(int id, int page) {
        int pageNumber = --page;
        int pageSize = 5;
        return paymentRepository.findByCustomerId(PageRequest.of(pageNumber, pageSize, Sort.by("createdDate").descending()), id);
    }

    @Override
    public int getIncome() {
        int total = 0;
        List<Integer> allPaymentAmount = paymentRepository.getIncome();
        for (Integer amount : allPaymentAmount) {
            total += amount;
        }
        return total;
    }

    @Override
    public int getIncomeByMonth(int month) {
        List<PaymentEntity> payments = paymentRepository.findAll();
        int total = 0;
        for (PaymentEntity payment : payments) {
            String[] dateParts = payment.getCreatedDate().toString().split("-");
            if (Integer.parseInt(dateParts[1]) == month) {
                total += payment.getAmount();
            }
        }
        return total;
    }
}
