package com.arjuncodes.isersystem.service;

import com.arjuncodes.isersystem.model.MatierePremiere;
import com.arjuncodes.isersystem.model.Stock;
import com.arjuncodes.isersystem.repository.MatierePremiereRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MatierePremiereServiceImpl implements MatierePremiereService {

    private final MatierePremiereRepository matierePremiereRepository;

    public MatierePremiereServiceImpl(MatierePremiereRepository matierePremiereRepository) {
        this.matierePremiereRepository = matierePremiereRepository;
    }

    @Override
    public MatierePremiere saveMatierePremiere(MatierePremiere matierePremiere) {
        return matierePremiereRepository.save(matierePremiere);
    }

    @Override
    public List<MatierePremiere> getAllMatieresPremieres() {
        return matierePremiereRepository.findAll();
    }

    @Override
    public MatierePremiere getMatierePremiereById(Long id) {  // ← Long
        return matierePremiereRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matière première non trouvée: " + id));
    }

    @Override
    public void deleteMatierePremiere(Long id) {  // ← Long
        matierePremiereRepository.deleteById(id);
    }

    @Override
    public List<Stock> getStocksByMatiere(Long id) {  // ← Long
        MatierePremiere matiere = getMatierePremiereById(id);
        return matiere.getStocks();
    }
}