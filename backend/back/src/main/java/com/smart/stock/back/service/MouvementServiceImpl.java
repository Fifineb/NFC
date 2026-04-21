package com.smart.stock.back.service;

import com.smart.stock.back.model.Mouvement;
import com.smart.stock.back.repository.MouvementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MouvementServiceImpl implements MouvementService {

    private final MouvementRepository repo;

    public MouvementServiceImpl(MouvementRepository repo) {
        this.repo = repo;
    }

    @Override
    public Mouvement add(Mouvement m) {
        return repo.save(m);
    }

    @Override
    public List<Mouvement> getAll() {
        return repo.findAll();
    }

    @Override
    public Mouvement getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement not found"));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}