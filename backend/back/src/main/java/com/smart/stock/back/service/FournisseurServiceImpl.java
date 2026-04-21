package com.smart.stock.back.service;

import com.smart.stock.back.model.Fournisseur;
import com.smart.stock.back.repository.FournisseurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository repo;

    public FournisseurServiceImpl(FournisseurRepository repo) {
        this.repo = repo;
    }

    @Override
    public Fournisseur add(Fournisseur f) {
        return repo.save(f);
    }

    @Override
    public List<Fournisseur> getAll() {
        return repo.findAll();
    }

    @Override
    public Fournisseur getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Fournisseur not found"));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}