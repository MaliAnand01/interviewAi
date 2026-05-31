package com.anand.interviewai.Security;

import com.anand.interviewai.Repo.BlacklistedTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Step 1: Read Authorization header — expected format: "Bearer <token>"
        String authHeader = request.getHeader("Authorization");

        // Step 2: If header missing or wrong format, skip
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Extract the raw token (remove "Bearer " prefix)
        String token = authHeader.substring(7);

        // Step 4: Check if token is blacklisted (user logged out)
        if (blacklistedTokenRepository.existsByToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 5: Validate token signature and expiry
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 6: Extract userId, set as authenticated principal
        String userId = jwtUtil.extractUserId(token);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userId, null, List.of());

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}

