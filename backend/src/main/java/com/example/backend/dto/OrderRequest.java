package com.example.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {
    private String userEmail;
    private BigDecimal totalPrice;
    private List<String> productNames;

    // Getter ve Setter'lar
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<String> getProductNames() {
        return productNames;
    }

    public void setProductNames(List<String> productNames) {
        this.productNames = productNames;
    }
}
