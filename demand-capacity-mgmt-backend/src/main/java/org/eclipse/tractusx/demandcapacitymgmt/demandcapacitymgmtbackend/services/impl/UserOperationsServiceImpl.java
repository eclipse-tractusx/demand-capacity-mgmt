package org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.impl;

import eclipse.tractusx.demand_capacity_mgmt_specification.model.LoggingHistoryRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserRequest;
import eclipse.tractusx.demand_capacity_mgmt_specification.model.UserResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.UserEntity;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventObjectType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.EventType;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.entities.enums.Role;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.repositories.UserRepository;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.LoggingHistoryService;
import org.eclipse.tractusx.demandcapacitymgmt.demandcapacitymgmtbackend.services.UserOperationsService;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserOperationsServiceImpl implements UserOperationsService {

    private final UserRepository repository;
    private final LoggingHistoryService loggingHistoryService;

    private void postLogs(String userId, String action) {
        LoggingHistoryRequest loggingHistoryRequest = new LoggingHistoryRequest();
        loggingHistoryRequest.setObjectType(EventObjectType.USER.name());
        loggingHistoryRequest.setEventType(EventType.GENERAL_EVENT.toString());
        loggingHistoryRequest.setIsFavorited(false);

        if ("post".equals(action)) {
            loggingHistoryRequest.setEventDescription("User Created - ID: " + userId);
        } else if ("delete".equals(action)) {
            loggingHistoryRequest.setEventDescription("User Deleted - ID: " + userId);
        } else if ("put".equals(action)) {
            loggingHistoryRequest.setEventDescription("User Updated - ID: " + userId);
        }
        loggingHistoryService.createLog(loggingHistoryRequest);
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        UserEntity user = new UserEntity();
        user.setRole(Role.valueOf(request.getRole().name()));
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setCompanyID(UUID.fromString(request.getCompanyID()));
        repository.save(user);
        postLogs(request.getUserID(), "post");

        return convertToDto(user);
    }

    @Override
    public UserResponse updateUser(String userID, UserRequest request) {
        Optional<UserEntity> userEntity = repository.findById(UUID.fromString(userID));

        UserEntity user = userEntity.get();
        user.setRole(Role.valueOf(request.getRole().name()));
        user.setUsername(request.getUsername());
        user.setName(request.getName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setCompanyID(UUID.fromString(request.getCompanyID()));
        repository.save(user);
        postLogs(request.getUserID(), "put");

        return convertToDto(user);
    }

    @Override
    public void deleteUser(String userId) {
        Optional<UserEntity> userEntity = repository.findById(UUID.fromString(userId));
        if (userEntity.isPresent()) {
            UserEntity user = userEntity.get();
            repository.delete(user);
            postLogs(userId, "delete");
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
