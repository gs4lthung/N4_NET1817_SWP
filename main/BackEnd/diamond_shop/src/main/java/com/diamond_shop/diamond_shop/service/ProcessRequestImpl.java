package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.ReceivePendingRequestDTO;
import com.diamond_shop.diamond_shop.dto.UpdateProcessRequestDTO;
import com.diamond_shop.diamond_shop.entity.AccountEntity;
import com.diamond_shop.diamond_shop.entity.PendingRequestsEntity;
import com.diamond_shop.diamond_shop.entity.ProcessRequestEntity;
import com.diamond_shop.diamond_shop.pojo.DiamondReceivedPojo;
import com.diamond_shop.diamond_shop.pojo.ResponsePojo;
import com.diamond_shop.diamond_shop.repository.AccountRepository;
import com.diamond_shop.diamond_shop.repository.PendingRepository;
import com.diamond_shop.diamond_shop.repository.ProcessRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProcessRequestImpl implements ProcessRequestService {

    private final ProcessRequestRepository processRequestRepository;
    private final AccountRepository accountRepository;
    private final PendingRepository pendingRepository;
    private final ValuationResultService valuationResultService;
    private final ProcessResultService processResultService;

    @Override
    public int statusTotal(String status) {
        return processRequestRepository.statusTotal(status);
    }

    @Override
    public Optional<ProcessRequestEntity> getProcessRequestById(int id) {
        return processRequestRepository.findProcessRequestById(id);
    }

    @Override
    public Page<ProcessRequestEntity> viewAllProcessRequests(int page) {
        int pageSize = 5;
        int pageNumber = --page;
        return processRequestRepository.findAllProcessResults(PageRequest.of(pageNumber, pageSize, Sort.by("createdDate").descending()));
    }

    @Override
    public Page<ProcessRequestEntity> viewProcessRequestsByConsultingStaffId(int page, int consultingStaff) {
        int pageSize = 5;
        int pageNumber = --page;
        return processRequestRepository.findProcessRequestsByConsultingStaffId(PageRequest.of(pageNumber, pageSize, Sort.by("createdDate").descending()), consultingStaff);
    }

    @Override
    public Page<ProcessRequestEntity> viewProcessRequestsByCustomerId(int page, int customerId) {
        int pageSize = 5;
        int pageNumber = --page;
        return processRequestRepository.findProcessRequestsByCustomerId(PageRequest.of(pageNumber, pageSize, Sort.by("createdDate").descending()), customerId);
    }

    @Override
    public ResponsePojo createProcessRequest(ReceivePendingRequestDTO receivePendingRequestDTO) {
        AccountEntity consultingStaff = accountRepository.findById(receivePendingRequestDTO.getConsultingStaffId()).orElse(null);
        ResponsePojo responsePojo = new ResponsePojo();
        if (consultingStaff == null) {
            responsePojo.setId(0);
            responsePojo.setMessage("Cannot found this consulting staff with id: " + receivePendingRequestDTO.getConsultingStaffId());
            return responsePojo;
        }
        PendingRequestsEntity pendingRequest = pendingRepository.findById(receivePendingRequestDTO.getPendingRequestId()).orElse(null);
        if (pendingRequest == null) {
            responsePojo.setId(0);
            responsePojo.setMessage("Cannot found pending request with id: " + receivePendingRequestDTO.getPendingRequestId());
            return responsePojo;
        }
        ProcessRequestEntity processRequest = processRequestRepository.findByPendingRequestId(pendingRequest.getId());
        if (processRequest == null) {
            processRequest = new ProcessRequestEntity(
                    consultingStaff,
                    pendingRequest,
                    "Not resolved yet",
                    new Date());
            processRequestRepository.save(processRequest);
            responsePojo.setId(processRequest.getId());
            responsePojo.setMessage("Successfully created process request");
            return responsePojo;
        } else {
            responsePojo.setId(0);
            responsePojo.setMessage("Have already received !");
            return responsePojo;
        }
    }

    @Override
    public DiamondReceivedPojo updateProcessRequest(int id, UpdateProcessRequestDTO updateProcessRequestDTO) {
        DiamondReceivedPojo diamondReceivedPojo = new DiamondReceivedPojo();
        String valuationResultId = "";
        int processResultId = 0;
        ProcessRequestEntity processRequest = processRequestRepository.findById(id).orElse(null);
        if (processRequest == null) {
            diamondReceivedPojo.setProcessRequestId(id);
            diamondReceivedPojo.setValuationResultId(valuationResultId);
            diamondReceivedPojo.setProcessResultId(processResultId);
            diamondReceivedPojo.setMessage("Cannot found this process request with id: " + id);
            return diamondReceivedPojo;
        }

        switch (updateProcessRequestDTO.getStatus()) {
            case "Contacted", "Done", "Lost Receipt" -> {
                processRequest.setStatus(updateProcessRequestDTO.getStatus());
                processRequestRepository.save(processRequest);
            }
            case "Diamond Received" -> {
                valuationResultId = valuationResultService.createValuationResult(processRequest);
                processResultId = processResultService.processResult(processRequest);
                processRequest.setStatus(updateProcessRequestDTO.getStatus());
                processRequestRepository.save(processRequest);
            }
        }

        diamondReceivedPojo.setProcessRequestId(id);
        diamondReceivedPojo.setValuationResultId(valuationResultId);
        diamondReceivedPojo.setProcessResultId(processResultId);
        diamondReceivedPojo.setMessage("Update process request successfully!");
        return diamondReceivedPojo;
    }

    @Override
    public String createReceiveDate(int id, Date receiveDate) {
        Optional<ProcessRequestEntity> processRequest = processRequestRepository.findById(id);
        if (processRequest.isEmpty())
            return "Cannot found process request with id" + id;
        processRequest.get().setReceiveDate(receiveDate);
        processRequestRepository.save(processRequest.get());
        return "Create receive date successful!";
    }

    @Override
    public String checkReceiveDate(int id) {
        Optional<ProcessRequestEntity> processRequest = processRequestRepository.findById(id);
        if (processRequest.isEmpty())
            return "Cannot found process request with id" + id;

        if (processRequest.get().getReceiveDate() == null)
            return "Receive date is not be set!";

        Date currentDate = new Date();
        if (currentDate.after(processRequest.get().getReceiveDate())) {
            if (processRequest.get().getStatus().equals("Not resolved yet")) {
                processRequest.get().setStatus("Canceled");
                processRequestRepository.save(processRequest.get());
                return "Canceled request";
            } else return "Already resolved";
        }
        return "Not get receive date";
    }
}
