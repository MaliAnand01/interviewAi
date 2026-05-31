package com.anand.interviewai.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BehavioralQuestion {

    private String question;
    private String intention;
    private String answer;
}
