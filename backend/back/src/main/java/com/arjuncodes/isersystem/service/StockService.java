package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.MatierePremiere;
import com.arjuncodes.isersystem.model.Stock;
import java.util.List;

public interface StockService {
    Stock saveStock(Stock stock);
    List<Stock> getAllStocks();
    Stock getStockById(Long id);
    void deleteStock(Long id);
    void augmenterStock(Long id, double qte);
    void diminuerStock(Long id, double qte);
    double getQuantite(Long id);
    boolean verifierSeuil(Long id);
    String genererFicheStock(Long id);
    Stock addMatiereToStock(Long idStock, Long idMatiere);
    Stock removeMatiereFromStock(Long idStock, Long idMatiere);
    List<MatierePremiere> getMatieresByStock(Long id);
}