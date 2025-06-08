package rutimur.gymtrack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rutimur.gymtrack.Model.User;
import rutimur.gymtrack.Model.UserStats;

public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    UserStats findByUser(User user);
}