package com.smart.stock.back.service;

import com.smart.stock.back.model.Alerte;
import com.smart.stock.back.model.StatutAlerte;
import com.smart.stock.back.repository.AlerteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlerteServiceImpl implements AlerteService {

    private final AlerteRepository repo;

    public AlerteServiceImpl(AlerteRepository repo) {
        this.repo = repo;
    }

    @Override
    public Alerte add(Alerte a) {
        return repo.save(a);
    }

    @Override
    public List<Alerte> getAll() {
        return repo.findAll();
    }

    @Override
    public List<Alerte> getActive() {
        return repo.findAll()
                .stream()
                .filter(a -> a.getStatut() == StatutAlerte.ACTIVE)
                .toList();
    }

}