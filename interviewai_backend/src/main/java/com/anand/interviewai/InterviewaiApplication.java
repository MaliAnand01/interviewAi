package com.anand.interviewai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
@EnableMongoAuditing
public class InterviewaiApplication {

	public static void main(String[] args) {
		loadEnv();
		SpringApplication.run(InterviewaiApplication.class, args);
	}

	private static void loadEnv() {
		Path path = Paths.get(".env");
		if (Files.exists(path)) {
			try {
				List<String> lines = Files.readAllLines(path);
				for (String line : lines) {
					line = line.trim();
					if (line.isEmpty() || line.startsWith("#")) {
						continue;
					}
					int delimiterIndex = line.indexOf('=');
					if (delimiterIndex > 0) {
						String key = line.substring(0, delimiterIndex).trim();
						String value = line.substring(delimiterIndex + 1).trim();
						// Set property if not already present in environment variables
						if (System.getenv(key) == null && System.getProperty(key) == null) {
							System.setProperty(key, value);
						}
					}
				}
			} catch (IOException e) {
				System.err.println("Could not load .env file: " + e.getMessage());
			}
		}
	}

}
