package com.example.demo.controller;

import com.example.demo.dto.PointDto;
import com.example.demo.model.Point;
import com.example.demo.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/points")
@RequiredArgsConstructor
@CrossOrigin
public class MainController {

    private final PointService pointService;


    @GetMapping("/{id}")
    public Point getPoint(@PathVariable("id") Integer id) {
        return this.pointService.getPoint(id);
    }

    @GetMapping("/")
    public List<Point> getPoints() {
        return this.pointService.getPoints();
    }

    @PostMapping("/create")
    public Integer savePoint(PointDto pointDto) {
        return this.pointService.savePoint(pointDto);
    }

    @DeleteMapping("/delete/{id}")
    public void deletePoint(@PathVariable("id") Integer id){
        this.pointService.deletePoint(id);
    }
}