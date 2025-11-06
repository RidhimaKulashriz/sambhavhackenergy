import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type UserRole = "admin" | "participant" | "judge";

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setRole(data.role as UserRole);
      }
      setLoading(false);
    };

    fetchRole();
  }, [user]);

  const setUserRole = async (newRole: UserRole) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: newRole });

    if (!error) {
      setRole(newRole);
    }
    return { error };
  };

  return { role, loading, setUserRole };
}
