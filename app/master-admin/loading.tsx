import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"

export default function MasterAdminLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <h1 className="text-3xl font-bold">Master Admin Dashboard</h1>
        </div>
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Main Content */}
      <div className="w-full">
        <Skeleton className="h-10 w-64 mb-4" />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[100px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>

            <div className="rounded-md border">
              <div className="h-10 border-b px-4 flex items-center">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex-1">
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
              </div>

              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="h-16 border-b px-4 flex items-center">
                    {Array(6)
                      .fill(0)
                      .map((_, j) => (
                        <div key={j} className="flex-1">
                          <Skeleton className="h-4 w-20" />
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
