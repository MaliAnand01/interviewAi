package com.anand.interviewai.Controller;

import com.anand.interviewai.DTO.response.InterviewReportSummaryDto;
import com.anand.interviewai.Entity.InterviewReport;
import com.anand.interviewai.Service.InterviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    // Helper to get logged-in userId from SecurityContext
    private String getCurrentUserId() {
        return (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // POST /api/interview/
    // Accepts multipart/form-data: jobDescription, selfDescription (optional), resume PDF (optional)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> generateReport(
            @RequestParam("jobDescription") String jobDescription,
            @RequestParam(value = "selfDescription", required = false) String selfDescription,
            @RequestParam(value = "resume", required = false) MultipartFile resume) throws Exception {

        String userId = getCurrentUserId();

        InterviewReport report = interviewService.generateReport(
                userId, selfDescription, jobDescription, resume
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Interview report generated successfully",
                "interviewReport", report
        ));
    }

    // GET /api/interview/
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllReports() {
        String userId = getCurrentUserId();
        List<InterviewReportSummaryDto> reports = interviewService.getAllReports(userId);

        return ResponseEntity.ok(Map.of(
                "message", "Interview reports fetched successfully",
                "interviewReports", reports
        ));
    }

    // GET /api/interview/report/{interviewId}
    @GetMapping("/report/{interviewId}")
    public ResponseEntity<Map<String, Object>> getReportById(
            @PathVariable String interviewId) {

        String userId = getCurrentUserId();
        InterviewReport report = interviewService.getReportById(interviewId, userId);

        return ResponseEntity.ok(Map.of(
                "message", "Interview report fetched successfully",
                "interviewReport", report
        ));
    }

    // POST /api/interview/resume/pdf/{interviewReportId}
    // Returns the PDF as a file download
    @PostMapping("/resume/pdf/{interviewReportId}")
    public ResponseEntity<byte[]> generateResumePdf(
            @PathVariable String interviewReportId) throws Exception {

        String userId = getCurrentUserId();
        byte[] pdfBytes = interviewService.generateResumePdf(interviewReportId, userId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData(
                "attachment", "resume_" + interviewReportId + ".pdf"
        );

        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}

