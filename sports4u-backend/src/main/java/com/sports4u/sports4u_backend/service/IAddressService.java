package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.addressdto.ProvinceResponseDTO;
import com.sports4u.sports4u_backend.dto.addressdto.WardResponseDTO;

import java.util.List;

public interface IAddressService {
    List<ProvinceResponseDTO> getAllProvinces();
    List<WardResponseDTO> getWardsByProvince(String provinceCode);
}
