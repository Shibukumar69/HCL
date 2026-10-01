package com.retail.inventory.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> getRootStatus() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "online");
        status.put("project", "Retail Inventory Management System API");
        status.put("version", "1.0.0");
        return ResponseEntity.ok(status);
    }
}
