package com.smart.stock.back.controller;

import com.smart.stock.back.model.Alerte;
import com.smart.stock.back.service.AlerteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerte")
@CrossOrigin("*")
public class AlerteController {

    private final AlerteService service;

    public AlerteController(AlerteService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Alerte add(@RequestBody Alerte a){
        return service.add(a);
    }

    @GetMapping("/getAll")
    public List<Alerte> getAll(){
        return service.getAll();
    }

    @GetMapping("/active")
    public List<Alerte> getActive(){
        return service.getActive();
    }

}