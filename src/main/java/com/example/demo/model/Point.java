package com.example.demo.model;

import lombok.Data;

import javax.persistence.*;
@Data
@Entity
@Table(name = "point")
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String coords;

    public Point() {
    }

    public Point(String coords) {
        this.coords = coords;
    }


    public String getCoords() {
        return coords;
    }

    public void setCoords(String coords) {
        this.coords = coords;
    }
}
