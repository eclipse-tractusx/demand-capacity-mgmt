/*
 * Copyright (c) 2024-25 Smart Sense Consulting Solutions Pvt. Ltd.
 */
package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.appinfo;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record InfoConfiguration(String name, String description, String version) {}
