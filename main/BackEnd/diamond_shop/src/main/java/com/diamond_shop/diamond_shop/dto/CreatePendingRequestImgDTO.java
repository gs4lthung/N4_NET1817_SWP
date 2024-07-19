package com.diamond_shop.diamond_shop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CreatePendingRequestImgDTO {
    @NotNull
    private String id;
    @NotNull
    private int pendingRequestId;
}
