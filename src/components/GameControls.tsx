
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

interface GameControlsProps {
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
  hasSavedGame: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  onSave, 
  onLoad, 
  onReset,
  hasSavedGame 
}) => {
  const { toast } = useToast();

  const handleSave = () => {
    onSave();
    toast({
      title: "Game Saved",
      description: "Your progress has been saved successfully!",
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSave}
        className="font-inter text-xs"
      >
        Save Game
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onLoad}
        disabled={!hasSavedGame}
        className="font-inter text-xs"
      >
        Load Game
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="font-inter text-xs"
          >
            Reset Game
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reset your current game progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onReset}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GameControls;
