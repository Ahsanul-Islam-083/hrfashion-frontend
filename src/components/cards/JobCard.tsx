import Link from "next/link";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";

interface JobCardProps {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export function JobCard({
  _id,
  title,
  department,
  location,
  type,
  description,
}: JobCardProps) {
  return (
    <div className="group flex flex-col bg-background rounded-sm border border-neutral-200 dark:border-neutral-800 p-6 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-serif text-xl line-clamp-1">{title}</h3>
        <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-xs font-medium uppercase tracking-widest rounded-sm whitespace-nowrap">
          {type.replace("-", " ")}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4 uppercase tracking-widest">
        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {department}</span>
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
      </div>
      
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-8 line-clamp-3 flex-1">
        {description}
      </p>
      
      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto">
        <Link 
          href={`/careers/${_id}`}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest hover:text-neutral-500 transition-colors"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
