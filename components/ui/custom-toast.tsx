import { toast } from "sonner"
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error" | "warning" | "info"

interface CustomToastProps {
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

const icons = {
  success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
}

const styles = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
}

export const customToast = ({
  title,
  description,
  type = "info",
  duration = 5000,
}: CustomToastProps) => {
  toast.custom(
    (t) => (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300",
          styles[type],
          t.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
    ),
    {
      duration,
      position: "top-right",
    }
  )
} 