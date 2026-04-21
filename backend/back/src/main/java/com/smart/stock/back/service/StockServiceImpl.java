package com.smart.stock.back.service;

import com.smart.stock.back.model.Stock;
import com.smart.stock.back.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockServiceImpl implements StockService {

    private final StockRepository repo;

    public StockServiceImpl(StockRepository repo) {
        this.repo = repo;
    }

    @Override
    public Stock add(Stock s) {
        return repo.save(s);
    }

    @Override
    public List<Stock> getAll() {
        return repo.findAll();
    }

    @Override
    public Stock getById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock not found"));
    }

    @Override
    public void delete(Integer id) {
        repo.deleteById(id);
    }
}