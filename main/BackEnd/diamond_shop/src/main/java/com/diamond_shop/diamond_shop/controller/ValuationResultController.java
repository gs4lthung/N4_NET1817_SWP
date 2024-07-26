package com.diamond_shop.diamond_shop.controller;

import com.diamond_shop.diamond_shop.dto.*;
import com.diamond_shop.diamond_shop.entity.ValuationResultEntity;
import com.diamond_shop.diamond_shop.pojo.DetailDiamondPojo;
import com.diamond_shop.diamond_shop.pojo.DiamondPojo;
import com.diamond_shop.diamond_shop.service.ValuationResultService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@RestController
@CrossOrigin
@RequestMapping("api/valuation-result")
@RequiredArgsConstructor
public class ValuationResultController {
    private final ValuationResultService valuationResultService;

    @GetMapping("/total")
    public int totalValuationResult() {
        return valuationResultService.totalValuationResults();
    }

    @GetMapping("/total/not-done")
    public int totalNotDoneValuationResult() {
        return valuationResultService.totalNotDoneValuationResults();
    }

    @PutMapping(path = "/valuate", produces = MediaType.APPLICATION_JSON_VALUE)
    public String valuateDiamond(@RequestParam("id") String id, @RequestBody ValuationResultDTO valuationResultDTO) {
        return valuationResultService.valuateDiamond(id, valuationResultDTO);
    }

    @PutMapping(path = "/valuate/price")
    public BigDecimal valuatePrice(@RequestParam("id") String id, @RequestBody GeneratePriceDTO generatePriceDTO) {
        return valuationResultService.valuatePrice(id, generatePriceDTO);
    }

    @PutMapping(path = "/valuate/cut")
    public String valuateCutGrade(@RequestParam("id") String id, @RequestBody CutGradeDTO cutGradeDTO) {
        return valuationResultService.valuateCutGrade(id, cutGradeDTO);
    }

    @PutMapping(path = "valuate/clarity")
    public String valuateClarity(@RequestParam("id") String id, @RequestBody ClarityGradeDTO clarityGradeDTO) {
        return valuationResultService.valuateClarityGrade(id, clarityGradeDTO);
    }

    @GetMapping(path = "/get/all")
    public Page<ValuationResultEntity> getAllValuationResults(@RequestParam("page") int page) {
        return valuationResultService.getAllValuationResults(page);
    }

    @GetMapping(path = "/get/all/valuated")
    public Page<ValuationResultEntity> getAllValuatedValuationResults(@RequestParam("page") int page) {
        return valuationResultService.getAllValuatedValuationResults(page);
    }

    @GetMapping(path = "/get")
    public Optional<ValuationResultEntity> getValuationResult(@RequestParam("id") String id) {
        return valuationResultService.getValuationResultById(id);
    }

    @GetMapping(path = "/customer/get")
    public Page<ValuationResultEntity> getListValuationResultByCustomerId(@RequestParam("page") int page, @RequestParam("id") int id) {
        return valuationResultService.getValuationResultsByCustomerId(page, id);
    }

    @GetMapping(path = "/valuation-request/get")
    public Optional<ValuationResultEntity> getValuationResultByRequestId(@RequestParam("id") int id, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return valuationResultService.getValuationResultByValuationRequestId(id);
    }

    @GetMapping(path = "/image/get")
    public List<String> getValuationResultImage(@RequestParam("id") String id, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return valuationResultService.getValuationResultImage(id);
    }

    @PostMapping(path = "/image/create")
    public String createValuationResultImage(@Valid @RequestBody CreateImageDTO createImageDTO) {
        return valuationResultService.createValuationResultImage(createImageDTO);
    }

    @DeleteMapping(path = "/image/delete")
    public String deleteValuationResultImage(@RequestParam("id") String id) {
        return valuationResultService.deleteValuationResultImage(id);
    }

    @GetMapping("/crawl-natural")
    public List<DiamondPojo> scrapeNaturalDiamonds(@RequestParam String shape, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return valuationResultService.crawlNaturalDiamond(shape);
    }

    @GetMapping("/crawl-lab-grown")
    public List<DiamondPojo> scrapeLabGrownDiamonds(@RequestParam String shape, HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        return valuationResultService.crawlLabGrownDiamond(shape);
    }

    @GetMapping("/crawl-detail-natural")
    public List<DetailDiamondPojo> getMethodName(@RequestParam("carat") String carat) {
        return valuationResultService.crawlDetailDiamond(carat);
    }

}