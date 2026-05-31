package com.anand.interviewai.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle our custom AppException (e.g. wrong password, user not found)
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Map<String, String>> handleAppException(AppException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("message", ex.getMessage());
        return ResponseEntity.status(ex.getStatus()).body(body);
    }

    // Handle @Valid validation failures (e.g. blank email, short password)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> body = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                body.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // Catch-all for any unexpected exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        log.error("Unhandled exception occurred: ", ex);
        Map<String, String> body = new HashMap<>();
        body.put("message", "An unexpected error occurred: " + ex.getMessage() + " (Type: " + ex.getClass().getName() + ")");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}

