
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

interface ActionInputProps {
  onSubmitAction: (action: string) => void;
  isLoading: boolean;
}

const ActionInput: React.FC<ActionInputProps> = ({ onSubmitAction, isLoading }) => {
  const [action, setAction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action.trim()) {
      onSubmitAction(action.trim());
      setAction('');
    }
  };

  // Quick actions for common commands
  const quickActions = [
    { label: "Look around", action: "look around" },
    { label: "Explore", action: "explore this area" },
    { label: "Inventory", action: "check my inventory" }
  ];

  const handleQuickAction = (quickAction: string) => {
    onSubmitAction(quickAction);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="What do you want to do?"
          className="font-inter bg-muted/50"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !action.trim()} 
          className="bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {quickActions.map((qa) => (
          <Button
            key={qa.label}
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction(qa.action)}
            disabled={isLoading}
            className="font-inter text-xs bg-muted/30 hover:bg-muted/50"
          >
            {qa.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ActionInput;
