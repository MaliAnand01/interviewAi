package com.anand.interviewai.Service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    // Takes HTML string → returns PDF as byte array
    public byte[] generatePdfFromHtml(String html) throws Exception {
        try (ByteArrayOutputStream os = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withHtmlContent(html, null);
            builder.toStream(os);
            builder.run();
            return os.toByteArray();
        }
    }
}
