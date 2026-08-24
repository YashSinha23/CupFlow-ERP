package com.cupflow.CupFlow_ERP.cup;

import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CupService {

    private final CupRepository cupRepository;

    public CupService(CupRepository cupRepository) {
        this.cupRepository = cupRepository;
    }

    @Transactional
    public CupResponse create(CreateCupRequest request) {

        if (cupRepository.existsByCupNameIgnoreCase(request.getCupName())) {
            throw new AppException(
                    HttpStatus.CONFLICT,
                    "A Cup with this name already exists."
            );
        }

        Cup cup = new Cup();

        cup.setCupName(request.getCupName());
        cup.setCavity(request.getCavity());
        cup.setDiameter(request.getDiameter());
        cup.setHeight(request.getHeight());
        cup.setLipSize(request.getLipSize());

        Cup saved = cupRepository.save(cup);

        return CupResponse.from(saved);
    }

    @Transactional
    public List<CupResponse> getAll() {

        return cupRepository.findAll()
                .stream()
                .map(CupResponse::from)
                .toList();
    }

    @Transactional
    public CupResponse getById(UUID id) {

        Cup cup = cupRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cup",
                                id.toString()
                        )
                );

        return CupResponse.from(cup);
    }

    @Transactional
    public CupResponse update(UUID id, UpdateCupRequest request) {

        Cup cup = cupRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cup",
                                id.toString()
                        )
                );

        if (cupRepository.existsByCupNameIgnoreCaseAndIdNot(
                request.getCupName(),
                id
        )) {
            throw new AppException(
                    HttpStatus.CONFLICT,
                    "A Cup with this name already exists."
            );
        }

        cup.setCupName(request.getCupName());
        cup.setCavity(request.getCavity());
        cup.setDiameter(request.getDiameter());
        cup.setHeight(request.getHeight());
        cup.setLipSize(request.getLipSize());

        Cup saved = cupRepository.save(cup);

        return CupResponse.from(saved);
    }

    @Transactional
    public void delete(UUID id) {
        Cup cup = cupRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Cup",
                                id.toString()
                        )
                );
        try {
            cupRepository.delete(cup);
            cupRepository.flush();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new AppException(HttpStatus.CONFLICT, "Cup cannot be deleted because it is referenced by BOM or Orders."
            );
        }
    }
}