package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Alerte;
import com.arjuncodes.isersystem.model.StatutAlerte;
import com.arjuncodes.isersystem.repository.AlerteRepository;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
public class AlerteServiceImpl implements AlerteService {

    private final AlerteRepository alerteRepository;

    public AlerteServiceImpl(AlerteRepository alerteRepository) {
        this.alerteRepository = alerteRepository;
    }

    @Override
    public Alerte createAlerte(Alerte alerte) {
        if (alerte.getDateAlerte() == null) {
            alerte.setDateAlerte(new Date());
        }
        if (alerte.getStatut() == null) {
            alerte.setStatut(StatutAlerte.ACTIVE);
        }
        return alerteRepository.save(alerte);
    }

    @Override
    public List<Alerte> getAllAlertes() {
        return alerteRepository.findAll();
    }

    @Override
    public Alerte getAlerteById(Long id) {
        return alerteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alerte non trouvée avec l'id: " + id));
    }

    @Override
    public void deleteAlerte(Long id) {
        alerteRepository.deleteById(id);
    }

    @Override
    public Alerte activerAlerte(Long id) {
        Alerte alerte = getAlerteById(id);
        alerte.activer();
        return alerteRepository.save(alerte);
    }

    @Override
    public Alerte desactiverAlerte(Long id) {
        Alerte alerte = getAlerteById(id);
        alerte.desactiver();
        return alerteRepository.save(alerte);
    }

    @Override
    public List<Alerte> getAlertesByStatut(StatutAlerte statut) {
        return alerteRepository.findByStatut(statut);
    }

    @Override
    public List<Alerte> getAlertesByMatiere(Long matiereId) {
        return alerteRepository.findByMatierePremiere_Id(matiereId);
    }
}