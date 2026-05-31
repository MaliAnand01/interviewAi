package com.anand.interviewai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class InterviewaiApplication {

	public static void main(String[] args) {
		SpringApplication.run(InterviewaiApplication.class, args);
	}

}
