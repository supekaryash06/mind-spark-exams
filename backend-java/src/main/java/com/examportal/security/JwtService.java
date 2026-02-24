package com.examportal.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  @Value("${app.jwt.secret:change-me-in-production-please-change-at-least-32-bytes}")
  private String secret;

  private SecretKey key() {
    return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generate(Long userId, String email, String name) {
    return Jwts.builder()
        .claims(Map.of("userId", userId, "email", email, "name", name))
        .expiration(new Date(System.currentTimeMillis() + 12L * 60 * 60 * 1000))
        .signWith(key())
        .compact();
  }

  public Claims parse(String token) {
    return Jwts.parser().verifyWith(key()).build().parseSignedClaims(token).getPayload();
  }
}
