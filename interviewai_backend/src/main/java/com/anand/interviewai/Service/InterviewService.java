package com.anand.interviewai.Service;


import com.anand.interviewai.DTO.response.GeminiReportResult;
import com.anand.interviewai.DTO.response.InterviewReportSummaryDto;
import com.anand.interviewai.Entity.InterviewReport;
import com.anand.interviewai.Exception.AppException;
import com.anand.interviewai.Repo.InterviewReportRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewReportRepository interviewReportRepository;

    @Autowired
    private GeminiAiService geminiAiService;

    @Autowired
    private PdfService pdfService;

    // ── Generate interview report ────────────────────────────────────────────
    public InterviewReport generateReport(
            String userId,
            String selfDescription,
            String jobDescription,
            MultipartFile resumeFile) throws Exception {

        if (jobDescription == null || jobDescription.isBlank()) {
            throw new AppException("Job description is required", HttpStatus.BAD_REQUEST);
        }
        if ((resumeFile == null || resumeFile.isEmpty()) &&
                (selfDescription == null || selfDescription.isBlank())) {
            throw new AppException(
                    "Either a resume PDF or a self description is required",
                    HttpStatus.BAD_REQUEST);
        }

        // Extract text from uploaded PDF using Apache PDFBox 3.x
        String resumeText = null;
        if (resumeFile != null && !resumeFile.isEmpty()) {
            try (PDDocument document = Loader.loadPDF(resumeFile.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                resumeText = stripper.getText(document);
            }
        }

        // Call Gemini AI to generate the report
        GeminiReportResult aiResult = geminiAiService.generateInterviewReport(
                resumeText, selfDescription, jobDescription
        );

        // Build and save the InterviewReport document
        InterviewReport report = InterviewReport.builder()
                .userId(userId)
                .jobDescription(jobDescription)
                .selfDescription(selfDescription)
                .resume(resumeText)
                .matchScore(aiResult.getMatchScore())
                .title(aiResult.getTitle())
                .technicalQuestions(aiResult.getTechnicalQuestions())
                .behavioralQuestions(aiResult.getBehavioralQuestions())
                .skillGaps(aiResult.getSkillGaps())
                .preparationPlan(aiResult.getPreparationPlan())
                .build();

        return interviewReportRepository.save(report);
    }

    // ── Get single report by ID (only if it belongs to this user) ───────────
    public InterviewReport getReportById(String reportId, String userId) {
        return interviewReportRepository.findByIdAndUserId(reportId, userId)
                .orElseThrow(() -> new AppException(
                        "Interview report not found", HttpStatus.NOT_FOUND));
    }

    // ── Get all reports for a user (summary view, no heavy fields) ──────────
    public List<InterviewReportSummaryDto> getAllReports(String userId) {
        List<InterviewReport> reports =
                interviewReportRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return reports.stream().map(report -> InterviewReportSummaryDto.builder()
                .id(report.getId())
                .title(report.getTitle())
                .matchScore(report.getMatchScore())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build()
        ).toList();
    }

    // ── Generate resume PDF for a given report ───────────────────────────────
    public byte[] generateResumePdf(String reportId, String userId) throws Exception {
        InterviewReport report = interviewReportRepository.findByIdAndUserId(reportId, userId)
                .orElseThrow(() -> new AppException(
                        "Interview report not found", HttpStatus.NOT_FOUND));

        String html = geminiAiService.generateResumeHtml(
                report.getResume(),
                report.getSelfDescription(),
                report.getJobDescription()
        );

        return pdfService.generatePdfFromHtml(html);
    }
}
