package com.anand.interviewai.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PreparationPlanItem {

    private Integer day;
    private String focus;
    private List<String> tasks;
}
