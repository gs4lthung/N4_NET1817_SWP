package com.diamond_shop.diamond_shop.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "valuation_results")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ValuationResultEntity {
    @Id
    @Column(name = "id")
    private String id;

    @OneToOne
    @JoinColumn(name = "valuation_request_id")
    private ValuationRequestEntity valuationRequestId;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "update_date")
    private Date updateDate;

    @Column(name = "origin")
    private String origin;

    @Column(name = "shape")
    private String shape;

    @Column(name = "carat")
    private BigDecimal carat;

    @Column(name = "color")
    private String color;

    @Column(name = "cut")
    private String cut;

    @Column(name = "clarity")
    private String clarity;

    @Column(name = "symmetry")
    private String symmetry;

    @Column(name = "polish")
    private String polish;

    @Column(name = "fluorescence")
    private String fluorescence;

    @Column(name = "length")
    private BigDecimal length;

    @Column(name = "width")
    private BigDecimal width;

    @Column(name = "depth")
    private BigDecimal depth;

    @Column(name = "depth_pct")
    private BigDecimal depthPct;

    @Column(name = "table_pct")
    private BigDecimal tablePct;

    @Column(name = "pav_pct")
    private BigDecimal pavPct;

    @Column(name = "pav_angle")
    private BigDecimal pavAngle;

    @Column(name = "crown_pct")
    private BigDecimal crownPct;

    @Column(name = "crown_angle")
    private BigDecimal crownAngle;

    @Column(name = "lower_half_pct")
    private BigDecimal lowerHalfPct;

    @Column(name = "star_pct")
    private BigDecimal starPct;

    @Column(name = "girdle_pct")
    private BigDecimal girdlePct;

    @Column(name = "culet")
    private String culet;

    @Column(name = "is_laser_drill_hole")
    private boolean isLaserDrillHole;

    @Column(name = "is_feather")
    private boolean isFeather;

    @Column(name = "is_crystal")
    private boolean isCrystal;

    @Column(name = "is_chip")
    private boolean isChip;

    @Column(name = "is_needle")
    private boolean isNeedle;

    @Column(name = "is_cavity")
    private boolean isCavity;

    @Column(name = "is_pinpoint")
    private boolean isPinpoint;

    @Column(name = "is_bruise")
    private boolean isBruise;

    @Column(name = "is_cloud")
    private boolean isCloud;

    @Column(name = "is_etch_channel")
    private boolean isEtchChannel;

    @Column(name = "is_twinning_wisp")
    private boolean isTwinningWisp;

    @Column(name = "is_indented_natural")
    private boolean isIndentedNatural;

    @Column(name = "is_knot")
    private boolean isKnot;

    @Column(name = "is_natural")
    private boolean isNatural;

    @Column(name = "price")
    private BigDecimal price;

    @OneToOne(mappedBy = "valuationResultId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ProcessResultEntity processResults;

    @OneToMany(mappedBy = "valuationResult", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ValuationResultImageEntity> images = new HashSet<>();

    public ValuationResultEntity(
            String id,
            ValuationRequestEntity valuationRequestId,
            Date createdDate,
            Date updateDate,
            String origin,
            String shape,
            BigDecimal carat,
            String color,
            String cut,
            String clarity,
            String symmetry,
            String polish,
            String fluorescence,
            BigDecimal length,
            BigDecimal width,
            BigDecimal depth,
            BigDecimal depthPct,
            BigDecimal tablePct,
            BigDecimal pavPct,
            BigDecimal pavAngle,
            BigDecimal crownPct,
            BigDecimal crownAngle,
            BigDecimal lowerHalfPct,
            BigDecimal starPct,
            BigDecimal girdlePct,
            String culet,
            boolean isLaserDrillHole,
            boolean isFeather,
            boolean isCrystal,
            boolean isChip,
            boolean isNeedle,
            boolean isCavity,
            boolean isPinpoint,
            boolean isBruise,
            boolean isCloud,
            boolean isEtchChannel,
            boolean isTwinningWisp,
            boolean isIndentedNatural,
            boolean isKnot,
            boolean isNatural,
            BigDecimal price) {
        this.id = id;
        this.valuationRequestId = valuationRequestId;
        this.createdDate = createdDate;
        this.updateDate = updateDate;
        this.origin = origin;
        this.shape = shape;
        this.carat = carat;
        this.color = color;
        this.cut = cut;
        this.clarity = clarity;
        this.symmetry = symmetry;
        this.polish = polish;
        this.fluorescence = fluorescence;
        this.length = length;
        this.width = width;
        this.depth = depth;
        this.depthPct = depthPct;
        this.tablePct = tablePct;
        this.pavPct = pavPct;
        this.pavAngle = pavAngle;
        this.crownPct = crownPct;
        this.crownAngle = crownAngle;
        this.lowerHalfPct = lowerHalfPct;
        this.starPct = starPct;
        this.girdlePct = girdlePct;
        this.culet = culet;
        this.isLaserDrillHole = isLaserDrillHole;
        this.isFeather = isFeather;
        this.isCrystal = isCrystal;
        this.isChip = isChip;
        this.isNeedle = isNeedle;
        this.isCavity = isCavity;
        this.isPinpoint = isPinpoint;
        this.isBruise = isBruise;
        this.isCloud = isCloud;
        this.isEtchChannel = isEtchChannel;
        this.isTwinningWisp = isTwinningWisp;
        this.isIndentedNatural = isIndentedNatural;
        this.isKnot = isKnot;
        this.isNatural = isNatural;
        this.price = price;
    }
}
