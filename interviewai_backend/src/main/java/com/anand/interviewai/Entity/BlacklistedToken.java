package com.anand.interviewai.Entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "blacklistTokens")
public class BlacklistedToken {

    @Id
    private String id;

    private String token;

    @CreatedDate
    private LocalDateTime createdAt;
}
