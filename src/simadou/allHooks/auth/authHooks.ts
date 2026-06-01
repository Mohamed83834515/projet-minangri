// hooks/useLoginMutation.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { authService, LoginCredentials, ResetLinkCredentials, ResetPasswordCredentials } from "@/simadou/allSercices/authService";
import { jwtDecode } from 'jwt-decode'
import { ChangePasswordFormData } from "@/simadou/schemas/auth.schemas";
import { tokenManager } from '@/axios/api'
import { toast } from "sonner";
import { handleApiError } from "@/axios/handleError";
import { personnelKeys } from "../personnel/personnelHooks";
import { personnelService } from "@/simadou/allSercices/personnelService";


export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: personnelKeys.me(),
    queryFn: async () => {
      const token = tokenManager.getAccessToken()
      if (!token) return null
      const userId = getUserIdFromToken(token)
      if (!userId) return null
      return personnelService.getById(userId)
    },
    enabled: isAuthenticated, // ← automatic, no manual flag needed
    staleTime: 1000 * 60 * 5,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const search = useSearch({ from: '/(auth)/sign-in' })
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),

    onSuccess: async (data) => {
      tokenManager.setTokens(data.access, data.refresh)

      login()



      toast.success("Connexion réussie")

      navigate({
        to: search.redirect ?? '/',
        replace: true,
      })

      await queryClient.invalidateQueries({
        queryKey: personnelKeys.me(),
      })
    },

    // TODO : Update the error shape (detail to message)

    onError: (error) => {
      toast.error(error.message)
      handleApiError(error);
    },

  })
}

interface TokenPayload {
  exp: number
  user_id: number
}

export const getUserIdFromToken = (
  token: string
): number | null => {
  try {
    const decoded = jwtDecode<TokenPayload>(token)

    return decoded.user_id
  } catch {
    return null
  }
}







export function useLogout() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),

    onSettled: () => {
      logout()

      queryClient.clear()
      navigate({ to: '/sign-in', replace: true })
    },
  })
}







export function useChangePasswordMutation() {


  return useMutation({
    mutationFn: async ({ data, userId }: { data: ChangePasswordFormData, userId: number }) => {
      await authService.changePassword(userId, {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword,
      })
    },
    onSuccess: () => {
      toast.success('Mot de passe modifié avec succès')
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}


export function useResetLinkMutation() {


  return useMutation({
  mutationFn: async ({ data }: { data: ResetLinkCredentials }) => {
      await authService.reset_link(data)
    },
    onSuccess: () => {
      toast.success('Email de réinitialisation envoyé avec succès')
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}

export function useResetPasswordMutation() {


  return useMutation({
  mutationFn: async ({ data }: { data: ResetPasswordCredentials }) => {
      await authService.reset_password(data)
    },
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès')
    },
    onError: (error) => {
      handleApiError(error)
    },
  })
}





