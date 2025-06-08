package rutimur.gymtrack.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rutimur.gymtrack.DTO.ExerciseStatPoint;
import rutimur.gymtrack.Model.Training;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Repository.TrainingRepository;
import rutimur.gymtrack.Repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainingService {

    @Autowired
    private TrainingRepository trainingRepository;

    @Autowired
    private UserRepository userRepository;

    public Training saveTraining(Training training) {
        return trainingRepository.save(training);
    }

    public List<Training> getTrainingsByUser(User user) {
        return trainingRepository.findByUserId(user.getId());
    }

    public List<Training> getAllTrainings() {
        return trainingRepository.findAll();
    }

    public List<ExerciseStatPoint> getExerciseStatsForUser(User user, Long exerciseId) {
        List<Training> trainings = trainingRepository.findByUser(user);

        return trainings.stream()
                .flatMap(training -> training.getExercises().stream()
                        .filter(te -> te.getExercise().getId().equals(exerciseId))
                        .map(te -> new ExerciseStatPoint(training.getDate(), te.getWeight()))
                )
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }
}
