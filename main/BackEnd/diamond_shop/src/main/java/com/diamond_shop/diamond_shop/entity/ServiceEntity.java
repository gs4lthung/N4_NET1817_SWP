package com.diamond_shop.diamond_shop.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "services")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private int price;

    @Column(name = "time")
    private int time;

    @Column(name = "statistic")
    private String statistic;

    @OneToMany(mappedBy = "serviceId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ValuationRequestEntity> valuationRequestEntities = new HashSet<>();

    public ServiceEntity(String name, int price, int time, String statistic) {
        this.name = name;
        this.price = price;
        this.time = time;
        this.statistic = statistic;
    }
}
