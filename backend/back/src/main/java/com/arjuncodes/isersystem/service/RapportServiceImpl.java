package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Rapport;
import com.arjuncodes.isersystem.repository.RapportRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RapportServiceImpl implements RapportService {

    private final RapportRepository rapportRepository;

    public RapportServiceImpl(RapportRepository rapportRepository) {
        this.rapportRepository = rapportRepository;
    }

    @Override
    public List<Rapport> getAllRapports() {
        return rapportRepository.findAll();
    }

    @Override
    public Rapport getRapportById(Long id) {
        return rapportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rapport non trouvé: " + id));
    }

    @Override
    public Rapport createRapport(Rapport rapport) {
        rapport.calculerTotaux();
        return rapportRepository.save(rapport);
    }

    @Override
    public void deleteRapport(Long id) {
        rapportRepository.deleteById(id);
    }

    @Override
    public List<Rapport> getByType(String type) {
        return rapportRepository.findByTypeRapport(type);
    }
}