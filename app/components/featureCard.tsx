import { ArrowRight, Play, Brain, BarChart3, Gauge, Activity } from "lucide-react";
const icons = {
    Gauge: Gauge,
    Brain: Brain,
    Activity: Activity,
    BarChart3: BarChart3,
    Play: Play,
    ArrowRight: ArrowRight,
};
type IconName = keyof typeof icons;
type FeatureCardProps = {
    icon: IconName;
    title: string;
    desc: string;
};
export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
    const IconComponent = icons[icon as IconName];

    return (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">

            <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f1edff] text-[#7c3aed]">
                {IconComponent && <IconComponent className="h-4 w-4" />}
            </div>

            <h3 className="mt-4 text-base font-semibold">{title}</h3>

            <p className="mt-2 text-sm text-black/60">
                {desc}
            </p>

        </div>
    );
}

    
        