import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";

type Props = {
  content: string | undefined;
};

const TooltipInput = ({ children, content }: PropsWithChildren<Props>) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        {/* Only allow trigger if content exists - rather than rerendering input! */}
        {content ? (
          <TooltipTrigger asChild>{children}</TooltipTrigger>
        ) : (
          children
        )}
        <TooltipContent>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipInput;
