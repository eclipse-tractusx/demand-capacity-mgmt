package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.UserEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserOperationsServiceImpl implements UserOperationsService {

    private final UserRepository repository;

    @Override
    public void updateUser(UserRequest request) {
        Optional<UserEntity> userEntity = repository.findById(UUID.fromString(request.getUserID()));
        if (userEntity.isPresent()) {
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

    @Override
    public List<UserResponse> fetchAllUsers() {
        List<UserEntity> users = repository.findAll();
        List<UserResponse> userResponses = new ArrayList<>();
        for (UserEntity user : users) {
            userResponses.add(convertToDto(user));
        }
        return userResponses;
    }

    private UserResponse convertToDto(UserEntity entity) {
        UserResponse user = new UserResponse();
        user.setUserID(entity.getId().toString());
        user.setEmail(entity.getEmail());
        user.setName(entity.getName());
        eclipse.tractusx.demand_capacity_mgmt_specification.model.Role role = eclipse.tractusx.demand_capacity_mgmt_specification.model.Role.fromValue(
            entity.getRole().name()
        );
        user.setRole(role);
        user.setUsername(entity.getUsername());
        user.setCompanyID(String.valueOf(entity.getCompanyID()));
        user.setLastName(entity.getLastName());
        return user;
    }

}
