package com.examportal.controller;

import com.examportal.service.AuthService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  record RegisterReq(@NotBlank @Size(min = 2) String name, @Email String email, @Size(min = 6) String password) {}
  record LoginReq(@Email String email, @NotBlank String password) {}

  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> register(@RequestBody RegisterReq req) {
    return authService.register(req.name(), req.email(), req.password());
  }

  @PostMapping("/login")
  public Map<String, Object> login(@RequestBody LoginReq req) {
    return authService.login(req.email(), req.password());
  }

  @ExceptionHandler(IllegalArgumentException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> handleBadRequest(IllegalArgumentException ex) {
    return Map.of("message", ex.getMessage());
  }
}
