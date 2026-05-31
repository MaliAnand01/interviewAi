package com.anand.interviewai.Service;

import com.anand.interviewai.DTO.request.LoginRequest;
import com.anand.interviewai.DTO.request.RegisterRequest;
import com.anand.interviewai.DTO.response.AuthResponse;
import com.anand.interviewai.Entity.BlacklistedToken;
import com.anand.interviewai.Entity.User;
import com.anand.interviewai.Exception.AppException;
import com.anand.interviewai.Repo.BlacklistedTokenRepository;
import com.anand.interviewai.Repo.UserRepository;
import com.anand.interviewai.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException("Username already taken", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Account already exists with this email address", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getUsername());

        return AuthResponse.builder()
                .message("User registered successfully")
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(savedUser.getId())
                        .username(savedUser.getUsername())
                        .email(savedUser.getEmail())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.BAD_REQUEST));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException("Invalid email or password", HttpStatus.BAD_REQUEST);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        return AuthResponse.builder()
                .message("User logged in successfully")
                .token(token)
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .build())
                .build();
    }

    // Blacklist the token so it cannot be used again
    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            blacklistedTokenRepository.save(
                    BlacklistedToken.builder().token(token).build()
            );
        }
    }

    public AuthResponse.UserDto getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}

