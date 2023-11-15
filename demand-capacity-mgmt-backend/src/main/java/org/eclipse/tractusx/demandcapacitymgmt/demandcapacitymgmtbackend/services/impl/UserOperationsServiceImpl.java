package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.UserEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserOperationsServiceImpl implements UserOperationsService {

    private final UserRepository repository;

    @Override
    public void updateUser(UserRequest request) {
        Optional<UserEntity> userEntity = repository.findById(UUID.fromString(request.getUserID()));
        if(userEntity.isPresent()){
            UserEntity user = userEntity.get();
            user.setRole(Role.valueOf(request.getRole().name()));
            user.setUsername(request.getUsername());
            user.setName(request.getName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setCompanyID(UUID.fromString(request.getCompanyID()));
            repository.save(user);
        }
    }
}
