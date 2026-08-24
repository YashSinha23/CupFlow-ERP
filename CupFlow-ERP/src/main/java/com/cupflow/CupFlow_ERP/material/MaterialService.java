package com.cupflow.CupFlow_ERP.material;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MaterialService {

    private final MaterialRepository materialRepository;
    public MaterialService(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @Transactional
    public MaterialResponse create(CreateMaterialRequest request) {
        if(materialRepository.existsByMaterialTypeIgnoreCase(request.getMaterialType())) {
            throw new AppException(HttpStatus.CONFLICT, "Material : " + request.getMaterialType() + " already exists");
        }

        Material material = new Material();
        material.setMaterialType(request.getMaterialType());
        material.setUnit(request.getUnit());
        material.setMinThreshold(request.getMinThreshold());

        Material saved = materialRepository.save(material);
        return MaterialResponse.from(saved);
    }

    @Transactional
    public MaterialResponse getById(UUID id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Material : " + id + " not found"));
        return MaterialResponse.from(material);
    }

    @Transactional
    public List<MaterialResponse> getAll() {
        return materialRepository.findAll()
                .stream()
                .map(MaterialResponse::from)
                .toList();
    }

    @Transactional
    public MaterialResponse update(UUID id, UpdateMaterialRequest request) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Material : " + id + " not found"));

        material.setUnit(request.getUnit());
        material.setMinThreshold(request.getMinThreshold());

        Material saved = materialRepository.save(material);
        return MaterialResponse.from(saved);
    }
}
