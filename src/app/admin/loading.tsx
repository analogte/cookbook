import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AdminLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Stats skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="h-12 w-12 rounded-lg bg-charcoal-200" />
                            <div className="space-y-2">
                                <div className="h-4 w-20 rounded bg-charcoal-200" />
                                <div className="h-6 w-12 rounded bg-charcoal-200" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <div className="h-6 w-32 rounded bg-charcoal-200" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2, 3, 4, 5].map((j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-charcoal-200" />
                                        <div className="space-y-1">
                                            <div className="h-4 w-32 rounded bg-charcoal-200" />
                                            <div className="h-3 w-20 rounded bg-charcoal-200" />
                                        </div>
                                    </div>
                                    <div className="h-4 w-12 rounded bg-charcoal-200" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Loading indicator */}
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <span className="ml-2 text-charcoal-500">กำลังโหลด...</span>
            </div>
        </div>
    );
}
