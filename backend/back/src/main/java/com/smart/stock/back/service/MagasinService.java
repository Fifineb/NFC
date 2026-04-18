package com.smart.stock.back.service;


import java.util.List;

import com.smart.stock.back.model.Magasin;

public interface MagasinService {
    Magasin saveMagasin(Magasin magasin);
    List<Magasin> getAllMagasins();
}

