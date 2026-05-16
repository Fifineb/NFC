package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Alerte;
import com.arjuncodes.isersystem.model.StatutAlerte;
import java.util.List;

public interface AlerteService {
    Alerte createAlerte(Alerte alerte);
    List<Alerte> getAllAlertes();
    Alerte getAlerteById(Long id);
    void deleteAlerte(Long id);
    Alerte activerAlerte(Long id);
    Alerte desactiverAlerte(Long id);
    List<Alerte> getAlertesByStatut(StatutAlerte statut);
    List<Alerte> getAlertesByMatiere(Long matiereId);
}