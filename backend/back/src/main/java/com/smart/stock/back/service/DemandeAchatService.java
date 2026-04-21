package com.smart.stock.back.service;

import com.smart.stock.back.model.DemandeAchat;
import com.smart.stock.back.repository.DemandeAchatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DemandeAchatService {
    
    @Autowired
    private DemandeAchatRepository demandeAchatRepository;
    
    public List<DemandeAchat> getAllDemandes() {
        return demandeAchatRepository.findAll();
    }
    
    public List<DemandeAchat> getDemandesUrgentes() {
        return demandeAchatRepository.findByUrgenceTrue();
    }
    
    public List<DemandeAchat> getDemandesByStatut(String statut) {
        return demandeAchatRepository.findByStatut(statut);
    }
    
    public DemandeAchat saveDemandeAchat(DemandeAchat demande) {
        demande.setDateCreation(LocalDateTime.now());
        return demandeAchatRepository.save(demande);
    }
}