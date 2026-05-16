package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.MatierePremiere;
import com.arjuncodes.isersystem.model.Stock;
import com.arjuncodes.isersystem.repository.MatierePremiereRepository;
import com.arjuncodes.isersystem.repository.StockRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final MatierePremiereRepository matierePremiereRepository;

    public StockServiceImpl(StockRepository stockRepository,
                            MatierePremiereRepository matierePremiereRepository) {
        this.stockRepository = stockRepository;
        this.matierePremiereRepository = matierePremiereRepository;
    }

    @Override
    public Stock saveStock(Stock stock) {
        return stockRepository.save(stock);
    }

    @Override
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    @Override
    public Stock getStockById(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé: " + id));
    }

    @Override
    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    @Override
    public void augmenterStock(Long id, double qte) {
        Stock stock = getStockById(id);
        stock.augmenterStock(qte);
        stockRepository.save(stock);
    }

    @Override
    public void diminuerStock(Long id, double qte) {
        Stock stock = getStockById(id);
        stock.diminuerStock(qte);
        stockRepository.save(stock);
    }

    @Override
    public double getQuantite(Long id) {
        Stock stock = getStockById(id);
        // Retourne directement la quantité actuelle
        return stock.getQuantiteActuelle() != null ? stock.getQuantiteActuelle() : 0;
    }

    @Override
    public boolean verifierSeuil(Long id) {
        Stock stock = getStockById(id);
        // Vérifie si quantité < seuil minimal de la matière
        if (stock.getMatierePremiere() != null) {
            return stock.getQuantiteActuelle() < stock.getMatierePremiere().getSeuilMinimal();
        }
        return false;
    }

    @Override
    public String genererFicheStock(Long id) {
        Stock stock = getStockById(id);
        return stock.genererFicheStock();
    }

    @Override
    public Stock addMatiereToStock(Long idStock, Long idMatiere) {
        Stock stock = getStockById(idStock);
        MatierePremiere matiere = matierePremiereRepository.findById(idMatiere)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée: " + idMatiere));
        stock.addMatiere(matiere);
        return stockRepository.save(stock);
    }

    @Override
    public Stock removeMatiereFromStock(Long idStock, Long idMatiere) {
        Stock stock = getStockById(idStock);
        MatierePremiere matiere = matierePremiereRepository.findById(idMatiere)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée: " + idMatiere));
        stock.removeMatiere(matiere);
        return stockRepository.save(stock);
    }

    @Override
    public List<MatierePremiere> getMatieresByStock(Long id) {
        Stock stock = getStockById(id);
        return stock.getMatieres();
    }
}