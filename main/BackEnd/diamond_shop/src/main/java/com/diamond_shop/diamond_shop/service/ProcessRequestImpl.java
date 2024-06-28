package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.ReceivePendingRequestDTO;
import com.diamond_shop.diamond_shop.dto.UpdateProcessRequestDTO;
import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.entity.ProcessRequestEntity;
import com.diamond_shop.diamond_shop.repository.AccountRepository;
import com.diamond_shop.diamond_shop.repository.PendingRepository;
import com.diamond_shop.diamond_shop.repository.ProcessRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class ProcessRequestImpl implements ProcessRequestService {
    @Autowired
    private ProcessRequestRepository processRequestRepository;

    @Autowired
    private PendingRepository pendingRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    ValuationResultService valuationResultService;

    @Autowired
    ProcessResultService processResultService;


    @Override
    public Page<ProcessRequestEntity> viewAllProcessRequests(int page) {
        int pageSize = 5;
        int pageNumber = --page;
        return processRequestRepository.findAllProcessResults(PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Page<ProcessRequestEntity> viewProcessRequestsByConsultingStaffId(int page, int consultingStaff) {
        int pageSize = 5;
        int pageNumber = --page;
        return processRequestRepository.findProcessRequestsByConsultingStaffId(PageRequest.of(pageNumber, pageSize), consultingStaff);
    }

    @Override
    public Page<ProcessRequestEntity> viewProcessRequestsByCustomerId(int page, int customerId) {
        int pageSize = 5;
        int pageNumber = --page;
        return processRequestRepository.findProcessRequestsByCustomerId(PageRequest.of(pageNumber, pageSize), customerId);
    }

    @Override
    public String createProcessRequest(ReceivePendingRequestDTO receivePendingRequestDTO) {
        AccountEntity consultingStaff = accountRepository.findById(receivePendingRequestDTO.getConsultingStaffId()).orElse(null);
        if (consultingStaff == null)
            return "Cannot found this consulting staff with id: " + receivePendingRequestDTO.getConsultingStaffId();
        PendingRequestsEntity pendingRequest = pendingRepository.findById(receivePendingRequestDTO.getPendingRequestId()).orElse(null);
        if (pendingRequest == null)
            return "Cannot found pending request with id: " + receivePendingRequestDTO.getPendingRequestId();

        ProcessRequestEntity processRequest = processRequestRepository.findByPendingRequestId(pendingRequest.getId());
        if (processRequest == null) {
            processRequest = new ProcessRequestEntity(
                    consultingStaff,
                    pendingRequest,
                    "Not resolved yet");
            processRequestRepository.save(processRequest);
            return "Task assigned successfully!";
        } else return "Have already received !";
    }

    @Override
    public String updateProcessRequest(int id, UpdateProcessRequestDTO updateProcessRequestDTO) {
        ProcessRequestEntity processRequest = processRequestRepository.findById(id).orElse(null);
        if (processRequest == null)
            return "Cannot found this process request with id: " + id;
        if (updateProcessRequestDTO.getStatus().equals("Contacted")) {
            processRequest.setStatus(updateProcessRequestDTO.getStatus());
            processRequestRepository.save(processRequest);
        } else if (updateProcessRequestDTO.getStatus().equals("Diamond Received")) {
            valuationResultService.createValuationResult(processRequest);
            processResultService.processResult(processRequest);
            processRequest.setStatus(updateProcessRequestDTO.getStatus());
            processRequestRepository.save(processRequest);
        } else if (updateProcessRequestDTO.getStatus().equals("Done")) {
            processRequest.setStatus(updateProcessRequestDTO.getStatus());
            processRequestRepository.save(processRequest);
        } else if (updateProcessRequestDTO.getStatus().equals("Lost Receipt")) {

        }
        return "Update process request successfully!";
    }
}
