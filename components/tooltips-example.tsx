import { InfoIcon } from "lucide-react" // Import the icon
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Import popover components

export function MetricWithTooltip({ label, value, tooltipText }) {
  return (
    <div className="flex items-center">
      {/* The displayed metric */}
      <span className="text-sm">{label}: {value}</span>
      
      {/* Popover implementation */}
      <Popover>
        {/* The trigger (what you hover/click on) */}
        <PopoverTrigger>
          <InfoIcon className="h-3.5 w-3.5 ml-0.5 text-muted-foreground cursor-pointer" />
        </PopoverTrigger>
        
        {/* The content that appears */}
        <PopoverContent className="w-64 p-2">
          <p className="text-xs">{tooltipText}</p>
        </PopoverContent>
      </Popover>
    </div>
  )
}
