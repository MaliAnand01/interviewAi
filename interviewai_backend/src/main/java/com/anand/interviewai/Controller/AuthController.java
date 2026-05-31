package com.anand.interviewai.Controller;

import com.anand.interviewai.DTO.request.LoginRequest;
import com.anand.interviewai.DTO.request.RegisterRequest;
import com.anand.interviewai.DTO.response.AuthResponse;
import com.anand.interviewai.Service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/logout
    // Frontend sends: Authorization: Bearer <token>
    // We blacklist the token server-side, frontend deletes from localStorage
    @GetMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
    }

    // GET /api/auth/get-me
    @GetMapping("/get-me")
    public ResponseEntity<Map<String, Object>> getMe() {
        // userId was set as principal in JwtAuthFilter
        String userId = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        AuthResponse.UserDto user = authService.getMe(userId);

        return ResponseEntity.ok(Map.of(
                "message", "User details fetched successfully",
                "user", user
        ));
    }
}
