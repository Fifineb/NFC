package com.smart.stock.back.service;

import com.smart.stock.back.model.MatierePremiere;
import java.util.List;

public interface MatierePremiereService {
    MatierePremiere add(MatierePremiere m);
    List<MatierePremiere> getAll();
    MatierePremiere getById(Integer id);
    void delete(Integer id);
}