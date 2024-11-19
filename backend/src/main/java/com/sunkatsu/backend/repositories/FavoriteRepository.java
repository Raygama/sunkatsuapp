package com.sunkatsu.backend.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.sunkatsu.backend.models.*;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, Integer> {
    List<Favorite> findByUserID(int userID);
}
