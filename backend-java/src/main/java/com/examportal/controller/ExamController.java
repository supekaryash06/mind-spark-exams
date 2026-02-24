package com.examportal.controller;

import com.examportal.security.JwtService;
import com.examportal.service.ExamService;
import io.jsonwebtoken.Claims;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ExamController {
  private final ExamService examService;
  private final JwtService jwtService;

  public ExamController(ExamService examService, JwtService jwtService) {
    this.examService = examService;
    this.jwtService = jwtService;
  }

  record SubmitReq(List<Map<String, Object>> answers, Integer durationSeconds) {}

  private Long requireUserId(String authHeader) {
    if (authHeader == null || !authHeader.startsWith("Bearer ")) throw new SecurityException("Missing authorization token");
    Claims claims = jwtService.parse(authHeader.substring(7));
    return ((Number) claims.get("userId")).longValue();
  }

  @GetMapping("/health")
  public Map<String, String> health() {
    return Map.of("status", "ok");
  }

  @GetMapping("/exams")
  public Map<String, Object> exams(@RequestHeader(name = "Authorization", required = false) String authHeader) {
    Long userId = requireUserId(authHeader);
    return Map.of("exams", examService.listExams(userId));
  }

  @GetMapping("/exams/{id}/questions")
  public Map<String, Object> questions(@PathVariable Long id, @RequestHeader(name = "Authorization", required = false) String authHeader) {
    requireUserId(authHeader);
    return examService.examQuestions(id);
  }

  @PostMapping("/exams/{id}/submissions")
  @ResponseStatus(HttpStatus.CREATED)
  public Map<String, Object> submit(
      @PathVariable Long id,
      @RequestBody SubmitReq req,
      @RequestHeader(name = "Authorization", required = false) String authHeader) {
    Long userId = requireUserId(authHeader);
    return examService.submit(userId, id, req.answers(), req.durationSeconds());
  }

  @ExceptionHandler(SecurityException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public Map<String, String> unauthorized(SecurityException ex) {
    return Map.of("message", ex.getMessage());
  }

  @ExceptionHandler(Exception.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public Map<String, String> badRequest(Exception ex) {
    return Map.of("message", ex.getMessage());
  }
}
