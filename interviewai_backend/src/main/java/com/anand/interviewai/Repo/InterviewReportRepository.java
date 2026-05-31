package com.anand.interviewai.Repo;


import com.anand.interviewai.Entity.InterviewReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewReportRepository extends MongoRepository<InterviewReport, String> {

    // Get all reports for a user, newest first
    List<InterviewReport> findByUserIdOrderByCreatedAtDesc(String userId);

    // Get a specific report only if it belongs to the requesting user (security check)
    Optional<InterviewReport> findByIdAndUserId(String id, String userId);
}

