package rutimur.gymtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rutimur.gymtrack.Model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
