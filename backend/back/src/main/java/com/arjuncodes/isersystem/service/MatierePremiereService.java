package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.MatierePremiere;
import com.arjuncodes.isersystem.model.Stock;
import java.util.List;

public interface MatierePremiereService {
    MatierePremiere saveMatierePremiere(MatierePremiere matierePremiere);
    List<MatierePremiere> getAllMatieresPremieres();
    MatierePremiere getMatierePremiereById(Long id);
    void deleteMatierePremiere(Long id);
    List<Stock> getStocksByMatiere(Long id);
}