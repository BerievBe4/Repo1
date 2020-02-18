package com.example.demo.repository;

import com.example.demo.model.Point;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<Point,Integer> {
}

