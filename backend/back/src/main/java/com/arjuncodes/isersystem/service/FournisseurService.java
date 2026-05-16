package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Fournisseur;
import java.util.List;

public interface FournisseurService {
    Fournisseur saveFournisseur(Fournisseur fournisseur);
    List<Fournisseur> getAllFournisseurs();
    Fournisseur getFournisseurById(Long id);
    Fournisseur getFournisseurByEmail(String email);
    Fournisseur updateFournisseur(Long id, Fournisseur details);
    void deleteFournisseur(Long id);
    List<Fournisseur> searchFournisseurByNom(String nom);
    List<Fournisseur> getFournisseursActifs();
    List<Fournisseur> getFournisseursInactifs();
    Fournisseur activerFournisseur(Long id);
    Fournisseur desactiverFournisseur(Long id);
}