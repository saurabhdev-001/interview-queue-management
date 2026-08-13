package com.vividhita.interview_queue.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // PUBLIC ADMIN LOGIN
                        // =========================

                        .requestMatchers(
                                "/admin/login.html"
                        ).permitAll()


                        // =========================
                        // ADMIN API OPERATIONS
                        // =========================

                        .requestMatchers(
                                "/api/queue/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/candidates/next"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/candidates/*/complete"
                        ).hasRole("ADMIN")


                        // =========================
                        // ADMIN PAGES
                        // =========================

                        .requestMatchers(
                                "/admin/**"
                        ).hasRole("ADMIN")


                        // =========================
                        // PUBLIC STUDENT UI
                        // =========================

                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/css/**",
                                "/js/**"
                        ).permitAll()


                        // =========================
                        // PUBLIC STUDENT APIs
                        // =========================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/candidates"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/candidates/waiting"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/candidates/*"
                        ).permitAll()


                        // Everything else
                        .anyRequest().authenticated()
                )

                .csrf(csrf -> csrf.disable())

                .httpBasic(Customizer.withDefaults())

                .formLogin(form -> form
                        .loginPage("/admin/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/admin/dashboard.html", true)
                        .failureUrl("/admin/login.html?error=true")
                        .permitAll()
                )

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/admin/login.html?logout=true")
                        .permitAll()
                );

        return http.build();
    }
}