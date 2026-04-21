package com.smart.stock.back.service;

import com.smart.stock.back.model.Categorie;
import com.smart.stock.back.repository.CategorieRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategorieServiceImpl implements CategorieService {

    private final CategorieRepository repo;

    public CategorieServiceImpl(CategorieRepository repo) {
        this.repo = repo;
    }

    @Override
    public Categorie add(Categorie c) {
        return repo.save(c);
    }

    @Override
    public List<Categorie> getAll() {
        return repo.findAll();
    }

}