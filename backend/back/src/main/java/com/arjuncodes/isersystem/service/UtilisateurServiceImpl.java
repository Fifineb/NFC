package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Utilisateur;
import com.arjuncodes.isersystem.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
@Service
public class UtilisateurServiceImpl implements UtilisateurService{

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
        if (utilisateur.isActif() == false) {
            utilisateur.setActif(true);
        }
        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }

    @Override
    public Utilisateur getUtilisateurById(int id_utilisateur) {
        Optional<Utilisateur> opt = utilisateurRepository.findById(id_utilisateur);
        return opt.orElse(null);
    }

    @Override
    public Utilisateur getUtilisateurByEmail(String email) {
        Optional<Utilisateur> opt = utilisateurRepository.findByEmail(email);
        return opt.orElse(null);
    }

    @Override
    public void deleteUtilisateur(int id_utilisateur) {
        if (!utilisateurRepository.existsById(id_utilisateur)) {
            throw new RuntimeException("Utilisateur non trouvé avec l'id : " + id_utilisateur);
        }
        utilisateurRepository.deleteById(id_utilisateur);
    }

    @Override
    public Utilisateur seConnecter(String email, String motDePasse) {

        Utilisateur utilisateur = getUtilisateurByEmail(email);

        if (utilisateur == null) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        if (!utilisateur.isActif()) {
            throw new RuntimeException("Compte désactivé. Contactez l'administrateur.");
        }

        if (!passwordEncoder.matches(motDePasse, utilisateur.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect");
        }

        return utilisateur;
    }

    @Override
    public Utilisateur modifierProfil(int id_utilisateur, Utilisateur details) {

        Utilisateur utilisateur = getUtilisateurById(id_utilisateur);

        if (utilisateur == null) {
            throw new RuntimeException("Utilisateur non trouvé avec l'id : " + id_utilisateur);
        }

        if (details.getNom() != null)     utilisateur.setNom(details.getNom());
        if (details.getPrenom() != null)  utilisateur.setPrenom(details.getPrenom());
        if (details.getEmail() != null)   utilisateur.setEmail(details.getEmail());
        if (details.getRole() != null)    utilisateur.setRole(details.getRole());

        if (details.getMotDePasse() != null && !details.getMotDePasse().isEmpty()) {
            utilisateur.setMotDePasse(details.getMotDePasse());
        }

        return utilisateurRepository.save(utilisateur);
    }

    @Override
    public Utilisateur changerMotDePasse(int id_utilisateur,
                                         String ancienMotDePasse,
                                         String nouveauMotDePasse) {

        Utilisateur utilisateur = getUtilisateurById(id_utilisateur);

        if (utilisateur == null) {
            throw new RuntimeException("Utilisateur non trouvé avec l'id : " + id_utilisateur);
        }

        if (!passwordEncoder.matches(ancienMotDePasse, utilisateur.getMotDePasse())) {
            throw new RuntimeException("Ancien mot de passe incorrect");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(nouveauMotDePasse));
        return utilisateurRepository.save(utilisateur);
    }
    


   @Override
public UserDetails loadUserByUsername(String email)
        throws UsernameNotFoundException {

    Utilisateur utilisateur = utilisateurRepository
            .findByEmail(email)
            .orElseThrow(() ->
                    new UsernameNotFoundException(
                            "Utilisateur introuvable"
                    ));

    return new org.springframework.security.core.userdetails.User(
            utilisateur.getEmail(),
            utilisateur.getMotDePasse(),
            Collections.singletonList(
                    new SimpleGrantedAuthority(
                            "ROLE_" + utilisateur.getRole()
                    )
            )
    );
}


}