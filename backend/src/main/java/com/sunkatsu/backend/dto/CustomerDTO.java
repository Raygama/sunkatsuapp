package com.sunkatsu.backend.dto;

import com.sunkatsu.backend.models.Role;
import com.sunkatsu.backend.models.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerDTO {
    private String id;
    private String username;
    private Role role;
    private Status status;
}
