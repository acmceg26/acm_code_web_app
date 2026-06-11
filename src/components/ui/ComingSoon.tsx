import React from 'react';
import { Hourglass } from 'lucide-react';

interface ComingSoonProps {
  /** Optional subtitle shown below the "Coming Soon" heading. */
  message?: string;
}

/**
 * Reusable Coming Soon placeholder.
 *
 * Usage:
 *   <ComingSoon message="This section is being set up." />
 */
export const ComingSoon: React.FC<ComingSoonProps> = ({
  message = 'This section is being set up. Check back soon!',
}) => (
  <div className="flex flex-col items-center justify-center py-24 gap-6">
    {/* Animated ring + icon */}
    <div className="relative flex items-center justify-center">
      <span className="absolute w-24 h-24 rounded-full border border-zinc-700 animate-ping opacity-20" />
      <span className="absolute w-16 h-16 rounded-full border border-zinc-600 animate-ping opacity-30 [animation-delay:400ms]" />
      <div className="relative w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg">
        <Hourglass className="w-6 h-6 text-zinc-300 animate-pulse" />
      </div>
    </div>

    {/* Text */}
    <div className="text-center space-y-1.5">
      <h3 className="text-base font-semibold text-zinc-100">Coming Soon</h3>
      <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">{message}</p>
    </div>
  </div>
);
