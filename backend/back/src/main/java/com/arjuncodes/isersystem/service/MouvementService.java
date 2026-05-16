package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.*;
import java.util.List;

public interface MouvementService {
    List<Mouvement> getAllMouvements();
    Mouvement saveMouvement(Mouvement mouvement);
    Mouvement getMouvementById(Long id);
    void deleteMouvement(Long id);
    List<Mouvement> getMouvementsByStock(Long stockId);
    BonDeEntree createBonEntree(BonDeEntree bon);
    BonDeSortie createBonSortie(BonDeSortie bon);
    BonDeConsommation createBonConsommation(BonDeConsommation bon);
    CommandeAchat createCommandeAchat(CommandeAchat commande);
}