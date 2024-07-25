package com.diamond_shop.diamond_shop.pojo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class ProcessResultPojo {
    private boolean hasCertificate;
    private String valuationResultId;
    private Date createdDate;
    private Date updateDate;
    private String valuationStaffName;
    private String serviceName;
    private String serviceStatistic;
    private String status;
    private String origin;
    private String shape;
    private BigDecimal carat;
    private String color;
    private String cut;
    private String clarity;
    private String symmetry;
    private String polish;
    private String fluorescence;
    private BigDecimal length;
    private BigDecimal width;
    private BigDecimal depth;
    private BigDecimal depthPct;
    private BigDecimal tablePct;
    private BigDecimal pavPct;
    private BigDecimal pavAngle;
    private BigDecimal crownPct;
    private BigDecimal crownAngle;
    private BigDecimal lowerHalfPct;
    private BigDecimal starPct;
    private BigDecimal girdlePct;
    private String culet;
    private boolean isLaserDrillHole;
    private boolean isFeather;
    private boolean isCrystal;
    private boolean isChip;
    private boolean isNeedle;
    private boolean isCavity;
    private boolean isPinpoint;
    private boolean isBruise;
    private boolean isCloud;
    private boolean isEtchChannel;
    private boolean isTwinningWisp;
    private boolean isIndentedNatural;
    private boolean isKnot;
    private boolean isNatural;
    private BigDecimal price;
}
