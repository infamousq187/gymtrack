package rutimur.gymtrack.Controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import rutimur.gymtrack.Model.Exercise;
import rutimur.gymtrack.Service.ExerciseService;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@Tag(name = "Упражнения", description = "CRUD-операции с упражнениями")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    // Только для тренера и админа
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Exercise> addExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseService.addExercise(exercise));
    }

    // Доступно всем авторизованным
    @GetMapping
    public ResponseEntity<List<Exercise>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }

    // Только для тренера и админа
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseService.updateExercise(id, exercise));
    }

    // Только для тренера и админа
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }
}