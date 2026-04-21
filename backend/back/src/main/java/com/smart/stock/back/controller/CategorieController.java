package com.smart.stock.back.controller;

import com.smart.stock.back.model.Categorie;
import com.smart.stock.back.service.CategorieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorie")
@CrossOrigin("*")
public class CategorieController {

    private final CategorieService service;

    public CategorieController(CategorieService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Categorie add(@RequestBody Categorie c){
        return service.add(c);
    }

    @GetMapping("/getAll")
    public List<Categorie> getAll(){
        return service.getAll();
    }

}