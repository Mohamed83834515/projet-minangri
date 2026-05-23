import { AxiosError } from "axios"
import toast from "react-hot-toast"

type ApiErrorResponse = {
  message?: string
  error?: string
}

export function handleApiError(error: unknown, fallbackMessage?: string) {
  let message = fallbackMessage || "Une erreur est survenue"

  if (error && typeof error === "object") {
    const axiosError = error as AxiosError<ApiErrorResponse>

    if (axiosError.response?.data) {
      message =
        axiosError.response.data.message ||
        axiosError.response.data.error ||
        message
    } else if (axiosError.message) {
      message = axiosError.message
    }
  }

  toast.error(message)
}




