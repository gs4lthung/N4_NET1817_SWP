package com.diamond_shop.diamond_shop.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.diamond_shop.diamond_shop.entity.DiamondPriceEntity;

import java.util.List;

@Repository
public interface DiamondPriceRepository extends JpaRepository<DiamondPriceEntity, Integer> {

    @Query("SELECT d FROM DiamondPriceEntity d WHERE d.shape = :shape")
    List<DiamondPriceEntity> findAllByShape(@Param("shape") String shape);

    @Query("SELECT COUNT(d) > 0 FROM DiamondPriceEntity d WHERE d.shape = :shape")
    Boolean existsByShape(@Param("shape") String shape);

    @Modifying
    @Transactional
    @Query("UPDATE DiamondPriceEntity s " +
            "SET s.changeDown = :changeDown, " +
            "s.changeUp = :changeUp, " +
            "s.chart = :chart, " +
            "s.imageUrl = :imageUrl, " +
            "s.inv = :inv, " +
            "s.inventory = :inventory, " +
            "s.inventoryChangeDown = :inventoryChangeDown, " +
            "s.inventoryChangeUp = :inventoryChangeUp, " +
            "s.name = :name, " +
            "s.price = :price, " +
            "s.priceChange = :priceChange, " +
            "s.priceIndex = :priceIndex, " +
            "s.priceUsd = :priceUsd, " +
            "s.range = :range, " +
            "s.title = :title, " +
            "s.weight = :weight " +
            "WHERE s.shape = :shape")
    void updateByShape(
        @Param("changeDown") String changeDown,
        @Param("changeUp") String changeUp,
        @Param("chart") String chart,
        @Param("imageUrl") String imageUrl,
        @Param("inv") String inv,
        @Param("inventory") String inventory,
        @Param("inventoryChangeDown") String inventoryChangeDown,
        @Param("inventoryChangeUp") String inventoryChangeUp,
        @Param("name") String name,
        @Param("price") String price,
        @Param("priceChange") String priceChange,
        @Param("priceIndex") String priceIndex,
        @Param("priceUsd") String priceUsd,
        @Param("range") String range,
        @Param("title") String title,
        @Param("weight") String weight,
        @Param("shape") String shape
    );
}
