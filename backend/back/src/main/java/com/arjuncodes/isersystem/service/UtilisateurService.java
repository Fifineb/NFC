package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Utilisateur;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

public interface UtilisateurService {

    Utilisateur saveUtilisateur(Utilisateur utilisateur);

    List<Utilisateur> getAllUtilisateurs();

    Utilisateur getUtilisateurById(int id_utilisateur);

    Utilisateur getUtilisateurByEmail(String email);

    void deleteUtilisateur(int id_utilisateur);

    Utilisateur seConnecter(String email, String motDePasse);

    Utilisateur modifierProfil(int id_utilisateur, Utilisateur details);

    Utilisateur changerMotDePasse(int id_utilisateur,
                                  String ancienMotDePasse,
                                  String nouveauMotDePasse);

    UserDetails loadUserByUsername(String email);
}