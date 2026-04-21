package com.smart.stock.back.controller;

import com.smart.stock.back.model.Stock;
import com.smart.stock.back.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stock")
@CrossOrigin("*")
public class StockController {

    private final StockService service;

    public StockController(StockService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Stock add(@RequestBody Stock s){
        return service.add(s);
    }

    @GetMapping("/getAll")
    public List<Stock> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Stock getById(@PathVariable Integer id){
        return service.getById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}