package com.vividhita.interview_queue.config;

import com.vividhita.interview_queue.model.Admin;
import com.vividhita.interview_queue.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (adminRepository.findByUsername("admin").isEmpty()) {

                Admin admin = new Admin();

                admin.setUsername("admin");

                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );

                adminRepository.save(admin);

                System.out.println("Default admin account created.");
            }
        };
    }
}