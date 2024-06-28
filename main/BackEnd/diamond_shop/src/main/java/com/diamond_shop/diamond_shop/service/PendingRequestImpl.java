package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.PendingRequestDTO;
import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.repository.AccountRepository;
import com.diamond_shop.diamond_shop.repository.PendingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class PendingRequestImpl implements PendingRequestService {
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PendingRepository pendingRepository;

    @Override
    public Page<PendingRequestsEntity> getAllPendingRequests(int page) {
        int pageSize = 5;
        int pageNumber = --page;
        return pendingRepository.findAllPendingRequests(PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Page<PendingRequestsEntity> getAllByCustomerId(int page, int customerId) {
        int pageSize = 5;
        int pageNumber = --page;
        return pendingRepository.findAllByCustomerId(PageRequest.of(pageNumber, pageSize), customerId);
    }

    @Override
    public int makePendingRequest(PendingRequestDTO pendingRequestDTO) {

        AccountEntity acc = accountRepository.findById(pendingRequestDTO.getCustomerId()).orElse(null);
        if (acc == null)
            return 0;
        Date createdDate = new Date();
        PendingRequestsEntity pendingRequestsEntity = new PendingRequestsEntity(
                acc,
                pendingRequestDTO.getDescription(),
                createdDate
        );
        pendingRepository.save(pendingRequestsEntity);
        return pendingRequestsEntity.getId();
    }
}
