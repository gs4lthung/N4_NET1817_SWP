package com.diamond_shop.diamond_shop.pojo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class ProcessRequestPojo {
    private int id;
    private String status;
    private String description;
    private Date createdDate;
    private Date receiveDate;
    private int pendingRequestId;
    private int consultingStaffId;
    private String consultingStaffName;
    private String consultingStaffPhone;
    private int customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
}
