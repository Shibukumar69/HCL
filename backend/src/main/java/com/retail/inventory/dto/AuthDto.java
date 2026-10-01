package com.retail.inventory.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class AuthDto {

    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String role;

        public RegisterRequest() {}
        public RegisterRequest(String name, String email, String password, String role) {
            this.name = name;
            this.email = email;
            this.password = password;
            this.role = role;
        }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;
        @JsonProperty("created_at")
        private LocalDateTime createdAt;

        public UserDto() {}
        public UserDto(Long id, String name, String email, String role, LocalDateTime createdAt) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.createdAt = createdAt;
        }

        public static UserDtoBuilder builder() { return new UserDtoBuilder(); }
        public static class UserDtoBuilder {
            private Long id;
            private String name;
            private String email;
            private String role;
            private LocalDateTime createdAt;
            public UserDtoBuilder id(Long id) { this.id = id; return this; }
            public UserDtoBuilder name(String name) { this.name = name; return this; }
            public UserDtoBuilder email(String email) { this.email = email; return this; }
            public UserDtoBuilder role(String role) { this.role = role; return this; }
            public UserDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public UserDto build() { return new UserDto(id, name, email, role, createdAt); }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }

    public static class AuthResponseData {
        private UserDto user;
        private String token;

        public AuthResponseData() {}
        public AuthResponseData(UserDto user, String token) {
            this.user = user;
            this.token = token;
        }

        public static AuthResponseDataBuilder builder() { return new AuthResponseDataBuilder(); }
        public static class AuthResponseDataBuilder {
            private UserDto user;
            private String token;
            public AuthResponseDataBuilder user(UserDto user) { this.user = user; return this; }
            public AuthResponseDataBuilder token(String token) { this.token = token; return this; }
            public AuthResponseData build() { return new AuthResponseData(user, token); }
        }

        public UserDto getUser() { return user; }
        public void setUser(UserDto user) { this.user = user; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}
