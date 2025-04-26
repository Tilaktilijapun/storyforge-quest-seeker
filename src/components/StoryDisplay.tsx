
import React, { useRef, useEffect } from 'react';

interface StoryDisplayProps {
  storyParts: string[];
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyParts }) => {
  const storyEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the bottom when new story content is added
  useEffect(() => {
    if (storyEndRef.current) {
      storyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [storyParts]);

  return (
    <div className="scroll-background rounded-lg p-6 h-[500px] overflow-y-auto text-black">
      {storyParts.map((part, index) => (
        <div key={index} className={`mb-4 ${part.startsWith('>') ? 'text-primary font-semibold italic' : ''}`}>
          {part.startsWith('>') ? (
            // Player input
            <p>{part}</p>
          ) : (
            // Story text
            <div className="space-y-2 font-lora leading-relaxed">
              {part.split('\n\n').map((paragraph, pIndex) => (
                <p key={`${index}-${pIndex}`}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
      ))}
      <div ref={storyEndRef} />
    </div>
  );
};

export default StoryDisplay;
