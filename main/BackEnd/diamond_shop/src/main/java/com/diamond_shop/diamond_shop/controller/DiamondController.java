package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.dto.DiamondCheckRequestDTO;
import com.diamond_shop.diamond_shop.service.DiamondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("api/diamond")
public class DiamondController {

    @Autowired
    private DiamondService diamondService;

    @PostMapping(value = "/diamond-calculate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getDiamondAttr(@RequestBody DiamondCheckRequestDTO request) {
        String gradingLab = request.getGrading_Lab();
        String carat = request.getCarat();
        String shape = request.getShape();
        String color = request.getColor();
        String clarity = request.getClarity();
        String cut = request.getCut();
        ResponseEntity<String> result=diamondService.fetchDiamondCalculate(gradingLab, carat, shape, color, clarity, cut);
        System.out.println(result);
        return result;
    }
}
