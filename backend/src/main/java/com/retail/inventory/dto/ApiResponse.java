package com.retail.inventory.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private Integer count;
    private T data;

    public ApiResponse() {}

    public ApiResponse(boolean success, String message, Integer count, T data) {
        this.success = success;
        this.message = message;
        this.count = count;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, null, null, data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, null, data);
    }

    public static <T> ApiResponse<T> successWithCount(int count, T data) {
        return new ApiResponse<>(true, null, count, data);
    }

    public static <T> ApiResponse<T> messageOnly(String message) {
        return new ApiResponse<>(true, message, null, null);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, null);
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Integer getCount() { return count; }
    public void setCount(Integer count) { this.count = count; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
