import { LucideIcon } from "lucide-react";

interface stateCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}
export function StatCard({
    title,
    value,
    icon:Icon,
    iconColor,
    iconBgColor
}: stateCardProps){
    return(
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
                <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-xs text-gray-500">{title}</p>
        </div>
    );
}