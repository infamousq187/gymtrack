package rutimur.gymtrack.Controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import rutimur.gymtrack.DTO.UserProfileDTO;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Service.UserService;

@RestController
@RequestMapping("/api/user")
@Tag(name = "Пользователь", description = "Операции с профилем пользователя")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

//    @PostMapping("/register")
//    public ResponseEntity<User> registerUser(@RequestBody User user) {
//        User createdUser = userService.registerUser(user);
//        return ResponseEntity.ok(createdUser);
//    }

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
}