package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.entity.PaymentEntity;
import org.springframework.data.domain.Page;

public interface PaymentService {
    int createPayment(
            int userid,
            String created_date,
            String bank,
            String amount,
            String transactionNo,
            String orderInfo
    );

    Page<PaymentEntity> getTransaction(int id, int page);

    int getIncome();

    int getIncomeByMonth(int month);
}
