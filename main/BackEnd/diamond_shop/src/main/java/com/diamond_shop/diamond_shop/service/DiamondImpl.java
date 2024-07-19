package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.UpdateServiceDTO;
import com.diamond_shop.diamond_shop.entity.ServiceEntity;
import com.diamond_shop.diamond_shop.entity.ServiceStatisticEntity;
import com.diamond_shop.diamond_shop.pojo.ResponsePojo;
import com.diamond_shop.diamond_shop.pojo.ServiceResultPojo;
import com.diamond_shop.diamond_shop.repository.ServiceRepository;
import com.diamond_shop.diamond_shop.repository.ServiceStatisticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DiamondImpl implements DiamondService {

    private final ServiceRepository serviceRepository;
    private final ServiceStatisticRepository serviceStatisticRepository;


    @Override
    public ResponseEntity<String> fetchDiamondCalculate(String gradingLab, String carat, String shape, String color, String clarity, String cut) {
        String fetchUrl = "http://www.idexonline.com/DPService.asp";
        Map<String, String> params = new LinkedHashMap<>();
        params.put("SID", "4wp7go123jqtkdyd5f2e");
        params.put("cut", shape);
        params.put("carat", carat);
        params.put("color", color);
        params.put("clarity", clarity);
        params.put("make", cut);
        params.put("cert", gradingLab);
        String finalUrl = fetchUrl.concat(builderQueryString(params));
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForEntity(finalUrl, String.class);
    }

    @Override
    public List<ServiceResultPojo> getAllServices() {
        return serviceRepository.getAllServices();
    }

    @Override
    public ResponsePojo createService(UpdateServiceDTO updateServiceDTO) {
        ServiceStatisticEntity serviceStatistic = new ServiceStatisticEntity(updateServiceDTO.getStatisticName());
        serviceStatisticRepository.save(serviceStatistic);
        ServiceEntity service = new ServiceEntity(updateServiceDTO.getName(), updateServiceDTO.getPrice(), updateServiceDTO.getTime(), serviceStatistic);
        serviceRepository.save(service);
        ResponsePojo responsePojo = new ResponsePojo();
        responsePojo.setId(service.getId());
        responsePojo.setMessage("Create successful");
        return responsePojo;
    }

    @Override
    public ResponsePojo updateService(UpdateServiceDTO updateServiceDTO) {
        ResponsePojo responsePojo = new ResponsePojo();
        serviceRepository.updateServiceById(updateServiceDTO.getId(), updateServiceDTO.getName(), updateServiceDTO.getPrice(), updateServiceDTO.getTime());
        serviceStatisticRepository.updateStatistic(updateServiceDTO.getStatisticId(), updateServiceDTO.getStatisticName());
        responsePojo.setId(updateServiceDTO.getId());
        responsePojo.setMessage("Update service " + updateServiceDTO.getId() + " successful");
        return responsePojo;
    }

    @Override
    public ResponsePojo deleteService(int serviceId, int statisticId) {
        ResponsePojo responsePojo = new ResponsePojo();
        serviceRepository.deleteById(serviceId);
        serviceStatisticRepository.deleteById(statisticId);
        responsePojo.setId(serviceId);
        responsePojo.setMessage("Delete successful");
        return responsePojo;
    }

    //
    private String builderQueryString(Map<String, String> params) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("?");
        for (Map.Entry<String, String> entry : params.entrySet()) {
            stringBuilder.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        stringBuilder.deleteCharAt(stringBuilder.length() - 1);
        return stringBuilder.toString();
    }
}
