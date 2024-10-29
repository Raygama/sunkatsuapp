package com.sunkatsu.backend.repositories;

import com.sunkatsu.backend.models.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends MongoRepository<Customer, Integer>{
    
}