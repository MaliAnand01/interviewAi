package com.anand.interviewai.DTO.response;

import com.anand.interviewai.Entity.BehavioralQuestion;
import com.anand.interviewai.Entity.PreparationPlanItem;
import com.anand.interviewai.Entity.SkillGap;
import com.anand.interviewai.Entity.TechnicalQuestion;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiReportResult {
    private Integer matchScore;
    private String title;
    private List<TechnicalQuestion> technicalQuestions;
    private List<BehavioralQuestion> behavioralQuestions;
    private List<SkillGap> skillGaps;
    private List<PreparationPlanItem> preparationPlan;
}

