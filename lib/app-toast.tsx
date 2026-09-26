"use client"

import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"

type ToastOptions = {
  description?: string
  id?: string | number
}

const iconClassName = "size-4"

export const appToast = {
  success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      description: options?.description,
      id: options?.id,
      icon: <CheckCircle2 className={iconClassName} />,
    })
  },
  error(message: string, options?: ToastOptions) {
    return toast.error(message, {
      description: options?.description,
      id: options?.id,
      icon: <AlertCircle className={iconClassName} />,
    })
  },
  info(message: string, options?: ToastOptions) {
    return toast(message, {
      description: options?.description,
      id: options?.id,
      icon: <Info className={iconClassName} />,
    })
  },
  loading(message: string, options?: ToastOptions) {
    return toast.loading(message, {
      description: options?.description,
      id: options?.id,
      icon: <Loader2 className={`${iconClassName} animate-spin`} />,
    })
  },
  dismiss(id?: string | number) {
    toast.dismiss(id)
  },
}
