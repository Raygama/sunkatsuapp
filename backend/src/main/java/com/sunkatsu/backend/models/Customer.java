package com.sunkatsu.backend.models;
import java.util.Objects;

import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "customers")
public class Customer extends User {

    @Transient
    public static final String SEQUENCE_NAME = "customer_sequence";

}

