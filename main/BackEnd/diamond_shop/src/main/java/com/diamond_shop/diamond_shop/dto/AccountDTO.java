package com.diamond_shop.diamond_shop.dto;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountDTO {
    private int id;
    private int roleid;
    private String username;
    private String fullname;
    private String email;
    private String phonenumber;
    private String password;
    private String address;

    public AccountDTO(int roleid, String username, String fullname, String email, String phonenumber, String password, String address) {
        this.roleid = roleid;
        this.username = username;
        this.fullname = fullname;
        this.email = email;
        this.phonenumber = phonenumber;
        this.password = password;
        this.address = address;
    }
}
