package com.anand.interviewai.DTO.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportSummaryDto {

    private String id;
    private String title;
    private Integer matchScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

