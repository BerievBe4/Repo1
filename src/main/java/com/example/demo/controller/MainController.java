package com.example.demo.controller;

import com.example.demo.dto.ObjectDto;
import com.example.demo.model.Object;
import com.example.demo.service.ObjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/points")
@RequiredArgsConstructor
@CrossOrigin
public class MainController {

    private final ObjectService objectService;


    @GetMapping("/{id}")
    public Object getObject(@PathVariable("id") Integer id) {
        return this.objectService.getObject(id);
    }

    @GetMapping("/")
    public List<Object> getObject() {
        return this.objectService.getObjects();
    }

    @PostMapping("/create")
    public Integer saveObject(ObjectDto objectDto) {
        return this.objectService.saveObject(objectDto);
    }

    @PostMapping("/update/{id}")
    public void updateObject(@PathVariable("id") Integer id, ObjectDto objectDto) {
        this.objectService.updateObject(id, objectDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteObject(@PathVariable("id") Integer id){
        this.objectService.deleteObject(id);
    }
}