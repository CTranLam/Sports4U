package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.addressdto.ProvinceResponseDTO;
import com.sports4u.sports4u_backend.dto.addressdto.WardResponseDTO;
import com.sports4u.sports4u_backend.repository.ProvinceRepository;
import com.sports4u.sports4u_backend.repository.WardRepository;
import com.sports4u.sports4u_backend.service.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements IAddressService {
    private final ProvinceRepository provinceRepository;

    private final WardRepository wardRepository;

    public List<ProvinceResponseDTO> getAllProvinces() {
        return provinceRepository.findAll()
                .stream()
                .map(p -> new ProvinceResponseDTO(
                        p.getCode(),
                        p.getName()
                ))
                .toList();
    }

    public List<WardResponseDTO> getWardsByProvince(String provinceCode) {
        return wardRepository
                .findByProvince_CodeOrderByNameAsc(provinceCode)
                .stream()
                .map(w -> new WardResponseDTO(
                        w.getCode(),
                        w.getName()
                ))
                .toList();
    }
}
