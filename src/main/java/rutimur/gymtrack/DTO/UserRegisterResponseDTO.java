package rutimur.gymtrack.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegisterResponseDTO {
    private String username;
    private String name;
    private String role;
}