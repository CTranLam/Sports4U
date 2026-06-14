export interface UserResponseDTO {
  userId: number;
  userName: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  status: number;
  provinceName: string | null;
  provinceCode: string | null;
  wardName: string | null;
  wardCode: string | null;
  detailAddress: string | null;
}

export interface UpdateProfilePayload {
  fullName: string;
  phone: string;
  provinceCode: string;
  wardCode: string;
  detailAddress: string;
  password?: string;
}

export interface ProvinceResponseDTO {
  code: string;
  name: string;
}

export interface ProvinceListResponse {
  provinces: ProvinceResponseDTO[];
}

export interface WardResponseDTO {
  code: string;
  name: string;
}

export interface WardListResponse {
  wards: WardResponseDTO[];
}
