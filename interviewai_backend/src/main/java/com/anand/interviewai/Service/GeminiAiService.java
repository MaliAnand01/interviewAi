package com.anand.interviewai.Service;

import com.anand.interviewai.DTO.response.GeminiReportResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class GeminiAiService {

    @Value("${google.genai.api-key}")
    private String apiKey;

    @Value("${google.genai.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── Core method: send prompt to Gemini and get back generated text ──────
    private String callGemini(String prompt, Map<String, Object> schema) throws Exception {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent?key=" + apiKey;

        // Build request body
        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("responseMimeType", "application/json");
        generationConfig.put("responseSchema", schema);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));
        requestBody.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        // Extract text from Gemini response structure:
        // { candidates: [{ content: { parts: [{ text: "..." }] } }] }
        JsonNode root = objectMapper.readTree(response.getBody());
        return root.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
    }

    // ── Generate interview report ────────────────────────────────────────────
    public GeminiReportResult generateInterviewReport(
            String resume, String selfDescription, String jobDescription) throws Exception {

        String prompt = String.format("""
                Generate an interview report for a candidate with the following details:
                Resume: %s
                Self Description: %s
                Job Description: %s
                """,
                resume != null ? resume : "Not provided",
                selfDescription != null ? selfDescription : "Not provided",
                jobDescription);

        String jsonText = callGemini(prompt, buildInterviewReportSchema());
        return objectMapper.readValue(jsonText, GeminiReportResult.class);
    }

    // ── Generate resume HTML (will be converted to PDF) ─────────────────────
    public String generateResumeHtml(
            String resume, String selfDescription, String jobDescription) throws Exception {

        String prompt = String.format("""
                Generate a professional, ATS-friendly resume in HTML for a candidate.
                Resume: %s
                Self Description: %s
                Job Description: %s
                Tailor it for the job description. Keep it clean and 1-2 pages.
                Return JSON with a single field "html" containing the full HTML content.
                """,
                resume != null ? resume : "Not provided",
                selfDescription != null ? selfDescription : "Not provided",
                jobDescription);

        Map<String, Object> schema = Map.of(
                "type", "object",
                "properties", Map.of("html", Map.of("type", "string"))
        );

        String jsonText = callGemini(prompt, schema);
        JsonNode result = objectMapper.readTree(jsonText);
        return result.path("html").asText();
    }

    // ── Build JSON schema for structured Gemini interview report output ──────
    private Map<String, Object> buildInterviewReportSchema() {

        // Schema for technicalQuestions and behavioralQuestions items
        Map<String, Object> questionItem = Map.of(
                "type", "object",
                "properties", Map.of(
                        "question", Map.of("type", "string"),
                        "intention", Map.of("type", "string"),
                        "answer",   Map.of("type", "string")
                )
        );

        // Schema for skillGaps items
        Map<String, Object> skillGapItem = new HashMap<>();
        skillGapItem.put("type", "object");
        skillGapItem.put("properties", Map.of(
                "skill",    Map.of("type", "string"),
                "severity", Map.of("type", "string",
                        "enum", List.of("low", "medium", "high"))
        ));

        // Schema for preparationPlan items
        Map<String, Object> prepPlanItem = Map.of(
                "type", "object",
                "properties", Map.of(
                        "day",   Map.of("type", "integer"),
                        "focus", Map.of("type", "string"),
                        "tasks", Map.of("type", "array",
                                "items", Map.of("type", "string"))
                )
        );

        // Full schema
        Map<String, Object> properties = new HashMap<>();
        properties.put("matchScore",          Map.of("type", "integer"));
        properties.put("title",               Map.of("type", "string"));
        properties.put("technicalQuestions",  Map.of("type", "array", "items", questionItem));
        properties.put("behavioralQuestions", Map.of("type", "array", "items", questionItem));
        properties.put("skillGaps",           Map.of("type", "array", "items", skillGapItem));
        properties.put("preparationPlan",     Map.of("type", "array", "items", prepPlanItem));

        Map<String, Object> schema = new HashMap<>();
        schema.put("type", "object");
        schema.put("properties", properties);
        return schema;
    }
}

