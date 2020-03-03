package com.example.demo.repository;

import com.example.demo.model.Object;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObjectRepository extends JpaRepository<Object,Integer> {
}

