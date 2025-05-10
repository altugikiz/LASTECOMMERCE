package com.example.backend.service.impl;

import com.example.backend.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StripeServiceImpl implements StripeService {

    @Override
    public Customer createCustomer(String email) throws StripeException {
        CustomerCreateParams params = CustomerCreateParams.builder()
            .setEmail(email)
            .build();
        return Customer.create(params);
    }

    @Override
    public PaymentIntent createPaymentIntent(Long amount, String currency) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amount)
            .setCurrency(currency)
            .addPaymentMethodType("card")  // Use addPaymentMethodType instead of setPaymentMethodTypes
            .build();
        return PaymentIntent.create(params);
    }
}
