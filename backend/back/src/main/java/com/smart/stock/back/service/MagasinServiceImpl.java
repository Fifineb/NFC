package com.smart.stock.back.service;


import com.smart.stock.back.model.Magasin;
import com.smart.stock.back.repository.MagasinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MagasinServiceImpl implements MagasinService {

    @Autowired
    private MagasinRepository magasinRepository;

@Override
public Magasin saveMagasin(Magasin magasin) {
    if (magasin == null) {
        throw new IllegalArgumentException("Magasin cannot be null");
    }
    return magasinRepository.save(magasin);
}

    @Override
    public List<Magasin> getAllMagasins() {
        return magasinRepository.findAll();
    }
}


