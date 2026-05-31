package com.anand.interviewai.Repo;


import com.anand.interviewai.Entity.BlacklistedToken;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BlacklistedTokenRepository extends MongoRepository<BlacklistedToken, String> {

    boolean existsByToken(String token);
}

