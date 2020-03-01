package com.example.demo.dto;

public class PointDto {
    private String coords;

    @Override
    public String toString() {
        return "PointDto{" +
                "coords='" + coords + '\'' +
                '}';
    }

    public String getCoords() {
        return coords;
    }

    public void setCoords(String coords) {
        this.coords = coords;
    }
}
