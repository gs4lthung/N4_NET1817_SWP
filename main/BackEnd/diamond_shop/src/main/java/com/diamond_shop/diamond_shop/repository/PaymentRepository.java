package com.diamond_shop.diamond_shop.repository;

import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PaymentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {
    @Query(value = "SELECT a FROM AccountEntity a WHERE a.is_active = true AND a.username=:username")
    AccountEntity findByUsername(@Param("username") String username);

//    @Query(value = "SELECT v FROM ValuationRequestEntity v WHERE v.id=:id")
//    ValuationRequestEntity findByValuationRequest(@Param("id") int id);

    @Query(value = "SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.VNpayBillPojo(" +
            "a.id," +
            "a.customerId.fullname," +
            "a.createdDate," +
            "a.bank," +
            "a.amount," +
            "a.transaction," +
            "a.orderInfo) " +
            "FROM PaymentEntity a WHERE a.customerId.is_active = true AND a.customerId.id=:customerId")
    Page<PaymentEntity> findByCustomerId(Pageable pageable, @Param("customerId") int customerId);

    @Query(value = "SELECT p.amount FROM PaymentEntity p")
    List<Integer> getIncome();

    @Query(value = "SELECT p FROM PaymentEntity p")
    List<PaymentEntity> findAll();

}
