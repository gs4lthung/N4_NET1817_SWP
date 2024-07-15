package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.CreatePendingRequestImgDTO;
import com.diamond_shop.diamond_shop.dto.PendingRequestDTO;
import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PendingRequestImageEntity;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.repository.AccountRepository;
import com.diamond_shop.diamond_shop.repository.PendingImageRepository;
import com.diamond_shop.diamond_shop.repository.PendingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PendingRequestImpl implements PendingRequestService {
    private final PendingRepository pendingRepository;
    private final AccountRepository accountRepository;
    private final PendingImageRepository imageRepository;


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

    @Override
    public String cancelPendingRequest(int id, String type) {
        PendingRequestsEntity pendingRequest = new PendingRequestsEntity();
        if (type.equals("Pending request"))
            pendingRequest = pendingRepository.findById(id).orElse(null);
        else if (type.equals("Process request"))
            pendingRequest = pendingRepository.findByProcessRequestId(id).orElse(null);
        if (pendingRequest == null)
            return "Cannot found pending request with id " + id;
        pendingRepository.delete(pendingRequest);
        return "Cancel successful";
    }

    @Override
    public String checkCustomerPendingRequest(int customerId) {
        List<PendingRequestsEntity> pendingRequests = pendingRepository.findByCustomerId(customerId);
        if (!pendingRequests.isEmpty())
            return "You has already made a request";
        return "";
    }

    @Override
    public List<String> getPendingRequestImage(int pendingRequestId) {
        return imageRepository.findImageIdsByPendingRequestId(pendingRequestId);
    }

    @Override
    public List<String> getPendingRequestImageByProcessId(int processId) {
        return imageRepository.findImageIdsByProcessRequestId(processId);
    }

    @Override
    public String createPendingRequestImage(CreatePendingRequestImgDTO createPendingRequestImgDTO) {
        Optional<PendingRequestsEntity> pendingRequests = pendingRepository.findById(createPendingRequestImgDTO.getPendingRequestId());
        if (pendingRequests.isEmpty())
            return "Could not find pending request with id " + createPendingRequestImgDTO.getPendingRequestId();
        PendingRequestImageEntity pendingRequestImageEntity = new PendingRequestImageEntity(createPendingRequestImgDTO.getId(), pendingRequests.get());
        imageRepository.save(pendingRequestImageEntity);
        return "Create image successful";
    }

    @Override
    public String deletePendingRequestImage(String imageId) {
        imageRepository.deleteById(imageId);
        return "Delete successful";
    }
}
