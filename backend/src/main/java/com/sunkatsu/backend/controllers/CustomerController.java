package com.sunkatsu.backend.controllers;

import com.sunkatsu.backend.models.Customer;
import com.sunkatsu.backend.models.CustomerId;
import com.sunkatsu.backend.models.Order;
import com.sunkatsu.backend.models.ShoppingCart;
import com.sunkatsu.backend.services.CustomerService;
import com.sunkatsu.backend.services.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    @Autowired
    private CustomerService customerService;

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.findAllCustomers();
    }

    @MessageMapping("/customer.createCustomer")
    @SendTo("/customer/topic")
    public Customer createCustomer(@Payload Customer customer) {
        customerService.createCustomer(customer);
        return customer;
    }
    
    @MessageMapping("/customer.searchCustomer")
    @SendTo("/customer/public")
    public Customer searchCustomer(@Payload CustomerId customerid) {
        String id = customerid.getCustomerId();
        Customer foundCustomer = customerService.getCustomerById(id);
        if(foundCustomer != null) {
            customerService.saveCustomer(foundCustomer);
            return foundCustomer;
        }
        return null;
    }

    @PostMapping
    public Customer addCustomerToDB(@Payload Customer customer) {
        return customerService.createCustomer(customer);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable String id) {
        Customer customer = customerService.getCustomerById(id);
        return customer != null ? ResponseEntity.ok(customer) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/cart")
    public ResponseEntity<ShoppingCart> getCartByCustomerId(@PathVariable String id) {
        ShoppingCart cart = customerService.getCartByCustomerId(id);
        return cart != null ? ResponseEntity.ok(cart) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/orders")
    public Order getOrderByUserId(@PathVariable int id) {
        return orderService.getOrderByUserId(id);
    }

    @MessageMapping("/customer.disconnectCustomer")
    @SendTo("/customer/topic")
    public Customer disconnect(@Payload CustomerId customerId) {
        Customer customer = customerService.getCustomerById(customerId.getCustomerId());
        if (customer != null) {
            customerService.disconnect(customer);
        }
        return customer;
    }

    @GetMapping("/status")
    public ResponseEntity<List<Customer>> findConnectedUsers() {
        return ResponseEntity.ok(customerService.findConnectedUsers());
    }
}
