package com.smart.stock.back.service;

import com.smart.stock.back.model.BonEntree;
import com.smart.stock.back.repository.BonEntreeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BonEntreeService {
    
    
    @Autowired
    private BonEntreeRepository bonEntreeRepository;
    
    public List<BonEntree> getAllBonEntree() {
        return bonEntreeRepository.findAll();
    }
    
    public BonEntree getBonEntreeById(Integer id) {
        return bonEntreeRepository.findById(id).orElse(null);
    }
    
    public BonEntree saveBonEntree(BonEntree bonEntree) {
        bonEntree.setDateCreation(LocalDateTime.now());
        return bonEntreeRepository.save(bonEntree);
    }
    
    public List<BonEntree> getRecentBonEntree() {
        return bonEntreeRepository.findRecentBonEntree(LocalDate.now().minusDays(30));
    }
    
    public void deleteBonEntree(Integer id_be) {
        bonEntreeRepository.deleteById(id_be);
    }
}