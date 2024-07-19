package com.diamond_shop.diamond_shop.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "diamond_prices")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class DiamondPriceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "change_down")
    private String changeDown;

    @Column(name = "change_up")
    private String changeUp;

    @Column(name = "chart")
    private String chart;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "inv")
    private String inv;

    @Column(name = "inventory")
    private String inventory;

    @Column(name = "inventory_change_down")
    private String inventoryChangeDown;

    @Column(name = "inventory_change_up")
    private String inventoryChangeUp;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private String price;

    @Column(name = "price_change")
    private String priceChange;

    @Column(name = "price_index")
    private String priceIndex;

    @Column(name = "price_usd")
    private String priceUsd;

    @Column(name = "range")
    private String range;

    @Column(name = "title")
    private String title;

    @Column(name = "weight")
    private String weight;

    @Column(name = "shape")
    private String shape;
    public DiamondPriceEntity(String shape,String name, String price, String priceChange, String weight,String inventory, String inventoryChangeUp,String inventoryChangeDown,String imageUrl) {
        this.shape = shape;
        this.name = name;
        this.price = price;
        this.priceChange = priceChange;
        this.weight = weight;
        this.inventory = inventory;
        this.inventoryChangeUp = inventoryChangeUp;
        this.inventoryChangeDown = inventoryChangeDown;
        this.imageUrl = imageUrl;
    }

    public DiamondPriceEntity(String priceIndex,String chart, String priceUsd, String changeUp, String changeDown, String range,String inv,String shape) {
        this.priceIndex = priceIndex;
        this.chart = chart;
        this.priceUsd = priceUsd;
        this.changeUp = changeUp;
        this.changeDown = changeDown;
        this.range = range;
        this.inv = inv;
        this.shape = shape;
    }

    public DiamondPriceEntity(String title, String shape) {
        this.title = title;
        this.shape = shape;
    }
}
