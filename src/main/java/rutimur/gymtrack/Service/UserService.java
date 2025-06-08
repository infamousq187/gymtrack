package rutimur.gymtrack.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rutimur.gymtrack.DTO.UserProfileDTO;
import rutimur.gymtrack.DTO.UserRegisterDTO;
import rutimur.gymtrack.DTO.UserStatsDTO;
import rutimur.gymtrack.Model.Role;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Model.UserStats;
import rutimur.gymtrack.Repository.UserRepository;
import rutimur.gymtrack.Repository.UserStatsRepository;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private UserStatsRepository userStatsRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserStatsRepository userStatsRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userStatsRepository = userStatsRepository;
    }

    public User registerUser(UserRegisterDTO userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setName(userDto.getName());
        user.setRole(Role.valueOf(userDto.getRole()));
        User savedUser = userRepository.save(user);

        UserStats stats = new UserStats();
        stats.setUser(savedUser);
        stats.setHeight(0);
        stats.setWeight(0);
        stats.setGoal("");
        stats.setWorkouts(0);
        userStatsRepository.save(stats);

        savedUser.setStats(stats);
        return userRepository.save(savedUser);
    }

    public UserProfileDTO getUserProfile(User user) {
        return new UserProfileDTO(user.getName(), user.getId(), user.getRole().name());
    }

    public UserProfileDTO updateUserProfile(User user, UserProfileDTO dto) {
        user.setName(dto.getName());
        // Если нужно, добавьте обновление других полей профиля
        userRepository.save(user);
        return getUserProfile(user);
    }

    public UserStatsDTO updateUserStats(User user, UserStatsDTO dto) {
        UserStats stats = user.getStats();
        if (stats == null) {
            stats = new UserStats();
            stats.setUser(user);
        }
        stats.setHeight(dto.getHeight());
        stats.setWeight(dto.getWeight());
        stats.setGoal(dto.getGoal());
        stats.setWorkouts(dto.getWorkouts());
        userStatsRepository.save(stats);
        return new UserStatsDTO(stats.getHeight(), stats.getWeight(), stats.getGoal(), stats.getWorkouts());
    }

    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContainingIgnoreCase(name);
    }
}