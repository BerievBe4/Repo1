package com.example.demo.model;

import com.example.demo.dto.GeoObjectDto;
import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
@Data
@Entity
@Table(name = "point")
public class GeoObject {
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

    public GeoObject() {
    }

    public GeoObject(String coords) {
        this.coords = coords;
    }


    public GeoObject(GeoObjectDto objectDto){
        this.coords = objectDto.getCoords();
        this.type = objectDto.getType();
    }

    public String getCoords() {
        return coords;
    }

    public void setCoords(String coords) {
        this.coords = coords;
    }
}
