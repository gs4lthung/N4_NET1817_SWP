package com.diamond_shop.diamond_shop.pojo;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
public class LoginPojo {
    private String token;
    private String type = "Bearer";
    private int id;
    private String username;
    private String fullname;
    private String phonenumber;
    private String address;
    private String email;
    private Collection<? extends GrantedAuthority> authorities;
    public LoginPojo(String token, int id, String username,String fullname,String phonenumber,String address, String email, Collection<? extends GrantedAuthority> collection) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.phonenumber = phonenumber;
        this.address = address;
        this.email = email;
        this.authorities = collection;
    }
}
