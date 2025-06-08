package rutimur.gymtrack.Model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "stats")
@EqualsAndHashCode(exclude = "stats")
@Table(name = "users")
public class User {
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserStats stats;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String name;

    @Enumerated(EnumType.STRING)
    private Role role;
}