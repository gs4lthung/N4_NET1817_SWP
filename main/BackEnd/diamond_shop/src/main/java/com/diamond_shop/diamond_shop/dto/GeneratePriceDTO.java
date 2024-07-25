package com.diamond_shop.diamond_shop.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class GeneratePriceDTO {
    String origin;
    String shape;
    BigDecimal carat;
    String cut;
    String color;
    String clarity;
    String polish;
    String symmetry;
    String fluorescence;
}
