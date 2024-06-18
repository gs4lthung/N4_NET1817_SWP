package com.diamond_shop.diamond_shop.service;

import java.util.List;

import com.diamond_shop.diamond_shop.dto.ValuationResultDTO;
import com.diamond_shop.diamond_shop.entity.ProcessRequestEntity;
import com.diamond_shop.diamond_shop.pojo.DiamondPojo;

public interface ValuationResultService {

    String valuateDiamond(ValuationResultDTO valuationResultDTO);

    String assignForValuationStaff(ProcessRequestEntity processRequest);

    boolean checkSealingDate(int valuationResultId);

    List<DiamondPojo> crawlNaturalDiamond(String shape);

    List<DiamondPojo> crawlLabGrownDiamond(String shape);
}
