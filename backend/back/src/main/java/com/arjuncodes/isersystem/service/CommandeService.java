package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Commande;
import java.util.List;

public interface CommandeService {
    List<Commande> getAllCommandes();
    Commande getCommandeById(Long id);
    Commande saveCommande(Commande commande);
    void deleteCommande(Long id);
    void validerCommande(Long id);
    void annulerCommande(Long id);
    void marquerLivree(Long id);
}