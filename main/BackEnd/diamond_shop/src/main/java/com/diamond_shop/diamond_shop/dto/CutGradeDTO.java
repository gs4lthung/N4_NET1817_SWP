package com.diamond_shop.diamond_shop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class CutGradeDTO {
    BigDecimal tablePct;
    BigDecimal depthPct;
    BigDecimal pavPct;
    BigDecimal pavAngle;
    BigDecimal crownPct;
    BigDecimal crownAngle;
    BigDecimal lowerHalfPct;
    BigDecimal starPct;
    BigDecimal girdlePct;
    String culet;
}
