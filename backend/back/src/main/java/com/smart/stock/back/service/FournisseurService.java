package com.smart.stock.back.service;

import com.smart.stock.back.model.Fournisseur;
import java.util.List;

public interface FournisseurService {
    Fournisseur add(Fournisseur f);
    List<Fournisseur> getAll();
    Fournisseur getById(Integer id);
    void delete(Integer id);
}
