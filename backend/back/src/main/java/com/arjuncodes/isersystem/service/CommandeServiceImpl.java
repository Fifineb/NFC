package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Commande;
import com.arjuncodes.isersystem.repository.CommandeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository commandeRepository;

    public CommandeServiceImpl(CommandeRepository commandeRepository) {
        this.commandeRepository = commandeRepository;
    }

    @Override
    public List<Commande> getAllCommandes() {
        return commandeRepository.findAll();
    }

    @Override
    public Commande getCommandeById(Long id) {
        return commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande non trouvée: " + id));
    }

    @Override
    public Commande saveCommande(Commande commande) {
        return commandeRepository.save(commande);
    }

    @Override
    public void deleteCommande(Long id) {
        commandeRepository.deleteById(id);
    }

    @Override
    public void validerCommande(Long id) {
        Commande commande = getCommandeById(id);
        commande.valider();
        commandeRepository.save(commande);
    }

    @Override
    public void annulerCommande(Long id) {
        Commande commande = getCommandeById(id);
        commande.annuler();
        commandeRepository.save(commande);
    }

    @Override
    public void marquerLivree(Long id) {
        Commande commande = getCommandeById(id);
        commande.marquerLivree();
        commandeRepository.save(commande);
    }
}