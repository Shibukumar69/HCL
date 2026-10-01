package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.AuthDto;
import com.retail.inventory.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponseData>> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        AuthDto.AuthResponseData responseData = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully!", responseData));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthDto.AuthResponseData>> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        AuthDto.AuthResponseData responseData = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", responseData));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<AuthDto.UserDto>> getProfile(Authentication authentication) {
        AuthDto.UserDto profile = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuthDto.UserDto>>> getAllUsers() {
        List<AuthDto.UserDto> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.successWithCount(users.size(), users));
    }
}
