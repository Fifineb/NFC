package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.*;
import com.arjuncodes.isersystem.repository.MouvementRepository;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MouvementServiceImpl implements MouvementService {

    private final MouvementRepository mouvementRepository;

    public MouvementServiceImpl(MouvementRepository mouvementRepository) {
        this.mouvementRepository = mouvementRepository;
    }

    @Override
    public List<Mouvement> getAllMouvements() {
        return mouvementRepository.findAll();
    }

    @Override
    public Mouvement saveMouvement(Mouvement mouvement) {
        if (mouvement.getDate() == null) {
            mouvement.setDate(new Date());
        }
        return mouvementRepository.save(mouvement);
    }

    @Override
    public Mouvement getMouvementById(Long id) {
        return mouvementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement non trouvé: " + id));
    }

    @Override
    public void deleteMouvement(Long id) {
        mouvementRepository.deleteById(id);
    }

    @Override
    public List<Mouvement> getMouvementsByStock(Long stockId) {
        return mouvementRepository.findAll()
                .stream()
                .filter(m -> m.getStock() != null &&
                        m.getStock().getIdSt() != null &&  // ← getIdSt() au lieu de getId()
                        m.getStock().getIdSt().equals(stockId))
                .collect(Collectors.toList());
    }

    @Override
    public BonDeEntree createBonEntree(BonDeEntree bon) {
        if (bon.getDate() == null) bon.setDate(new Date());
        return mouvementRepository.save(bon);  // ← sans cast inutile
    }

    @Override
    public BonDeSortie createBonSortie(BonDeSortie bon) {
        if (bon.getDate() == null) bon.setDate(new Date());
        return mouvementRepository.save(bon);
    }

    @Override
    public BonDeConsommation createBonConsommation(BonDeConsommation bon) {
        if (bon.getDate() == null) bon.setDate(new Date());
        return mouvementRepository.save(bon);
    }

    @Override
    public CommandeAchat createCommandeAchat(CommandeAchat commande) {
        if (commande.getDate() == null) commande.setDate(new Date());
        return mouvementRepository.save(commande);
    }
}