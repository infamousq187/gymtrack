package rutimur.gymtrack.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import rutimur.gymtrack.DTO.UserProfileDTO;
import rutimur.gymtrack.DTO.UserStatsDTO;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Model.UserStats;
import rutimur.gymtrack.Repository.UserRepository;
import rutimur.gymtrack.Service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@Tag(name = "Пользователь", description = "Операции с профилем пользователя")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Operation(
            summary = "Получить свой профиль",
            description = "Возвращает имя и роль текущего пользователя"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Профиль успешно получен"),
            @ApiResponse(responseCode = "401", description = "Пользователь не авторизован")
    })
    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getMyProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserProfile(user));
    }

    @Operation(
            summary = "Получить показатели пользователя",
            description = "Возвращает рост, вес, цель и количество тренировок текущего пользователя"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Показатели успешно получены"),
            @ApiResponse(responseCode = "401", description = "Пользователь не авторизован")
    })
    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats(@AuthenticationPrincipal User user) {
        // Предполагается, что user.getStats() не null. Если может быть null — добавь обработку.
        UserStats stats = user.getStats();
        if (stats == null) {
            // Возвращаем объект с нулями
            return ResponseEntity.ok(new UserStatsDTO(0, 0, "", 0));
        }
        // DTO чтобы не возвращать всю сущность (например, id и user)
        UserStatsDTO dto = new UserStatsDTO(
                stats.getHeight(),
                stats.getWeight(),
                stats.getGoal(),
                stats.getWorkouts()
        );
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDTO> updateMyProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserProfileDTO profileDTO
    ) {
        UserProfileDTO updated = userService.updateUserProfile(user, profileDTO);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/stats")
    public ResponseEntity<UserStatsDTO> updateUserStats(
            @AuthenticationPrincipal User user,
            @RequestBody UserStatsDTO statsDTO
    ) {
        UserStatsDTO updated = userService.updateUserStats(user, statsDTO);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('COACH', 'ADMIN')")
    public ResponseEntity<List<UserProfileDTO>> searchUsersByName(@RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        List<UserProfileDTO> result = users.stream()
                .map(userService::getUserProfile)
                .toList();
        return ResponseEntity.ok(result);
    }
}