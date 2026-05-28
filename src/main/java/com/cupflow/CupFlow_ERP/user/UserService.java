package com.cupflow.CupFlow_ERP.user;

import com.cupflow.CupFlow_ERP.common.SecurityUtils;
import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.common.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if(userRepository.existsByEmail(request.getEmail())){
            throw new AppException(HttpStatus.CONFLICT,"A user with this email already exists");
        }

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated User not Found",currentUserId.toString()));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setActive(true);
        user.setCreatedBy(creator);

        User saved = userRepository.save(user);
        return new UserResponse(saved);
    }

    @Transactional
    public List<UserResponse> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found",id.toString()));
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse deactivateUser(UUID id) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();

        if(currentUserId.equals(id)){
            throw new AppException(HttpStatus.BAD_REQUEST,"You are not allowed to deactivate your own Account");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found",id.toString()));

        if(!user.isActive()){
            throw new AppException(HttpStatus.BAD_REQUEST,"User is already deactivated");
        }

        user.setActive(false);
        User saved = userRepository.save(user);
        return new UserResponse(saved);
    }
}
