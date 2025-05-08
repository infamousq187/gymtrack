package rutimur.gymtrack.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Repository.UserRepository;
import rutimur.gymtrack.Security.JwtUtil;
import rutimur.gymtrack.Service.UserService;

import java.util.Optional;

@Tag(name = "Аутентификация", description = "Регистрация и вход пользователей")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private final UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User createdUser = userService.registerUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
                return ResponseEntity.ok().body(token);
            }
        }
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}