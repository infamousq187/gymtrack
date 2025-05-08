package rutimur.gymtrack.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "training_exercises")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingExercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "training_id")
    private Training training;

    @ManyToOne
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    private int sets;      // Количество подходов
    private int reps;      // Количество повторений
    private double weight; // Вес
}