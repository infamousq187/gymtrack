package rutimur.gymtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rutimur.gymtrack.Model.Training;
import rutimur.gymtrack.Model.User;

import java.util.List;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findByUser(User user);
}