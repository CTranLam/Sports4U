package com.sports4u.sports4u_backend.service;

import com.sports4u.sports4u_backend.dto.addressdto.ProvinceListResponse;
import com.sports4u.sports4u_backend.dto.addressdto.WardListResponse;

public interface IAddressService {
    ProvinceListResponse getAllProvinces();
    WardListResponse getWardsByProvince(String provinceCode) throws IllegalArgumentException;
}
