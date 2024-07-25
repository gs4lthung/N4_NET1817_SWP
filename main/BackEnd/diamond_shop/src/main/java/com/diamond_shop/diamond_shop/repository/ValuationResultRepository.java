package com.diamond_shop.diamond_shop.repository;

import com.diamond_shop.diamond_shop.entity.ValuationResultEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ValuationResultRepository extends JpaRepository<ValuationResultEntity, String> {

    @Query("SELECT v FROM ValuationResultEntity v WHERE v.id=:id")
    Optional<ValuationResultEntity> findById(@Param("id") String id);

    @Query("SELECT p FROM ValuationResultEntity p WHERE p.valuationRequestId.id = :valuationRequestId")
    ValuationResultEntity findByValuationRequestId(@Param("valuationRequestId") int valuationRequestId);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationResultPojo(" +
            "v.processResults.valuationResultId.valuationRequestId.pendingRequestId.hasCertificate" +
            ",v.id," +
            "v.createdDate, " +
            "v.valuationRequestId.serviceId.name," +
            "v.valuationRequestId.serviceId.statistic," +
            "v.origin," +
            "v.shape," +
            "v.carat," +
            "v.color," +
            "v.cut," +
            "v.clarity," +
            "v.symmetry," +
            "v.polish," +
            "v.fluorescence," +
            "v.length," +
            "v.width," +
            "v.depth," +
            "v.depthPct," +
            "v.tablePct," +
            "v.pavPct," +
            "v.pavAngle," +
            "v.crownPct," +
            "v.crownAngle," +
            "v.lowerHalfPct," +
            "v.starPct," +
            "v.girdlePct," +
            "v.culet," +
            "v.isLaserDrillHole," +
            "v.isFeather," +
            "v.isCrystal," +
            "v.isChip," +
            "v.isNeedle," +
            "v.isCavity," +
            "v.isPinpoint," +
            "v.isBruise," +
            "v.isCloud," +
            "v.isEtchChannel," +
            "v.isTwinningWisp," +
            "v.isIndentedNatural," +
            "v.isKnot," +
            "v.isNatural," +
            "v.price)" +
            "FROM ValuationResultEntity as v ")
    Page<ValuationResultEntity> findAllValuationResults(Pageable pageable);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationResultPojo(" +
            "v.processResults.valuationResultId.valuationRequestId.pendingRequestId.hasCertificate," +
            "v.id," +
            "v.createdDate, " +
            "v.valuationRequestId.serviceId.name," +
            "v.valuationRequestId.serviceId.statistic," +
            "v.origin," +
            "v.shape," +
            "v.carat," +
            "v.color," +
            "v.cut," +
            "v.clarity," +
            "v.symmetry," +
            "v.polish," +
            "v.fluorescence," +
            "v.length," +
            "v.width," +
            "v.depth," +
            "v.depthPct," +
            "v.tablePct," +
            "v.pavPct," +
            "v.pavAngle," +
            "v.crownPct," +
            "v.crownAngle," +
            "v.lowerHalfPct," +
            "v.starPct," +
            "v.girdlePct," +
            "v.culet," +
            "v.isLaserDrillHole," +
            "v.isFeather," +
            "v.isCrystal," +
            "v.isChip," +
            "v.isNeedle," +
            "v.isCavity," +
            "v.isPinpoint," +
            "v.isBruise," +
            "v.isCloud," +
            "v.isEtchChannel," +
            "v.isTwinningWisp," +
            "v.isIndentedNatural," +
            "v.isKnot," +
            "v.isNatural," +
            "v.price)" +
            "FROM ValuationResultEntity as v " +
            "WHERE v.processResults.status='Valuated'")
    Page<ValuationResultEntity> findAllValuatedValuationResults(Pageable pageable);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationResultPojo(" +
            "v.processResults.valuationResultId.valuationRequestId.pendingRequestId.hasCertificate," +
            "v.id," +
            "v.createdDate, " +
            "v.valuationRequestId.serviceId.name," +
            "v.valuationRequestId.serviceId.statistic," +
            "v.origin," +
            "v.shape," +
            "v.carat," +
            "v.color," +
            "v.cut," +
            "v.clarity," +
            "v.symmetry," +
            "v.polish," +
            "v.fluorescence," +
            "v.length," +
            "v.width," +
            "v.depth," +
            "v.depthPct," +
            "v.tablePct," +
            "v.pavPct," +
            "v.pavAngle," +
            "v.crownPct," +
            "v.crownAngle," +
            "v.lowerHalfPct," +
            "v.starPct," +
            "v.girdlePct," +
            "v.culet," +
            "v.isLaserDrillHole," +
            "v.isFeather," +
            "v.isCrystal," +
            "v.isChip," +
            "v.isNeedle," +
            "v.isCavity," +
            "v.isPinpoint," +
            "v.isBruise," +
            "v.isCloud," +
            "v.isEtchChannel," +
            "v.isTwinningWisp," +
            "v.isIndentedNatural," +
            "v.isKnot," +
            "v.isNatural," +
            "v.price)" +
            "FROM ValuationResultEntity as v " +
            "WHERE v.id=:id")
    Optional<ValuationResultEntity> findValuationResultById(@Param("id") String id);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationResultPojo(" +
            "v.processResults.valuationResultId.valuationRequestId.pendingRequestId.hasCertificate," +
            "v.id," +
            "v.createdDate, " +
            "v.valuationRequestId.serviceId.name," +
            "v.valuationRequestId.serviceId.statistic," +
            "v.origin," +
            "v.shape," +
            "v.carat," +
            "v.color," +
            "v.cut," +
            "v.clarity," +
            "v.symmetry," +
            "v.polish," +
            "v.fluorescence," +
            "v.length," +
            "v.width," +
            "v.depth," +
            "v.depthPct," +
            "v.tablePct," +
            "v.pavPct," +
            "v.pavAngle," +
            "v.crownPct," +
            "v.crownAngle," +
            "v.lowerHalfPct," +
            "v.starPct," +
            "v.girdlePct," +
            "v.culet," +
            "v.isLaserDrillHole," +
            "v.isFeather," +
            "v.isCrystal," +
            "v.isChip," +
            "v.isNeedle," +
            "v.isCavity," +
            "v.isPinpoint," +
            "v.isBruise," +
            "v.isCloud," +
            "v.isEtchChannel," +
            "v.isTwinningWisp," +
            "v.isIndentedNatural," +
            "v.isKnot," +
            "v.isNatural," +
            "v.price)" +
            "FROM ValuationResultEntity as v " +
            "WHERE v.valuationRequestId.pendingRequestId.customerId.id=:customerId")
    Page<ValuationResultEntity> getValuationResultsByCustomerId(Pageable pageable, @Param("customerId") int customerId);

    @Query("SELECT " +
            "NEW com.diamond_shop.diamond_shop.pojo.ValuationResultPojo(" +
            "v.processResults.valuationResultId.valuationRequestId.pendingRequestId.hasCertificate," +
            "v.id," +
            "v.createdDate, " +
            "v.valuationRequestId.serviceId.name," +
            "v.valuationRequestId.serviceId.statistic," +
            "v.origin," +
            "v.shape," +
            "v.carat," +
            "v.color," +
            "v.cut," +
            "v.clarity," +
            "v.symmetry," +
            "v.polish," +
            "v.fluorescence," +
            "v.length," +
            "v.width," +
            "v.depth," +
            "v.depthPct," +
            "v.tablePct," +
            "v.pavPct," +
            "v.pavAngle," +
            "v.crownPct," +
            "v.crownAngle," +
            "v.lowerHalfPct," +
            "v.starPct," +
            "v.girdlePct," +
            "v.culet," +
            "v.isLaserDrillHole," +
            "v.isFeather," +
            "v.isCrystal," +
            "v.isChip," +
            "v.isNeedle," +
            "v.isCavity," +
            "v.isPinpoint," +
            "v.isBruise," +
            "v.isCloud," +
            "v.isEtchChannel," +
            "v.isTwinningWisp," +
            "v.isIndentedNatural," +
            "v.isKnot," +
            "v.isNatural," +
            "v.price)" +
            "FROM ValuationResultEntity as v " +
            "WHERE v.valuationRequestId.id=:valuationRequestId")
    Optional<ValuationResultEntity> getValuationResultByValuationRequestId(@Param("valuationRequestId") int valuationRequestId);

    @Query(value = "SELECT COUNT(v.id) " +
            "FROM ValuationResultEntity v " +
            "WHERE v.processResults.status='Valuated'")
    int totalValuationResults();

    @Query(value = "SELECT COUNT(v.id) " +
            "FROM ValuationResultEntity v " +
            "WHERE v.processResults.status!='Valuated'")
    int totalNotDoneValuationResults();
}
