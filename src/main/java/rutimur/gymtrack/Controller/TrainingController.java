package rutimur.gymtrack.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import rutimur.gymtrack.DTO.ExerciseStatPoint;
import rutimur.gymtrack.Model.Training;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Service.TrainingService;

import java.util.List;

@Tag(name = "Тренировки", description = "Создание и просмотр тренировок, статистика")
@RestController
@RequestMapping("/api/trainings")
public class TrainingController {

    @Autowired
    private TrainingService trainingService;

    // Создать тренировку
    @PostMapping
    public ResponseEntity<Training> createTraining(@RequestBody Training training, @AuthenticationPrincipal User user) {
        training.setUser(user);
        return ResponseEntity.ok(trainingService.saveTraining(training));
    }

    // Получить свои тренировки
    @GetMapping("/my")
    public ResponseEntity<List<Training>> getMyTrainings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(trainingService.getTrainingsByUser(user));
    }

    @GetMapping("/stats/{exerciseId}")
    public ResponseEntity<List<ExerciseStatPoint>> getExerciseStats(
            @PathVariable Long exerciseId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(trainingService.getExerciseStatsForUser(user, exerciseId));
    }
}