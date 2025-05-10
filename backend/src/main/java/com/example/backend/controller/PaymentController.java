package com.example.backend.controller;

import com.example.backend.dto.PaymentDto;
import com.example.backend.entity.Payment;
import com.example.backend.entity.User;
import com.example.backend.service.PaymentService;
import com.example.backend.service.StripeService;
import com.example.backend.service.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Charge;
import com.stripe.model.PaymentMethod;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserService userService;
    private final StripeService stripeService;

    @PostMapping("/stripe-intent")
    public ResponseEntity<PaymentDto> createIntent(@RequestBody PaymentDto dto) throws StripeException {
        User u = userService.findById(dto.userId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user id"));

        Customer customer = stripeService.createCustomer(u.getEmail());

        // Stripe ID'yi hem kullanıcıya hem ödemeye yaz
        u.setStripeCustomerId(customer.getId());          // ✨ User tablosu için
        userService.save(u);                              // ✨ Güncellemeyi kaydet

        Long amountInCents = dto.amount()
                .multiply(BigDecimal.valueOf(100))
                .longValue();
        PaymentIntent intent = stripeService.createPaymentIntent(amountInCents, dto.currency());

        Payment p = toEntity(dto);
        p.setUser(u);
        p.setStripeCustomerId(customer.getId());
        p.setStripePaymentIntentId(intent.getId());

        if (intent.getPaymentMethod() != null) {
            PaymentMethod pm = PaymentMethod.retrieve(intent.getPaymentMethod());
            PaymentMethod.Card card = pm.getCard();
            if (card != null) {
                p.setCardBrand(card.getBrand());
                p.setCardLastFour(card.getLast4());
                p.setCardExpirationMonth(card.getExpMonth().intValue());
                p.setCardExpirationYear(card.getExpYear().intValue());
            }
        }

        Payment saved = paymentService.save(p);
        return ResponseEntity.ok(toDto(saved));
    }


    @PostMapping
    public ResponseEntity<PaymentDto> create(@RequestBody PaymentDto dto) {
        Payment p = toEntity(dto);
        User u = userService.findById(dto.userId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user id"));
        p.setUser(u);
        p.setStripeCustomerId(dto.stripeCustomerId());
        p.setStripePaymentIntentId(dto.stripePaymentIntentId());

        Payment saved = paymentService.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDto> update(@PathVariable Long id, @RequestBody PaymentDto dto) {
        return paymentService.findById(id)
                .map(existing -> {
                    Payment toSave = toEntity(dto);
                    toSave.setId(id);

                    User u = userService.findById(dto.userId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid user id"));
                    toSave.setUser(u);
                    toSave.setStripeCustomerId(dto.stripeCustomerId());
                    toSave.setStripePaymentIntentId(dto.stripePaymentIntentId());

                    Payment updated = paymentService.save(toSave);
                    return ResponseEntity.ok(toDto(updated));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (paymentService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        paymentService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public List<PaymentDto> listAll() {
        return paymentService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDto> getById(@PathVariable Long id) {
        return paymentService.findById(id)
                .map(p -> ResponseEntity.ok(toDto(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private PaymentDto toDto(Payment p) {
        return new PaymentDto(
                p.getId(),
                p.getPaymentMethod(),
                p.getStripeCustomerId(),
                p.getStripePaymentIntentId(),
                p.getCardLastFour(),
                p.getCardBrand(),
                p.getCardExpirationMonth(),
                p.getCardExpirationYear(),
                p.getAmount(),
                p.getCurrency(),
                p.getStatus(),
                p.getUser().getId()
        );
    }

    private Payment toEntity(PaymentDto d) {
        Payment p = new Payment();
        p.setPaymentMethod(d.paymentMethod());
        p.setCardLastFour(d.cardLastFour());
        p.setCardBrand(d.cardBrand());
        p.setCardExpirationMonth(d.cardExpirationMonth());
        p.setCardExpirationYear(d.cardExpirationYear());
        p.setAmount(d.amount());
        p.setCurrency(d.currency());
        p.setStatus(d.status());
        return p;
    }
}
