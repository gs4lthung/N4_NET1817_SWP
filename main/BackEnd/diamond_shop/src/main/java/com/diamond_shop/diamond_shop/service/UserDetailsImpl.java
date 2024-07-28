package com.diamond_shop.diamond_shop.service;


import java.io.Serial;
import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.diamond_shop.diamond_shop.entity.AccountEntity;

import lombok.Getter;
@Getter
public class UserDetailsImpl implements UserDetails {
    @Serial
    private static final long serialVersionUID = 1L;

    private int id;
    private String username;
    private String fullname;
    private String phonenumber;
    private String address;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(int id, String username,String fullname,String phonenumber,String address, String email, String password, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.phonenumber = phonenumber;
        this.address = address;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build(AccountEntity accountEntity) {
        GrantedAuthority authority = new SimpleGrantedAuthority(accountEntity.getRole().getName());

        return new UserDetailsImpl(
                accountEntity.getId(),
                accountEntity.getUsername(),
                accountEntity.getFullname(),
                accountEntity.getPhone_number(),
                accountEntity.getAddress(),
                accountEntity.getEmail(),
                accountEntity.getPassword(),
                Collections.singletonList(authority));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
