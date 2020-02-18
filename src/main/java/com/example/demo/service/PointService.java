package com.example.demo.service;

import com.example.demo.model.Point;
import com.example.demo.repository.PointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PointService {

    @Autowired
    private PointRepository pointRepository;

    public Point getPoint(Integer id){
        return pointRepository.findById(id).orElse(null);
    }

    public List<Point> getPoints(){
        return pointRepository.findAll();
    }

    public Point savePoint(Point point){
        return pointRepository.save(point);
    }

    public void deletePoint(Integer id){
        pointRepository.deleteById(id);
    }
}