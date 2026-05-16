package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Fournisseur;
import com.arjuncodes.isersystem.repository.FournisseurRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;

@Service
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    public FournisseurServiceImpl(FournisseurRepository fournisseurRepository) {
        this.fournisseurRepository = fournisseurRepository;
    }

    @Override
    public Fournisseur saveFournisseur(Fournisseur fournisseur) {
        fournisseur.setDateCreation(LocalDateTime.now());
        fournisseur.setActif(true); 
        return fournisseurRepository.save(fournisseur);
    }

    @Override
    public List<Fournisseur> getAllFournisseurs() {
        return fournisseurRepository.findAll(
            Sort.by(Sort.Direction.ASC, "id")
    );
    }

    @Override
    public Fournisseur getFournisseurById(Long id) {
        return fournisseurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé: " + id));
    }

    @Override
    public Fournisseur getFournisseurByEmail(String email) {
        return fournisseurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé: " + email));
    }

    @Override
    public Fournisseur updateFournisseur(Long id, Fournisseur details) {
        Fournisseur fournisseur = getFournisseurById(id);
        fournisseur.setRaisonSociale(details.getRaisonSociale()); // setRaisonSociale au lieu de setNom
        fournisseur.setAdresse(details.getAdresse());
        fournisseur.setEmail(details.getEmail());
        fournisseur.setTelephone(details.getTelephone());
        // setSiteWeb supprimé car n'existe pas dans le modèle
        return fournisseurRepository.save(fournisseur);
    }

    @Override
    public void deleteFournisseur(Long id) {
        fournisseurRepository.deleteById(id);
    }

    @Override
    public List<Fournisseur> searchFournisseurByNom(String nom) {
        return fournisseurRepository.findByRaisonSocialeContainingIgnoreCase(nom);
    }

    @Override
    public List<Fournisseur> getFournisseursActifs() {
        return fournisseurRepository.findByActifTrue();
    }

    @Override
    public List<Fournisseur> getFournisseursInactifs() {
        return fournisseurRepository.findByActifFalse();
    }

    @Override
    public Fournisseur activerFournisseur(Long id) {
        Fournisseur fournisseur = getFournisseurById(id);
        fournisseur.setActif(true);
        return fournisseurRepository.save(fournisseur);
    }

    @Override
    public Fournisseur desactiverFournisseur(Long id) {
        Fournisseur fournisseur = getFournisseurById(id);
        fournisseur.setActif(false);
        return fournisseurRepository.save(fournisseur);
    }
}