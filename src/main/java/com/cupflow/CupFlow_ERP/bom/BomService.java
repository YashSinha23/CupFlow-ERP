package com.cupflow.CupFlow_ERP.bom;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.material.Material;
import com.cupflow.CupFlow_ERP.material.MaterialRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BomService {

    private final BomRepository bomRepository;
    private final MaterialRepository materialRepository;

    public BomService(BomRepository bomRepository, MaterialRepository materialRepository) {
        this.bomRepository = bomRepository;
        this.materialRepository = materialRepository;
    }

    @Transactional
    public BomEntryResponse create(CreateBomEntryRequest request) {
        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException("Material", request.getMaterialId().toString()));
        if(bomRepository.existsByCupTypeIgnoreCaseAndMaterial_Id(request.getCupType(), request.getMaterialId())) {
            throw new AppException(HttpStatus.CONFLICT,"A BOM entry already exists for cup type " + request.getCupType() + " and this Material.");
        }

        BomEntry entry = new BomEntry();
        entry.setCupType(request.getCupType());
        entry.setMaterial(material);
        entry.setQtyPerUnit(request.getQtyPerUnit());

        BomEntry saved =  bomRepository.save(entry);
        return BomEntryResponse.from(saved);
    }

    @Transactional
    public BomEntryResponse update(UUID id, UpdateBomEntryRequest request) {
        BomEntry entry = bomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BomEntry", id.toString()));

        entry.setQtyPerUnit(request.getQtyPerUnit());

        BomEntry saved =  bomRepository.save(entry);
        return BomEntryResponse.from(saved);
    }

    @Transactional
    public List<BomEntryResponse> getEntriesByCupType(String cupType) {
        List<BomEntry> entries = bomRepository.findByCupTypeIgnoreCase(cupType);
        return entries
                .stream()
                .map(BomEntryResponse::from)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {
        if(!bomRepository.existsById(id)) {
            throw new ResourceNotFoundException("BomEntry", id.toString());
        }
        bomRepository.deleteById(id);
    }
}
