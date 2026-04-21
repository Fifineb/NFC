package com.smart.stock.back.service;

import com.smart.stock.back.model.Utilisateur;
import com.smart.stock.back.repository.UtilisateurRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UtilisateurServiceImpl implements UtilisateurService {

    private final UtilisateurRepository repo;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UtilisateurServiceImpl(UtilisateurRepository repo) {
        this.repo = repo;
    }

    @Override
    public Utilisateur register(Utilisateur user) {
        user.setMot_de_passe(encoder.encode(user.getMot_de_passe()));
        return repo.save(user);
    }

    @Override
    public Utilisateur login(String email, String password) {
        Utilisateur user = repo.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!encoder.matches(password, user.getMot_de_passe())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    @Override
    public List<Utilisateur> getAll() {
        return repo.findAll();
    }

}