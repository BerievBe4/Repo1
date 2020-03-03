package com.example.demo.service;

import com.example.demo.dto.ObjectDto;
import com.example.demo.model.Object;
import com.example.demo.repository.ObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ObjectService {

    @Autowired
    private ObjectRepository objectRepository;

    public Object getObject(Integer id){
        return objectRepository.findById(id).orElse(null);
    }

    public List<Object> getObjects(){
        return objectRepository.findAll();
    }

    public Integer saveObject(ObjectDto objectDto){
        Object object = new Object(objectDto.getCoords());

        object.setType(objectDto.getType());

        return objectRepository.save(object).getId();
    }

    public void updateObject(Integer id, ObjectDto objectDto){
        Object object = objectRepository.findById(id).orElse(null);

        object.setCoords(objectDto.getCoords());

        objectRepository.save(object);
    }


    public void deleteObject(Integer id){
        objectRepository.deleteById(id);
    }
}