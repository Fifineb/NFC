package com.smart.stock.back.service;

import com.smart.stock.back.model.Utilisateur;
import java.util.List;

public interface UtilisateurService {
    Utilisateur register(Utilisateur user);
    Utilisateur login(String email, String password);
    List<Utilisateur> getAll();


}