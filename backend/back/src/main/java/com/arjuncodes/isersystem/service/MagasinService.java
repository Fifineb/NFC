package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Magasin;
import java.util.List;

public interface MagasinService {
    Magasin saveMagasin(Magasin magasin);
    List<Magasin> getAllMagasins();


    Magasin getMagasinById(int id_magasin);


    void deleteMagasin(int id_magasin);
}