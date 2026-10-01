package com.retail.inventory.controller;

import com.retail.inventory.dto.ApiResponse;
import com.retail.inventory.dto.OrderDto;
import com.retail.inventory.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto.OrderResponseDto>>> getAllOrders() {
        List<OrderDto.OrderResponseDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.successWithCount(orders.size(), orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponseDto>> getOrderById(@PathVariable Long id) {
        OrderDto.OrderResponseDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto.OrderResponseDto>> createOrder(@Valid @RequestBody OrderDto.CreateOrderRequest request) {
        OrderDto.OrderResponseDto created = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order created & stock deducted successfully!", created));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto.OrderResponseDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderDto.UpdateStatusRequest request) {
        OrderDto.OrderResponseDto updated = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated to " + request.getStatus() + "!", updated));
    }
}
