package com.arjuncodes.isersystem.controller;

import com.arjuncodes.isersystem.model.MatierePremiere;
import com.arjuncodes.isersystem.model.Stock;
import com.arjuncodes.isersystem.service.StockService;
import com.arjuncodes.isersystem.repository.MatierePremiereRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;
    private final MatierePremiereRepository matierePremiereRepository;

    public StockController(StockService stockService,
                           MatierePremiereRepository matierePremiereRepository) {
        this.stockService = stockService;
        this.matierePremiereRepository = matierePremiereRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<Stock> addStock(@RequestBody Stock stock) {
        return new ResponseEntity<>(stockService.saveStock(stock), HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id,
                                             @RequestBody Stock stockDetails) {
        Stock existing = stockService.getStockById(id);
        existing.setQuantiteActuelle(stockDetails.getQuantiteActuelle());
        existing.setGisement(stockDetails.getGisement());
        existing.setDateMiseAJour(stockDetails.getDateMiseAJour());
        return ResponseEntity.ok(stockService.saveStock(existing));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.ok("Stock supprimé avec succès !");
    }

    @PostMapping("/{id}/augmenter")
    public ResponseEntity<String> augmenterStock(@PathVariable Long id,
                                                 @RequestParam double qte) {
        stockService.augmenterStock(id, qte);
        return ResponseEntity.ok("Stock augmenté de " + qte + " unités");
    }

    @PostMapping("/{id}/diminuer")
    public ResponseEntity<String> diminuerStock(@PathVariable Long id,
                                                @RequestParam double qte) {
        stockService.diminuerStock(id, qte);
        return ResponseEntity.ok("Stock diminué de " + qte + " unités");
    }

    @GetMapping("/{id}/quantite")
    public ResponseEntity<Double> getQuantite(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getQuantite(id));
    }

    @GetMapping("/{id}/verifier-seuil")
    public ResponseEntity<Boolean> verifierSeuil(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.verifierSeuil(id));
    }

    @GetMapping("/{id}/fiche")
    public ResponseEntity<String> genererFiche(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.genererFicheStock(id));
    }

    @PostMapping("/{idStock}/matieres/{idMatiere}")
    public ResponseEntity<Stock> addMatiereToStock(@PathVariable Long idStock,
                                                   @PathVariable Long idMatiere) {
        Stock stock = stockService.getStockById(idStock);
        MatierePremiere matiere = matierePremiereRepository.findById(idMatiere)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée: " + idMatiere));
        stock.addMatiere(matiere);
        return ResponseEntity.ok(stockService.saveStock(stock));
    }

    @DeleteMapping("/{idStock}/matieres/{idMatiere}")
    public ResponseEntity<Stock> removeMatiereFromStock(@PathVariable Long idStock,
                                                        @PathVariable Long idMatiere) {
        Stock stock = stockService.getStockById(idStock);
        MatierePremiere matiere = matierePremiereRepository.findById(idMatiere)
                .orElseThrow(() -> new RuntimeException("Matière non trouvée: " + idMatiere));
        stock.removeMatiere(matiere);
        return ResponseEntity.ok(stockService.saveStock(stock));
    }

    @GetMapping("/{id}/matieres")
    public ResponseEntity<List<MatierePremiere>> getMatieresByStock(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getMatieresByStock(id));
    }
}