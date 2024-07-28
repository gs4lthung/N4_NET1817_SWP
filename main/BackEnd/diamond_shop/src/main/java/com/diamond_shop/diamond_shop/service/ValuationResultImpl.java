package com.diamond_shop.diamond_shop.service;

import com.diamond_shop.diamond_shop.dto.*;
import com.diamond_shop.diamond_shop.entity.*;
import com.diamond_shop.diamond_shop.pojo.DetailDiamondPojo;
import com.diamond_shop.diamond_shop.pojo.DiamondPojo;
import com.diamond_shop.diamond_shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ValuationResultImpl implements ValuationResultService {
    private final PendingRepository pendingRepository;
    private final PendingImageRepository pendingImageRepository;
    private final ValuationResultRepository valuationResultRepository;
    private final ProcessResultRepository processResultRepository;
    private final ProcessRequestRepository processRequestRepository;
    private final ValuationRequestRepository valuationRequestRepository;
    private final ValuationResultImageRepository valuationResultImageRepository;
    private final DiamondPriceRepository diamondPriceRepository;
    private final DiamondPriceNatureRepository diamondPriceNatureRepository;

    @Override
    public int totalValuationResults() {
        return valuationResultRepository.totalValuationResults();
    }

    @Override
    public int totalNotDoneValuationResults() {
        return valuationResultRepository.totalNotDoneValuationResults();
    }

    @Override
    public Page<ValuationResultEntity> getAllValuationResults(int page) {
        int pageNumber = page - 1;
        int pageSize = 5;
        return valuationResultRepository.findAllValuationResults(PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Page<ValuationResultEntity> getAllValuatedValuationResults(int page) {
        int pageNumber = page - 1;
        int pageSize = 5;
        return valuationResultRepository.findAllValuatedValuationResults(PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Optional<ValuationResultEntity> getValuationResultById(String id) {
        return valuationResultRepository.findValuationResultById(id);
    }

    @Override
    public Page<ValuationResultEntity> getValuationResultsByCustomerId(int page, int customerId) {
        int pageNumber = --page, pageSize = 5;
        return valuationResultRepository.getValuationResultsByCustomerId(PageRequest.of(pageNumber, pageSize), customerId);
    }

    @Override
    public Optional<ValuationResultEntity> getValuationResultByValuationRequestId(int valuationRequestId) {
        return valuationResultRepository.getValuationResultByValuationRequestId(valuationRequestId);
    }

    @Override
    public String valuateDiamond(String id, ValuationResultDTO valuationResultDTO) {
        Optional<ValuationResultEntity> valuationResult = valuationResultRepository.findById(id);
        if (valuationResult.isPresent()) {
            System.out.println(valuationResultDTO.isLaserDrillHole());
            valuationResult.get().setUpdateDate(new Date());
            valuationResult.get().setOrigin(valuationResultDTO.getOrigin());
            valuationResult.get().setShape(valuationResultDTO.getShape());
            valuationResult.get().setCarat(valuationResultDTO.getCarat());
            valuationResult.get().setColor(valuationResultDTO.getColor());
            valuationResult.get().setCut(valuationResultDTO.getCut());
            valuationResult.get().setClarity(valuationResultDTO.getClarity());
            valuationResult.get().setSymmetry(valuationResultDTO.getSymmetry());
            valuationResult.get().setPolish(valuationResultDTO.getPolish());
            valuationResult.get().setFluorescence(valuationResultDTO.getFluorescence());
            valuationResult.get().setLength(valuationResultDTO.getLength());
            valuationResult.get().setWidth(valuationResultDTO.getWidth());
            valuationResult.get().setDepth(valuationResultDTO.getDepth());
            valuationResult.get().setDepthPct(valuationResultDTO.getDepthPct());
            valuationResult.get().setTablePct(valuationResultDTO.getTablePct());
            valuationResult.get().setPavPct(valuationResultDTO.getPavPct());
            valuationResult.get().setPavAngle(valuationResultDTO.getPavAngle());
            valuationResult.get().setCrownPct(valuationResultDTO.getCrownPct());
            valuationResult.get().setCrownAngle(valuationResultDTO.getCrownAngle());
            valuationResult.get().setLowerHalfPct(valuationResultDTO.getLowerHalfPct());
            valuationResult.get().setStarPct(valuationResultDTO.getStarPct());
            valuationResult.get().setGirdlePct(valuationResultDTO.getGirdlePct());
            valuationResult.get().setCulet(valuationResultDTO.getCulet());
            valuationResult.get().setLaserDrillHole(valuationResultDTO.isLaserDrillHole());
            valuationResult.get().setFeather(valuationResultDTO.isFeather());
            valuationResult.get().setCrystal(valuationResultDTO.isCrystal());
            valuationResult.get().setChip(valuationResultDTO.isChip());
            valuationResult.get().setNeedle(valuationResultDTO.isNeedle());
            valuationResult.get().setCavity(valuationResultDTO.isCavity());
            valuationResult.get().setPinpoint(valuationResultDTO.isPinpoint());
            valuationResult.get().setBruise(valuationResultDTO.isBruise());
            valuationResult.get().setCloud(valuationResultDTO.isCloud());
            valuationResult.get().setEtchChannel(valuationResultDTO.isEtchChannel());
            valuationResult.get().setTwinningWisp(valuationResultDTO.isTwinningWisp());
            valuationResult.get().setIndentedNatural(valuationResultDTO.isIndentedNatural());
            valuationResult.get().setKnot(valuationResultDTO.isKnot());
            valuationResult.get().setNatural(valuationResultDTO.isNatural());
            valuationResult.get().setPrice(valuationResultDTO.getPrice());
            valuationResult.get().setUpdateDate(new Date());
            valuationResultRepository.save(valuationResult.get());
        } else return "Valuate failed!";

        ProcessResultEntity processResult = processResultRepository.findByValuationResultId(id);
        processResult.setStatus("Valuated");
        processResultRepository.save(processResult);
        Optional<ProcessRequestEntity> processRequest = processRequestRepository.findById(processResult.getValuationResultId().getValuationRequestId().getPendingRequestId().getProcessRequestEntity().getId());
        if (processRequest.isPresent()) {
            processRequest.get().setStatus("Valuated");
            processRequestRepository.save(processRequest.get());
            return "Valuate successful!";
        } else return "Valuate failed!";
    }

    @Override
    public String valuateCutGrade(String id, CutGradeDTO cutGradeDTO) {
        ValuationResultEntity valuationResult = valuationResultRepository.findById(id).orElse(null);
        if (valuationResult == null) {
            return "Cannot find valuation result";
        }

        int cutGradeIdeal = 0;

        BigDecimal crownPctLowerIdealRange = BigDecimal.valueOf(14);
        BigDecimal crownPctUpperIdealRange = BigDecimal.valueOf(16);
        if (cutGradeDTO.getCrownPct().doubleValue() > crownPctLowerIdealRange.doubleValue()
                && cutGradeDTO.getCrownPct().doubleValue() < crownPctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal crownAngleLowerIdealRange = BigDecimal.valueOf(32);
        BigDecimal crownAngleUpperIdealRange = BigDecimal.valueOf(35);
        if (cutGradeDTO.getCrownAngle().doubleValue() >= crownAngleLowerIdealRange.doubleValue()
                && cutGradeDTO.getCrownAngle().doubleValue() <= crownAngleUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal pavilionPctLowerIdealRange = BigDecimal.valueOf(41);
        BigDecimal pavilionPctUpperIdealRange = BigDecimal.valueOf(48);
        if (cutGradeDTO.getPavPct().doubleValue() >= pavilionPctLowerIdealRange.doubleValue()
                && cutGradeDTO.getPavPct().doubleValue() <= pavilionPctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal pavilionAngleLowerIdealRange = BigDecimal.valueOf(40);
        BigDecimal pavilionAngleUpperIdealRange = BigDecimal.valueOf(43);
        if (cutGradeDTO.getPavAngle().doubleValue() >= pavilionAngleLowerIdealRange.doubleValue()
                && cutGradeDTO.getPavAngle().doubleValue() <= pavilionAngleUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal depthPctLowerIdealRange = BigDecimal.valueOf(58);
        BigDecimal depthPctUpperIdealRange = BigDecimal.valueOf(62);
        if (cutGradeDTO.getDepthPct().doubleValue() >= depthPctLowerIdealRange.doubleValue()
                && cutGradeDTO.getDepthPct().doubleValue() <= depthPctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal tablePctLowerIdealRange = BigDecimal.valueOf(54);
        BigDecimal tablePctUpperIdealRange = BigDecimal.valueOf(58);
        if (cutGradeDTO.getTablePct().doubleValue() >= tablePctLowerIdealRange.doubleValue()
                && cutGradeDTO.getTablePct().doubleValue() <= tablePctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal girdlePctLowerIdealRange = BigDecimal.valueOf(2.5);
        BigDecimal girdlePctUpperIdealRange = BigDecimal.valueOf(5.5);
        if (cutGradeDTO.getGirdlePct().doubleValue() >= girdlePctLowerIdealRange.doubleValue()
                && cutGradeDTO.getGirdlePct().doubleValue() < girdlePctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal starPctLowerIdealRange = BigDecimal.valueOf(45);
        BigDecimal starPctUpperIdealRange = BigDecimal.valueOf(55);
        if (cutGradeDTO.getStarPct().doubleValue() >= starPctLowerIdealRange.doubleValue()
                && cutGradeDTO.getStarPct().doubleValue() <= starPctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        BigDecimal lowerHalfPctLowerIdealRange = BigDecimal.valueOf(75);
        BigDecimal lowerHalfPctUpperIdealRange = BigDecimal.valueOf(85);
        if (cutGradeDTO.getLowerHalfPct().doubleValue() >= lowerHalfPctLowerIdealRange.doubleValue()
                && cutGradeDTO.getLowerHalfPct().doubleValue() <= lowerHalfPctUpperIdealRange.doubleValue())
            cutGradeIdeal++;

        if (cutGradeDTO.getCulet().equals("None") || cutGradeDTO.getCulet().equals("Small"))
            cutGradeIdeal++;

        String cutGrade = switch (cutGradeIdeal) {
            case 0, 1 -> "Poor";
            case 2, 3, 4 -> "Fair";
            case 5, 6 -> "Good";
            case 7, 8 -> "Very Good";
            case 9, 10 -> "Excellent";
            default -> "";
        };
        valuationResult.setCut(cutGrade);
        return cutGrade;
    }

    @Override
    public String valuateClarityGrade(String id, ClarityGradeDTO clarityGradeDTO) {
        ValuationResultEntity valuationResult = valuationResultRepository.findById(id).orElse(null);
        if (valuationResult == null)
            return "Cannot find valuation result";

        int clarityGradeIdeal = 0;
        if (clarityGradeDTO.isLaserDrillHole())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isFeather())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isCrystal())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isChip())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isNeedle())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isCavity())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isPinpoint())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isBruise())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isCloud())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isEtchChannel())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isTwinningWisp())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isIndentedNatural())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isKnot())
            clarityGradeIdeal++;
        if (clarityGradeDTO.isNatural())
            clarityGradeIdeal++;

        String clarityGrade = switch (clarityGradeIdeal) {
            case 0, 1 -> "IF";
            case 2, 3 -> "VVS1";
            case 4, 5 -> "VVS2";
            case 6, 7 -> "VS1";
            case 8, 9 -> "VS2";
            case 10 -> "SI1";
            case 11 -> "SI2";
            case 12 -> "I1";
            case 13 -> "I2";
            case 14 -> "I3";
            default -> "";
        };
        valuationResult.setClarity(clarityGrade);
        return clarityGrade;
    }

    @Override
    public BigDecimal valuatePrice(String id, GeneratePriceDTO generatePriceDTO) {
        ValuationResultEntity valuationResult = valuationResultRepository.findById(id).orElse(null);
        if (valuationResult == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal price;

        int colorScore = switch (generatePriceDTO.getColor()) {
            case "D" -> 10;
            case "E" -> 9;
            case "F" -> 8;
            case "G" -> 7;
            case "H" -> 6;
            case "I" -> 5;
            case "J" -> 4;
            case "K" -> 3;
            case "L" -> 2;
            case "M", "N" -> 1;
            default -> 0;
        };

        int clarityScore = switch (generatePriceDTO.getClarity()) {
            case "IF" -> 9;
            case "VVS1" -> 8;
            case "VVS2" -> 7;
            case "VS1" -> 6;
            case "VS2" -> 5;
            case "SI1" -> 4;
            case "SI2" -> 3;
            case "I1" -> 2;
            case "I2", "I3" -> 1;
            default -> 0;
        };

        double cutScore = switch (generatePriceDTO.getCut()) {
            case "Excellent" -> 1.03;
            case "Very Good" -> 1;
            case "Good" -> 1 / 1.03;
            case "Fair" -> 1 / 1.15;
            case "Poor" -> 1 / 1.35;
            default -> 0;
        };

        double symmetryScore = switch (generatePriceDTO.getSymmetry()) {
            case "Excellent" -> 1.03;
            case "Very Good" -> 1;
            case "Good" -> 1 / 1.03;
            case "Fair" -> 1 / 1.15;
            case "Poor" -> 1 / 1.35;
            default -> 0;
        };

        double polishScore = switch (generatePriceDTO.getPolish()) {
            case "Excellent" -> 1.03;
            case "Very Good" -> 1;
            case "Good" -> 1 / 1.03;
            case "Fair" -> 1 / 1.15;
            case "Poor" -> 1 / 1.35;
            default -> 0;
        };

        double shapeScore = switch (generatePriceDTO.getShape()) {
            case "Round" -> 1;
            case "Cushion" -> 1 / 1.32;
            case "Emerald" -> 1 / 1.63;
            case "Oval" -> 1 / 1.1;
            case "Princess" -> 1 / 1.78;
            case "Pear" -> 1 / 1.17;
            case "Radiant" -> 1 / 1.33;
            case "Marquise" -> 1 / 1.05;
            case "Asscher" -> 1 / 1.71;
            case "Heart" -> 1 / 1.28;
            default -> 0;
        };

        double fluorescenceScore = switch (generatePriceDTO.getFluorescence()) {
            case "None" -> 1.09;
            case "Faint" -> 1;
            case "Medium" -> 1 / 1.07;
            case "Strong" -> 1 / 1.13;
            case "Very Strong" -> 1 / 1.19;
            default -> 0;
        };

        double originScore = switch (generatePriceDTO.getOrigin()) {
            case "Natural" -> 1;
            case "Lab Grown" -> 1 / 8.96;
            default -> 0;
        };

        price = BigDecimal.valueOf(colorScore)
                .multiply(BigDecimal.valueOf(clarityScore)
                        .multiply(BigDecimal.valueOf(100)
                                .multiply(generatePriceDTO.getCarat())
                                .multiply(generatePriceDTO.getCarat())
                                .multiply(BigDecimal.valueOf(cutScore)
                                        .multiply(BigDecimal.valueOf(symmetryScore))
                                        .multiply(BigDecimal.valueOf(polishScore))
                                        .multiply(BigDecimal.valueOf(shapeScore))
                                        .multiply(BigDecimal.valueOf(fluorescenceScore))
                                        .multiply(BigDecimal.valueOf(originScore)))));
        return price;
    }

    @Override
    public String createValuationResult(ProcessRequestEntity processRequest) {
        Optional<ValuationRequestEntity> valuationRequest = valuationRequestRepository.getById(processRequest.getPendingRequestId().getValuationRequestEntity().getId());
        if (valuationRequest.isEmpty()) return "";
        Date createdDate = new Date();
        long randomId = (long) (Math.random() * Math.pow(10, 10));
        ValuationResultEntity valuationResultEntity = new ValuationResultEntity(
                Long.toString(randomId),
                valuationRequest.get(),
                createdDate,
                createdDate,
                "",
                "",
                new BigDecimal(0),
                "",
                "",
                "",
                "",
                "",
                "",
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                new BigDecimal(0),
                "",
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                new BigDecimal(0));
        valuationResultRepository.save(valuationResultEntity);
        Optional<PendingRequestsEntity> pendingRequest = pendingRepository.findByProcessRequestId(processRequest.getId());
        if (pendingRequest.isPresent()) {
            List<String> pendingRequestImages = pendingImageRepository.findImageIdsByPendingRequestId(pendingRequest.get().getId());
            for (String imageId : pendingRequestImages) {
                ValuationResultImageEntity valuationResultImage = new ValuationResultImageEntity(imageId, valuationResultEntity);
                valuationResultImageRepository.save(valuationResultImage);
            }
        }
        return valuationResultEntity.getId();
    }

    @Override
    public List<String> getValuationResultImage(String id) {
        return valuationResultImageRepository.findImageIdsByValuationResultId(id);
    }

    @Override
    public String createValuationResultImage(CreateImageDTO createImageDTO) {
        Optional<ValuationResultEntity> valuationResult = valuationResultRepository.findById(createImageDTO.getValuationResultId());
        if (valuationResult.isEmpty()) return "Could not find valuation result";
        ValuationResultImageEntity valuationResultImage = new ValuationResultImageEntity(createImageDTO.getId(), valuationResult.get());
        valuationResultImageRepository.save(valuationResultImage);
        return "Create image successful";
    }

    @Override
    public String deleteValuationResultImage(String imageId) {
        valuationResultImageRepository.deleteById(imageId);
        return "Delete successful";
    }


    @Override
    public List<DiamondPojo> crawlLabGrownDiamond(String shape) {
        List<DiamondPojo> diamonds = new ArrayList<>();
        List<DiamondPriceEntity> diamondPriceEntities = new ArrayList<>();

        try {
            String url = shape.isEmpty() ? "https://www.stonealgo.com/lab-grown-diamond-prices/"
                    : "https://www.stonealgo.com/lab-grown-diamond-prices/?i=" + shape;
            Document doc = Jsoup.connect(url).get();
            Elements elements = doc.select(".bg-white.overflow-hidden.border");

            for (Element element : elements) {
                String name = element.select("a").text();
                String price = element.select(".text-xl").text();
                String priceChange = element.select(".text-xs .text-red-500").text();

                if (priceChange.isEmpty()) {
                    priceChange = element.select(".text-xs .text-green-400").text();
                }
                String weight = element.select("dd").get(0).text();
                String inventory = element.select("dd").get(1).text();
                String inventoryChangeUp = "";
                String inventoryChangeDown = "";
                String imageUrl = element.select("img").attr("src");

                Elements inventoryChangeElements = element.select("dd.chart-gray-100 .flex.items-baseline");
                for (Element changeElement : inventoryChangeElements) {
                    String svgPath = changeElement.select("svg path").attr("d");
                    String changeValue = changeElement.select("span").text();

                    if (svgPath.equals("M5 10l7-7m0 0l7 7m-7-7v18")) {
                        inventoryChangeUp = changeValue;
                    } else if (svgPath.equals("M19 14l-7 7m0 0l-7-7m7 7V3")) {
                        inventoryChangeDown = changeValue;
                    }
                }

                DiamondPriceEntity diamondPriceEntity = new DiamondPriceEntity(
                        shape,
                        name,
                        price,
                        priceChange,
                        weight,
                        inventory,
                        inventoryChangeUp,
                        inventoryChangeDown,
                        imageUrl
                );

                if (diamondPriceRepository.existsByShape(shape)) {
                    diamondPriceRepository.updateByShape(
                            inventoryChangeDown,
                            inventoryChangeUp,
                            "",
                            imageUrl,
                            inventory,
                            "",
                            inventoryChangeDown,
                            inventoryChangeUp,
                            name,
                            price,
                            priceChange,
                            "",
                            price,
                            "",
                            "",
                            weight,
                            shape
                    );
                } else {
                    diamondPriceEntities.add(diamondPriceEntity);
                }

                DiamondPojo diamond = new DiamondPojo(name, price, priceChange, weight, inventory, inventoryChangeUp, inventoryChangeDown, imageUrl);
                diamonds.add(diamond);
            }

            Elements rows = doc.select("tr[data-table_link=true]");
            for (Element row : rows) {
                String priceIndex = row.select("td a span").text();
                String chart = row.select("td img").attr("data-src");

                Elements tds = row.select("td");
                String priceUsd = tds.get(2).text();
                String range = tds.get(4).text();
                String inv = tds.get(5).text();

                String changeUp = "";
                String changeDown = "";

                for (Element td : tds) {
                    String changeValue = td.text();
                    String changeClass = td.className();

                    if (changeClass.contains("text-green-400")) {
                        changeUp = changeValue;
                    } else if (changeClass.contains("text-red-500")) {
                        changeDown = changeValue;
                    }
                }

                DiamondPriceEntity diamondPriceEntity = new DiamondPriceEntity(
                        priceIndex,
                        chart,
                        priceUsd,
                        changeUp,
                        changeDown,
                        range,
                        inv,
                        shape
                );

                if (diamondPriceRepository.existsByShape(shape)) {
                    diamondPriceRepository.updateByShape(
                            changeDown,
                            changeUp,
                            chart,
                            "",
                            inv,
                            "",
                            changeDown,
                            changeUp,
                            "",
                            priceUsd,
                            "",
                            priceIndex,
                            priceUsd,
                            range,
                            "",
                            "",
                            shape
                    );
                } else {
                    diamondPriceEntities.add(diamondPriceEntity);
                }

                DiamondPojo diamond = new DiamondPojo(priceIndex, chart, priceUsd, changeUp, changeDown, range, inv);
                diamonds.add(diamond);
            }

            String contentChange = doc.select("div.flex.flex-wrap.items-center.justify-start.text-lg.leading-6.font-bold.text-gray-900.mt-2 p").text();
            if (!contentChange.isEmpty()) {
                DiamondPojo diamond = new DiamondPojo(contentChange);
                diamonds.add(diamond);

                DiamondPriceEntity diamondPriceEntity = new DiamondPriceEntity(contentChange, shape);
                if (diamondPriceRepository.existsByShape(shape)) {
                    diamondPriceRepository.updateByShape(
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            contentChange,
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            shape
                    );
                } else {
                    diamondPriceEntities.add(diamondPriceEntity);
                }
            }

            if (!diamondPriceEntities.isEmpty()) {
                diamondPriceRepository.saveAll(diamondPriceEntities);
            }

        } catch (IOException e) {
            System.out.println(e.getMessage());
            List<DiamondPriceEntity> diamondEntities = diamondPriceRepository.findAllByShape(shape);
            diamonds = diamondEntities.stream()
                    .map(de -> new DiamondPojo(de.getTitle(), de.getName(), de.getPrice(), de.getPriceChange(), de.getWeight(), de.getInventory(), de.getInventoryChangeUp(), de.getInventoryChangeDown(), de.getImageUrl(), de.getPriceIndex(), de.getChart(), de.getPriceUsd(), de.getChangeUp(), de.getChangeDown(), de.getRange(), de.getInv()))
                    .collect(Collectors.toList());
        }

        return diamonds;
    }

    @Override
    public List<DiamondPojo> crawlNaturalDiamond(String shape) {
        List<DiamondPojo> diamonds = new ArrayList<>();
        List<DiamondPriceNatureEntity> diamondPriceEntities = new ArrayList<>();

        try {
            String url = shape.isEmpty() ? "https://www.stonealgo.com/diamond-prices/"
                    : "https://www.stonealgo.com/diamond-prices/?i=" + shape;
            Document doc = Jsoup.connect(url).get();
            Elements elements = doc.select(".bg-white.overflow-hidden.border");

            for (Element element : elements) {
                String name = element.select("a").text();
                String price = element.select(".text-xl").text();
                String priceChange = element.select(".text-xs .text-red-500").text();

                if (priceChange.isEmpty()) {
                    priceChange = element.select(".text-xs .text-green-400").text();
                }
                String weight = element.select("dd").get(0).text();
                String inventory = element.select("dd").get(1).text();
                String inventoryChangeUp = "";
                String inventoryChangeDown = "";
                String imageUrl = element.select("img").attr("src");

                Elements inventoryChangeElements = element.select("dd.chart-gray-100 .flex.items-baseline");
                for (Element changeElement : inventoryChangeElements) {
                    String svgPath = changeElement.select("svg path").attr("d");
                    String changeValue = changeElement.select("span").text();

                    if (svgPath.equals("M5 10l7-7m0 0l7 7m-7-7v18")) {
                        inventoryChangeUp = changeValue;
                    } else if (svgPath.equals("M19 14l-7 7m0 0l-7-7m7 7V3")) {
                        inventoryChangeDown = changeValue;
                    }
                }

                DiamondPriceNatureEntity diamondPriceEntity = new DiamondPriceNatureEntity(
                        shape,
                        name,
                        price,
                        priceChange,
                        weight,
                        inventory,
                        inventoryChangeUp,
                        inventoryChangeDown,
                        imageUrl
                );

                if (diamondPriceNatureRepository.existsByShape(shape)) {
                    diamondPriceNatureRepository.updateByShape(
                            inventoryChangeDown,
                            inventoryChangeUp,
                            "",
                            imageUrl,
                            inventory,
                            "",
                            inventoryChangeDown,
                            inventoryChangeUp,
                            name,
                            price,
                            priceChange,
                            "",
                            price,
                            "",
                            "",
                            weight,
                            shape
                    );
                } else {
                    diamondPriceEntities.add(diamondPriceEntity);
                }

                DiamondPojo diamond = new DiamondPojo(name, price, priceChange, weight, inventory, inventoryChangeUp, inventoryChangeDown, imageUrl);
                diamonds.add(diamond);
            }

            Elements rows = doc.select("tr[data-table_link=true]");
            for (Element row : rows) {
                String priceIndex = row.select("td a span").text();
                String chart = row.select("td img").attr("data-src");

                Elements tds = row.select("td");
                String priceUsd = tds.get(2).text();
                String range = tds.get(4).text();
                String inv = tds.get(5).text();

                String changeUp = "";
                String changeDown = "";

                for (Element td : tds) {
                    String changeValue = td.text();
                    String changeClass = td.className();

                    if (changeClass.contains("text-green-400")) {
                        changeUp = changeValue;
                    } else if (changeClass.contains("text-red-500")) {
                        changeDown = changeValue;
                    }
                }

                DiamondPriceNatureEntity diamondPriceEntity = new DiamondPriceNatureEntity(
                        priceIndex,
                        chart,
                        priceUsd,
                        changeUp,
                        changeDown,
                        range,
                        inv,
                        shape
                );

                if (diamondPriceNatureRepository.existsByShape(shape)) {
                    diamondPriceNatureRepository.updateByShape(
                            changeDown,
                            changeUp,
                            chart,
                            "",
                            inv,
                            "",
                            changeDown,
                            changeUp,
                            "",
                            priceUsd,
                            "",
                            priceIndex,
                            priceUsd,
                            range,
                            "",
                            "",
                            shape
                    );
                } else {
                    diamondPriceEntities.add(diamondPriceEntity);
                }

                DiamondPojo diamond = new DiamondPojo(priceIndex, chart, priceUsd, changeUp, changeDown, range, inv);
                diamonds.add(diamond);
            }

            String contentChange = doc.select("div.flex.flex-wrap.items-center.justify-start.text-lg.leading-6.font-bold.text-gray-900.mt-2 p").text();
            if (!contentChange.isEmpty()) {
                DiamondPojo diamond = new DiamondPojo(contentChange);
                diamonds.add(diamond);

                DiamondPriceNatureEntity diamondPriceEntity = new DiamondPriceNatureEntity(contentChange, shape);
                if (diamondPriceNatureRepository.existsByShape(shape)) {
                    diamondPriceNatureRepository.updateByShape(
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            contentChange,
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                            shape
                    );
                } else {
                    diamondPriceEntities.add(diamondPriceEntity);
                }
            }

            if (!diamondPriceEntities.isEmpty()) {
                diamondPriceNatureRepository.saveAll(diamondPriceEntities);
            }

        } catch (IOException e) {
            System.out.println(e.getMessage());
            List<DiamondPriceNatureEntity> diamondEntities = diamondPriceNatureRepository.findAllByShape(shape);
            diamonds = diamondEntities.stream()
                    .map(de -> new DiamondPojo(de.getName(), de.getPrice(), de.getPriceChange(), de.getWeight(), de.getInventory(), de.getInventoryChangeUp(), de.getInventoryChangeDown(), de.getImageUrl()))
                    .collect(Collectors.toList());
        }

        return diamonds;
    }

    @Override
    public List<DetailDiamondPojo> crawlDetailDiamond(String carat) {
        String url = "https://www.stonealgo.com/diamond-prices/" + carat + "-carat-diamond-prices/";
        List<DetailDiamondPojo> diamondPrices = new ArrayList<>();

        try {
            Document doc = Jsoup.connect(url).get();
            Elements xAxisElements = doc.select("apexcharts-xaxis-texts-g text > title");
            List<String> dates = new ArrayList<>();
            for (Element element : xAxisElements) {
                String date = element.text();
                if (!date.isEmpty()) {
                    dates.add(date);
                }
            }

            Elements yAxisElements = doc.select("apexcharts-yaxis-texts-g text > title");
            List<Double> prices = new ArrayList<>();
            for (Element element : yAxisElements) {
                String priceText = element.text().replace("%", "");
                if (!priceText.isEmpty()) {
                    try {
                        double price = Double.parseDouble(priceText);
                        prices.add(price);
                    } catch (NumberFormatException e) {
                        System.out.println(e.getMessage());
                    }
                }
            }

            for (int i = 0; i < Math.min(dates.size(), prices.size()); i++) {
                DetailDiamondPojo diamondPrice = new DetailDiamondPojo(prices.get(i), dates.get(i));
                diamondPrices.add(diamondPrice);
            }

        } catch (IOException e) {
            System.out.println(e.getMessage());
        }

        return diamondPrices;
    }
}