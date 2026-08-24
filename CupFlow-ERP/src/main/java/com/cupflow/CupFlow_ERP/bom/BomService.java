package com.cupflow.CupFlow_ERP.bom;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import com.cupflow.CupFlow_ERP.cup.Cup;
import com.cupflow.CupFlow_ERP.cup.CupRepository;
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
    private final CupRepository cupRepository;

    public BomService(
            BomRepository bomRepository,
            MaterialRepository materialRepository,
            CupRepository cupRepository
    ) {
        this.bomRepository = bomRepository;
        this.materialRepository = materialRepository;
        this.cupRepository = cupRepository;
    }

    @Transactional
    public BomEntryResponse create(CreateBomEntryRequest request) {
        Cup cup = cupRepository.findById(request.getCupId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cup",
                                request.getCupId().toString()
                        )
                );

        Material material = materialRepository.findById(request.getMaterialId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Material",
                                request.getMaterialId().toString()
                        )
                );

        if (bomRepository.existsByCup_IdAndMaterial_Id(
                request.getCupId(),
                request.getMaterialId()
        )) {
            throw new AppException(
                    HttpStatus.CONFLICT,
                    "A BOM entry already exists for this Cup and Material."
            );
        }

        BomEntry entry = new BomEntry();

        entry.setCup(cup);
        entry.setMaterial(material);
        entry.setQtyPerUnit(request.getQtyPerUnit());

        BomEntry saved = bomRepository.save(entry);

        return BomEntryResponse.from(saved);
    }

    @Transactional
    public BomEntryResponse update(
            UUID id,
            UpdateBomEntryRequest request
    ) {
        BomEntry entry = bomRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "BomEntry",
                                id.toString()
                        )
                );

        entry.setQtyPerUnit(request.getQtyPerUnit());

        BomEntry saved = bomRepository.save(entry);

        return BomEntryResponse.from(saved);
    }

    @Transactional
    public List<BomEntryResponse> getEntriesByCupId(UUID cupId) {

        List<BomEntry> entries =
                bomRepository.findByCupIdWithMaterial(cupId);

        return entries
                .stream()
                .map(BomEntryResponse::from)
                .toList();
    }

    @Transactional
    public void delete(UUID id) {

        if (!bomRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "BomEntry",
                    id.toString()
            );
        }

        bomRepository.deleteById(id);
    }
}