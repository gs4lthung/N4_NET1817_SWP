package com.diamond_shop.diamond_shop.repository;

import com.diamond_shop.diamond_shop.entity.PendingRequestImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PendingImageRepository extends JpaRepository<PendingRequestImageEntity, String> {
    @Query("SELECT v.id FROM PendingRequestImageEntity v WHERE v.pendingRequest.id=:id")
    List<String> findImageIdsByPendingRequestId(@Param("id") int id);

    @Query("SELECT v.id FROM PendingRequestImageEntity v WHERE v.pendingRequest.processRequestEntity.id=:id")
    List<String> findImageIdsByProcessRequestId(@Param("id") int id);
}
