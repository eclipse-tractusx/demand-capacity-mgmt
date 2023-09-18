package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetController {

    @GetMapping("/public/")
    private String test(){
        return "Public Endpoint";
    }

    @GetMapping("/greet/secure/")
    private String secureTest() {
        return "Secure Endpoint";
    }
}
