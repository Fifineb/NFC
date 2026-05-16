package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Magasin;
import com.arjuncodes.isersystem.repository.MagasinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MagasinServiceImpl implements MagasinService {

    @Autowired
    private MagasinRepository magasinRepository;

    @Override
    public Magasin saveMagasin(Magasin magasin) {
        return magasinRepository.save(magasin);
    }

    @Override
    public List<Magasin> getAllMagasins() {
        return magasinRepository.findAll();
    }

    @Override
    public Magasin getMagasinById(int id_magasin) {
        return magasinRepository.findById(id_magasin)
                .orElseThrow(() -> new RuntimeException("Magasin non trouvé avec l'id : " + id_magasin));
    }

    @Override
    public void deleteMagasin(int id_magasin) {
        magasinRepository.deleteById(id_magasin);
    }
}