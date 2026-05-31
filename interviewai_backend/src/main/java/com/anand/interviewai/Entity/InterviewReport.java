package com.anand.interviewai.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interview_reports")
public class InterviewReport {

    @Id
    private String id;

    private String jobDescription;
    private String resume;          // extracted text from uploaded PDF
    private String selfDescription;
    private Integer matchScore;     // 0–100

    private List<TechnicalQuestion> technicalQuestions;
    private List<BehavioralQuestion> behavioralQuestions;
    private List<SkillGap> skillGaps;
    private List<PreparationPlanItem> preparationPlan;

    private String userId;          // reference to User._id (stored as String)
    private String title;           // job title extracted by AI

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

