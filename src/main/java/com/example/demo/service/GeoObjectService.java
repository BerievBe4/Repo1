package com.example.demo.service;

import com.example.demo.dto.GeoObjectDto;
import com.example.demo.model.GeoObject;
import com.example.demo.repository.GeoObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GeoObjectService {

    @Autowired
    private GeoObjectRepository objectRepository;

    public GeoObject getObject(Integer id){
        return objectRepository.findById(id).orElse(null);
    }

    public List<GeoObject> getObjects(){
        return objectRepository.findAll();
    }

    public Integer saveObject(GeoObjectDto objectDto){
        GeoObject object = new GeoObject(objectDto.getCoords());

        object.setType(objectDto.getType());

        return objectRepository.save(object).getId();
    }



    public void updateObject(Integer id, GeoObjectDto objectDto){
        GeoObject object = objectRepository.findById(id).orElse(null);

        object.setCoords(objectDto.getCoords());

        objectRepository.save(object);
    }


    public void deleteObject(Integer id){
        objectRepository.deleteById(id);
    }

    public void deleteAllObjects(){
        objectRepository.deleteAll();
    }
}