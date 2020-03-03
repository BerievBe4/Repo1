package com.example.demo.model;

import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
@Data
@Entity
@Table(name = "point")
public class Object {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    @Type(type = "text")
    private String coords;

    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object() {
    }

    public Object(String coords) {
        this.coords = coords;
    }


    public String getCoords() {
        return coords;
    }

    public void setCoords(String coords) {
        this.coords = coords;
    }
}
