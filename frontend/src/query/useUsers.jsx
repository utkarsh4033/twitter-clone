import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/userApi";

export const useAllUsers = (token) =>
  useQuery({
    queryKey: ["allUsers"],
    queryFn: () => getAllUsers(token),
    enabled: !!token,
    select: (res) => res.data,
  });
