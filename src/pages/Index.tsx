
import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import StoryDisplay from '@/components/StoryDisplay';
import ActionInput from '@/components/ActionInput';
import CharacterSheet from '@/components/CharacterSheet';
import GameControls from '@/components/GameControls';
import CharacterCreation from '@/components/CharacterCreation';
import { useToast } from '@/components/ui/toast';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const GameInterface: React.FC = () => {
  const { state, sendAction, resetGame, saveGame, loadGame } = useGame();
  const { toast } = useToast();
  const [hasSavedGame, setHasSavedGame] = useState(false);

  // Check for saved game
  useEffect(() => {
    const savedGame = localStorage.getItem('storyforge-quest-save');
    setHasSavedGame(!!savedGame);
  }, [state.gameStarted]);

  const handleSendAction = async (action: string) => {
    await sendAction(action);
  };

  const handleGameLoad = () => {
    loadGame();
    toast({
      title: "Game Loaded",
      description: "Your saved game has been loaded successfully!",
    });
  };

  const handleGameReset = () => {
    resetGame();
    toast({
      title: "Game Reset",
      description: "Your game has been reset. Start a new adventure!",
    });
  };

  if (!state.gameStarted || !state.hasCharacter) {
    return <CharacterCreation onCreateCharacter={(character) => state.createCharacter(character)} />;
  }

  return (
    <div className="game-container min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-cinzel text-center mb-2 text-secondary">
            StoryForge
          </h1>
          <p className="text-center text-muted-foreground font-inter">
            Your adventure awaits, {state.character.name} the {state.character.class}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <StoryDisplay storyParts={state.story} />
            <ActionInput 
              onSubmitAction={handleSendAction} 
              isLoading={state.isLoading}
            />
          </div>
          
          <div className="space-y-4">
            <CharacterSheet 
              character={state.character}
              inventory={state.inventory}
              location={state.location}
            />
            
            <Card className="bg-card/90 backdrop-blur-sm border border-accent/20">
              <CardHeader className="pb-2">
                <h3 className="text-lg font-cinzel">Recent Events</h3>
              </CardHeader>
              <CardContent>
                {state.recentEvents.length > 0 ? (
                  <ul className="space-y-2 text-sm">
                    {state.recentEvents.map((event, index) => (
                      <li key={index} className="text-muted-foreground">• {event}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Your adventure is just beginning...</p>
                )}
              </CardContent>
            </Card>
            
            <GameControls
              onSave={saveGame}
              onLoad={handleGameLoad}
              onReset={handleGameReset}
              hasSavedGame={hasSavedGame}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameInterface />
    </GameProvider>
  );
};

export default Index;
