package com.smart.stock.back.service;

import com.smart.stock.back.model.Mouvement;
import java.util.List;

public interface MouvementService {
    Mouvement add(Mouvement m);
    List<Mouvement> getAll();
    Mouvement getById(Integer id);
    void delete(Integer id);
}