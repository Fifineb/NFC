package com.smart.stock.back.service;

import com.smart.stock.back.model.Commande;
import java.util.List;

public interface CommandeService {
    Commande add(Commande c);
    List<Commande> getAll();
    Commande getById(Integer id);
    void delete(Integer id);
}