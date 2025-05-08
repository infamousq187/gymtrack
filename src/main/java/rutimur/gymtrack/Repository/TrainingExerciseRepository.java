package rutimur.gymtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rutimur.gymtrack.Model.TrainingExercise;

public interface TrainingExerciseRepository extends JpaRepository<TrainingExercise, Long> {
}