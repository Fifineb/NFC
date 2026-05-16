package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.Rapport;
import java.util.List;

public interface RapportService {
    List<Rapport> getAllRapports();
    Rapport getRapportById(Long id);
    Rapport createRapport(Rapport rapport);
    void deleteRapport(Long id);
    List<Rapport> getByType(String type);
}