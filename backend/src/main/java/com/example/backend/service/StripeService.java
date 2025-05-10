package com.example.backend.service;

import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;

public interface StripeService {
    Customer createCustomer(String email) throws StripeException;
    PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException;
}
