package com.anand.interviewai.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SkillGap {

    private String skill;
    private String severity; // values: "low", "medium", "high"
}
