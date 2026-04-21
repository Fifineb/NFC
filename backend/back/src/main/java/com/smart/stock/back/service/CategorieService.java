package com.smart.stock.back.service;

import com.smart.stock.back.model.Categorie;
import java.util.List;

public interface CategorieService {
    Categorie add(Categorie c);
    List<Categorie> getAll();

}