package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.entity.CommitmentLetterEntity;
import org.springframework.data.domain.Page;

public interface CommitmentService {
    Page<CommitmentLetterEntity> findAll(int page);
    String createCommitmentByValuationRequestId(int valuationRequestId);
}
