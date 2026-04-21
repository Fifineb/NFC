package com.smart.stock.back.service;

import com.smart.stock.back.model.MatierePremiere;
import com.smart.stock.back.repository.MatierePremiereRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatierePremiereServiceImpl implements MatierePremiereService {

    private final MatierePremiereRepository repo;

    public MatierePremiereServiceImpl(MatierePremiereRepository repo) {
        this.repo = repo;
    }

    @Override
    public MatierePremiere add(MatierePremiere m) {
        return repo.save(m);
    }

    @Override
    public List<MatierePremiere> getAll() {
        return repo.findAll();
    }

    @Override
    public MatierePremiere getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Matiere not found"));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}