package com.cupflow.CupFlow_ERP.auth;


import com.cupflow.CupFlow_ERP.common.exception.AppException;
import com.cupflow.CupFlow_ERP.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = (User) authentication.getPrincipal();

            String token = jwtUtil.generateToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name()
            );

            return new LoginResponse(token, user.getRole().name(), user.getId(), user.getFullName());
        } catch (AuthenticationException e) {
            throw new AppException(HttpStatus.BAD_REQUEST,"Invalid email or password"){};
        }
    }
}
