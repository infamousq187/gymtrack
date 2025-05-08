package rutimur.gymtrack.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import rutimur.gymtrack.Model.Exercise;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    boolean existsByName(String name);
}