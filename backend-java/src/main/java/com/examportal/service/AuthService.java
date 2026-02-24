package com.examportal.service;

import com.examportal.security.JwtService;
import java.util.Map;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final JdbcTemplate jdbcTemplate;
  private final BCryptPasswordEncoder encoder;
  private final JwtService jwtService;

  public AuthService(JdbcTemplate jdbcTemplate, BCryptPasswordEncoder encoder, JwtService jwtService) {
    this.jdbcTemplate = jdbcTemplate;
    this.encoder = encoder;
    this.jwtService = jwtService;
  }

  public Map<String, Object> register(String name, String email, String password) {
    Integer exists = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE email = ?", Integer.class, email);
    if (exists != null && exists > 0) throw new IllegalArgumentException("Email already registered");

    jdbcTemplate.update("INSERT INTO users(full_name, email, password_hash) VALUES(?, ?, ?)", name, email, encoder.encode(password));
    Long id = jdbcTemplate.queryForObject("SELECT id FROM users WHERE email = ?", Long.class, email);
    String token = jwtService.generate(id, email, name);
    return Map.of("token", token, "user", Map.of("id", id, "name", name, "email", email));
  }

  public Map<String, Object> login(String email, String password) {
    try {
      var user = jdbcTemplate.queryForMap("SELECT id, full_name, email, password_hash FROM users WHERE email = ? LIMIT 1", email);
      if (!encoder.matches(password, (String) user.get("password_hash"))) throw new IllegalArgumentException("Invalid credentials");
      String token = jwtService.generate(((Number) user.get("id")).longValue(), (String) user.get("email"), (String) user.get("full_name"));
      return Map.of("token", token, "user", Map.of("id", user.get("id"), "name", user.get("full_name"), "email", user.get("email")));
    } catch (EmptyResultDataAccessException ex) {
      throw new IllegalArgumentException("Invalid credentials");
    }
  }
}
