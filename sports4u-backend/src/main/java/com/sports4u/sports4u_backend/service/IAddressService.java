package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.ProvinceResponseDTO;
import com.sports4u.sports4u_backend.dto.WardResponseDTO;

import java.util.List;

public interface IAddressService {
    List<ProvinceResponseDTO> getAllProvinces();
    List<WardResponseDTO> getWardsByProvince(String provinceCode);
}
