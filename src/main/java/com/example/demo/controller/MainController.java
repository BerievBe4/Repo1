package com.example.demo.controller;

import com.example.demo.model.Point;
import com.example.demo.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/points")
@RequiredArgsConstructor
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

    @PostMapping("/")
    public Point savePoint(Point point) {
        return this.pointService.savePoint(point);
    }

    @DeleteMapping("/{id}")
    public void deletePoint(@PathVariable("id") Integer id){
        this.pointService.deletePoint(id);
    }
}