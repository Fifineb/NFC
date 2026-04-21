package com.smart.stock.back.service;

import com.smart.stock.back.model.Alerte;
import java.util.List;

public interface AlerteService {
    Alerte add(Alerte a);
    List<Alerte> getAll();
    List<Alerte> getActive();

}