import { authAPI } from "../api/auth";
import ExercisesAdmin from "./ExercisesAdmin";
import ExercisesList from "./ExercisesList";

export default function ExercisesSwitcher() {
  return authAPI.isCoach() ? <ExercisesAdmin /> : <ExercisesList />;
} 