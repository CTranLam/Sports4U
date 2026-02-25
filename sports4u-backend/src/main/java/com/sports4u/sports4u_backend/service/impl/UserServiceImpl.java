package com.sports4u.sports4u_backend.service.impl;

import com.sports4u.sports4u_backend.converter.ConvertCartItem;
import com.sports4u.sports4u_backend.converter.UserEntityToDTO;
import com.sports4u.sports4u_backend.dto.cartdto.CartItemDTO;
import com.sports4u.sports4u_backend.dto.cartdto.CartItemIdsRequestDTO;
import com.sports4u.sports4u_backend.dto.cartdto.CartItemResponseDTO;
import com.sports4u.sports4u_backend.dto.orderdto.OrderPreviewResponseDTO;
import com.sports4u.sports4u_backend.dto.userdto.*;
import com.sports4u.sports4u_backend.entity.*;
import com.sports4u.sports4u_backend.enums.OtpStatus;
import com.sports4u.sports4u_backend.enums.Role;
import com.sports4u.sports4u_backend.exception.NotFoundException;
import com.sports4u.sports4u_backend.repository.*;
import com.sports4u.sports4u_backend.service.IUserService;
import com.sports4u.sports4u_backend.service.RabbitMQService.EmailProducerService;
import com.sports4u.sports4u_backend.service.Redis.RateLimitLoginService;
import com.sports4u.sports4u_backend.utils.JwtTokenUtil;
import com.sports4u.sports4u_backend.utils.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;

    private final AuthenticationManager authenticationManager;

    private final JwtTokenUtil jwtTokenUtil;

    private final PasswordResetOtpRepository passwordResetOtpRepository;

    private final EmailProducerService emailProducerService;

    private final RateLimitLoginService rateLimitLoginService;

    private final ProvinceRepository provinceRepository;

    private final WardRepository wardRepository;

    private final CartItemRepository cartItemRepository;

    private final ProductRepository productRepository;

    private final UserEntityToDTO userEntityToDTO;

    @Transactional
    @Override
    @CacheEvict(value = {"dashboardSummary"}, allEntries = true)
    public UserRegisterResponseDTO createUser(UserRegisterDTO userRegisterDTO) {
        System.out.println("Registering new user and clearing dashboard cache");
        String username = userRegisterDTO.getUsername();
        String password = userRegisterDTO.getPassword();

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(username);
        userEntity.setPassword(passwordEncoder.encode(password));
        userEntity.setRole(Role.ROLE_USER);
        userEntity.setStatus(1L);

        userRepository.save(userEntity);

        UserRegisterResponseDTO userRegisterResponseDTO = new UserRegisterResponseDTO();
        userRegisterResponseDTO.setUsername(username);
        userRegisterResponseDTO.setRole(Role.ROLE_USER.name());
        return userRegisterResponseDTO;
    }

    @Override
    public UserResponseDTO findByUsername(String userName) throws Exception {
        UserEntity userEntity= userRepository.findByEmail(userName)
                .orElseThrow(() -> new Exception("Tài khoản không tồn tại"));
        UserResponseDTO userResponseDTO = new UserResponseDTO();
        userResponseDTO = userEntityToDTO.convertToDTO(userEntity);
        return userResponseDTO;
    }

    @Override
    public String login(String userName, String password) throws Exception {

        UserEntity userEntity = userRepository.findByEmail(userName)
                .orElseThrow(() -> new NotFoundException("Sai tài khoản hoặc mật khẩu"));

        if (userEntity.getStatus() == 0L) {
            throw new RuntimeException("Tài khoản đã bị khóa. Vui lòng xác thực OTP đặt lại mật khẩu.");
        }
        if (!passwordEncoder.matches(password, userEntity.getPassword())) {
            rateLimitLoginService.loginFailed(userName);
            throw new BadCredentialsException("Sai tài khoản hoặc mật khẩu");
        }

        //Login success → reset redis
        rateLimitLoginService.loginSucceeded(userName);
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userName, password, userEntity.getAuthorities());
        authenticationManager.authenticate(authenticationToken);

        return jwtTokenUtil.generateToken(userEntity);
    }


    @Transactional
    @Override
    public Long sendOtp(String email) {

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new NoSuchElementException("Email không tồn tại")
                );

        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetOTPEntity otpEntity = new PasswordResetOTPEntity();
        otpEntity.setUser(user);
        otpEntity.setOtpCode(otp);
        otpEntity.setExpirationTime(LocalDateTime.now().plusMinutes(3));
        otpEntity.setStatus(OtpStatus.PENDING);

        passwordResetOtpRepository.save(otpEntity);

        // DTO gửi qua RabbitMQ
        EmailMessageDTO emailMessageDTO = new EmailMessageDTO(
                otpEntity.getId(),
                email,
                "Mã OTP đặt lại mật khẩu",
                "OTP của bạn là: " + otp
        );

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronizationAdapter() {
                    @Override
                    public void afterCommit() {
                        emailProducerService.sendEmailAsync(emailMessageDTO);
                    }
                }
        );

        return otpEntity.getId();
    }

    @Transactional
    @Override
    public boolean verifyOtp(String email, String otp) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Email không tồn tại"));

        PasswordResetOTPEntity entity = passwordResetOtpRepository.findTopByUser_UserIdOrderByCreatedAtDesc(user.getUserId());

        if (entity == null) {
            return false;
        }
        if (entity.getStatus() == OtpStatus.FAILED) {
            return false;
        }
        if (entity.getStatus() == OtpStatus.VERIFIED) {
            return false;
        }
        if (entity.getExpirationTime().isBefore(LocalDateTime.now())) {
            return false;
        }
        if (!entity.getOtpCode().equals(otp)) {
            return false;
        }
        entity.setStatus(OtpStatus.VERIFIED);
        passwordResetOtpRepository.save(entity);

        return true;
    }

    @Transactional
    @Override
    public void setNewPassword(String email, String newPassword){
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Email không tồn tại trong hệ thống."));

        userEntity.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(userEntity);
    }

    @Transactional
    @Override
    public void updateUserInfo(String email, UpdateProfileDTO request) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu cập nhật không được để trống");
        }
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new IllegalArgumentException("Họ tên không được để trống");
        }
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            throw new IllegalArgumentException("Số điện thoại không được để trống");
        }
        if (request.getProvinceId() == null) {
            throw new IllegalArgumentException("Tỉnh/thành phố không được để trống");
        }
        if (request.getWardId() == null) {
            throw new IllegalArgumentException("Phường/xã không được để trống");
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng với email đã cung cấp"));

        ProvinceEntity province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tỉnh/thành phố"));

        WardEntity ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phường/xã"));

        if (!ward.getProvince().getCode().equals(province.getCode())) {
            throw new IllegalArgumentException("Phường/xã không thuộc tỉnh/thành phố đã chọn");
        }

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDetailAddress(request.getAddressDetail());
        user.setProvince(province);
        user.setWard(ward);

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserResponseDTO createAccount(UserInAdminDTO requestAdminDTO) throws IllegalArgumentException {
        if (requestAdminDTO == null) {
            throw new IllegalArgumentException("Dữ liệu người dùng không được để trống");
        }
        if (requestAdminDTO.getEmail() == null || requestAdminDTO.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (requestAdminDTO.getPassword() == null || requestAdminDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("Mật khẩu không được để trống");
        }
        if (requestAdminDTO.getRole() == null) {
            throw new IllegalArgumentException("Vai trò không được để trống");
        }

        if (userRepository.existsByEmail(requestAdminDTO.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
        }

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(requestAdminDTO.getEmail());
        userEntity.setPassword(passwordEncoder.encode(requestAdminDTO.getPassword()));
        userEntity.setRole(requestAdminDTO.getRole());
        userEntity.setStatus(requestAdminDTO.getStatus());

        UserEntity savedUser = userRepository.save(userEntity);

        return userEntityToDTO.convertToDTO(savedUser);
    }

    @Override
    @Transactional
    public void updateAccount(Long userId, UserUpdateDTO userUpdateDTO) throws IllegalArgumentException {
        UserEntity userEntity = userRepository.findByUserIdAndStatus(userId, 1L)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại hoặc đã bị khóa"));

        userEntity.setRole(userUpdateDTO.getRole());
        userEntity.setPassword(passwordEncoder.encode(userUpdateDTO.getNewPassword()));

        userRepository.save(userEntity);
    }

    @Override
    @Transactional
    public void lockAccount(Long userId) throws IllegalArgumentException {
        UserEntity userEntity = userRepository.findByUserIdAndStatus(userId, 1L)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại hoặc đã bị khóa"));

        userEntity.setStatus(0L);
        userRepository.save(userEntity);
    }

    @Override
    public void unlockAccount(Long userId) throws IllegalArgumentException {
        UserEntity userEntity = userRepository.findByUserIdAndStatus(userId, 1L)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản không tồn tại hoặc đã bị khóa"));

        userEntity.setStatus(1L);
        userRepository.save(userEntity);
    }

    @Override
    public PageResponse<UserResponseDTO> getAccounts(Long status, Role role, int page, int size) throws NoSuchElementException {
        Pageable pageable = PageRequest.of(
                page - 1,
                size,
                Sort.by("userId").descending()
        );
        Page<UserEntity> userEntities = userRepository.findByStatusAndRole(status, role, pageable);
        if(userEntities.isEmpty()) {
            throw new NoSuchElementException("Không tìm thấy tài khoản nào với trạng thái và vai trò đã chọn");
        }

        List<UserResponseDTO> userResponseDTOS = userEntities.stream()
                .map(userEntityToDTO::convertToDTO)
                .toList();

        return PageResponse.<UserResponseDTO>builder()
                .content(userResponseDTOS)
                .pageNumber(userEntities.getNumber() + 1)
                .pageSize(userEntities.getSize())
                .totalElements(userEntities.getTotalElements())
                .totalPages(userEntities.getTotalPages())
                .last(userEntities.isLast())
                .build();
    }

    @Transactional
    @Override
    public void addItemToCart(String email, CartItemDTO cartItemDTO) throws NoSuchElementException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Tài khoản không tồn tại"));

        ProductEntity productEntity = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại"));

        CartItemEntity cartItemEntity = ConvertCartItem.convertToCartItemEntity(cartItemDTO, userEntity, productEntity);
        cartItemRepository.save(cartItemEntity);
    }

    @Transactional
    @Override
    public void removeItemFromCart(String email, Long productId) throws NoSuchElementException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Tài khoản không tồn tại"));

        CartItemEntity cartItemEntity = cartItemRepository.findByUser_UserIdAndProduct_ProductId(userEntity.getUserId(), productId);
        if (cartItemEntity == null) {
            throw new NoSuchElementException("Sản phẩm không tồn tại trong giỏ hàng");
        }
        cartItemRepository.delete(cartItemEntity);
    }

    @Override
    public List<CartItemResponseDTO> getCartItems(String email) throws NoSuchElementException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Tài khoản không tồn tại"));

        List<CartItemEntity> cartItemEntities = cartItemRepository.findByUser_UserId(userEntity.getUserId());

        return cartItemEntities.stream()
                .map(cartItemEntity -> {
                    CartItemResponseDTO cartItemResponseDTO = new CartItemResponseDTO();
                    cartItemResponseDTO.setProductId(cartItemEntity.getProduct().getProductId());
                    cartItemResponseDTO.setQuantity(cartItemEntity.getQuantity());
                    cartItemResponseDTO.setPrice(cartItemEntity.getPriceAtAdded());
                    return cartItemResponseDTO;
                })
                .toList();
    }

    @Transactional
    @Override
    public void updateItemCart(String email, CartItemDTO cartItemDTO, Long itemId) throws NoSuchElementException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Tài khoản không tồn tại"));

        CartItemEntity cartItemEntity = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại trong giỏ hàng"));

        if (!cartItemEntity.getUser().getUserId().equals(userEntity.getUserId())) {
            throw new NoSuchElementException("Sản phẩm không có trong giỏ hàng của người dùng");
        }

        ProductEntity productEntity = productRepository.findById(cartItemDTO.getProductId())
                .orElseThrow(() -> new NoSuchElementException("Sản phẩm không tồn tại"));

        cartItemEntity.setProduct(productEntity);
        cartItemEntity.setQuantity(cartItemDTO.getQuantity());
        cartItemEntity.setPriceAtAdded(productEntity.getPrice());
        cartItemRepository.save(cartItemEntity);
    }

    @Override
    public Long getCartItemCount(String email) throws NoSuchElementException {
        UserEntity userEntity = userRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Tài khoản không tồn tại"));

        return cartItemRepository.sumQuantityByUserId(userEntity.getUserId());
    }



}
