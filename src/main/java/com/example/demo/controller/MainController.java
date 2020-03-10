package com.example.demo.controller;

import com.example.demo.dto.GeoObjectDto;
import com.example.demo.model.GeoObject;
import com.example.demo.service.GeoObjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/geoObjects")
@RequiredArgsConstructor
@CrossOrigin
public class MainController {

    private final GeoObjectService objectService;


    @GetMapping("/{id}")
    public GeoObject getObject(@PathVariable("id") Integer id) {
        return this.objectService.getObject(id);
    }

    @GetMapping("/all")
    public List<GeoObject> getObject() {
        return this.objectService.getObjects();
    }

    @PostMapping("/create")
    public Integer saveObject(GeoObjectDto objectDto) {
        return this.objectService.saveObject(objectDto);
    }

    @PostMapping("/update/{id}")
    public void updateObject(@PathVariable("id") Integer id, GeoObjectDto objectDto) {
        this.objectService.updateObject(id, objectDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteObject(@PathVariable("id") Integer id){
        this.objectService.deleteObject(id);
    }

    @DeleteMapping("/delete/all")
    public void deleteAllObjects(){
        this.objectService.deleteAllObjects();
    }
}