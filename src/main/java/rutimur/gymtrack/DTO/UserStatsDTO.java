package rutimur.gymtrack.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatsDTO {
    private Integer height;
    private Integer weight;
    private String goal;
    private Integer workouts;

}