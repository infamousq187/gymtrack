package rutimur.gymtrack.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

/* Пусть пользователь выбирает упражнение (например, "Жим лёжа"), а бэк возвращает список пар "дата — вес". */

@Data
@AllArgsConstructor
public class ExerciseStatPoint {
    private LocalDate date;
    private double weight;
}