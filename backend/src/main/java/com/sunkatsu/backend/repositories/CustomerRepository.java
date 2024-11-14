package com.sunkatsu.backend.repositories;

import com.sunkatsu.backend.models.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.sunkatsu.backend.models.Status;


@Repository
public interface CustomerRepository extends MongoRepository<Customer, String>{
    List<Customer> findAllByStatus(Status status);
    Customer findByIdAndPassword(String id, String password);
}
