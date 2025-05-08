package rutimur.gymtrack.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import rutimur.gymtrack.Model.Exercise;
import rutimur.gymtrack.Model.Role;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Repository.UserRepository;
import rutimur.gymtrack.Security.JwtUtil;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String trainerToken;

    @BeforeEach
    void setUp() {
        // Создаём тренера и получаем токен
        User trainer = new User();
        trainer.setUsername("trainer1");
        trainer.setPassword("$2a$10$7Qw..."); // захешированный пароль, можно любой, если не проверяешь пароль
        trainer.setName("Trainer One");
        trainer.setRole(Role.TRAINER);
        userRepository.save(trainer);

        trainerToken = jwtUtil.generateToken(trainer.getUsername(), trainer.getRole().name());
    }

    @Test
    void testAddAndGetExercise() throws Exception {
        Exercise exercise = new Exercise();
        exercise.setName("Жим лёжа");
        exercise.setDescription("Классическое упражнение на грудные");

        // Добавить упражнение (только тренер)
        mockMvc.perform(post("/api/exercises")
                        .header("Authorization", "Bearer " + trainerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(exercise)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Жим лёжа"));

        // Получить список упражнений (доступно всем авторизованным)
        mockMvc.perform(get("/api/exercises")
                        .header("Authorization", "Bearer " + trainerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Жим лёжа"));
    }
}