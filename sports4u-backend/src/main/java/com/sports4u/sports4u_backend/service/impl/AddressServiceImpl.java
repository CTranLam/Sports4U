package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.dto.addressdto.ProvinceListResponse;
import com.sports4u.sports4u_backend.dto.addressdto.ProvinceResponseDTO;
import com.sports4u.sports4u_backend.dto.addressdto.WardListResponse;
import com.sports4u.sports4u_backend.dto.addressdto.WardResponseDTO;
import com.sports4u.sports4u_backend.repository.ProvinceRepository;
import com.sports4u.sports4u_backend.repository.WardRepository;
import com.sports4u.sports4u_backend.service.IAddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements IAddressService {
    private final ProvinceRepository provinceRepository;

    private final WardRepository wardRepository;

    @Override
    @Cacheable(value = "provinces", key = "'all'")
    public ProvinceListResponse getAllProvinces() {
        System.out.println("Fetching all provinces from database");
        List<ProvinceResponseDTO> provinces = provinceRepository.findAll()
                .stream()
                .map(p -> new ProvinceResponseDTO(
                        p.getCode(),
                        p.getName()
                ))
                .toList();
        return ProvinceListResponse.builder()
                .provinces(provinces)
                .build();
    }

    @Override
    @Cacheable(value = "wards", key = "#provinceCode")
    public WardListResponse getWardsByProvince(String provinceCode) {
        System.out.println("Fetching wards from database for province: " + provinceCode);
        if (provinceCode == null || provinceCode.isBlank()) {
            throw new IllegalArgumentException("Mã tỉnh/thành phố không được để trống");
        }
        List<WardResponseDTO> wards = wardRepository
                .findByProvince_CodeOrderByNameAsc(provinceCode)
                .stream()
                .map(w -> new WardResponseDTO(
                        w.getCode(),
                        w.getName()
                ))
                .toList();
        return WardListResponse.builder()
                .wards(wards)
                .build();
    }
}
