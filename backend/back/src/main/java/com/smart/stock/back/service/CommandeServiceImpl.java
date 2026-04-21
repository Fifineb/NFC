package com.smart.stock.back.service;

import com.smart.stock.back.model.Commande;
import com.smart.stock.back.repository.CommandeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommandeServiceImpl implements CommandeService {

    private final CommandeRepository repo;

    public CommandeServiceImpl(CommandeRepository repo) {
        this.repo = repo;
    }

    @Override
    public Commande add(Commande c) {
        return repo.save(c);
    }

    @Override
    public List<Commande> getAll() {
        return repo.findAll();
    }

    @Override
    public Commande getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found"));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}