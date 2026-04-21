package com.smart.stock.back.service;

import com.smart.stock.back.model.Stock;
import java.util.List;

public interface StockService {
    Stock add(Stock s);
    List<Stock> getAll();
    Stock getById(Integer id);
    void delete(Integer id);
}