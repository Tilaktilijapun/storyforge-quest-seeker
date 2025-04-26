
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '@/contexts/GameContext';
import { Shield, Sword, Book, Heart } from 'lucide-react';

interface CharacterSheetProps {
  character: Character;
  inventory: string[];
  location: string;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, inventory, location }) => {
  return (
    <Card className="bg-card/90 backdrop-blur-sm border border-accent/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-cinzel flex justify-between items-center">
          <span>{character.name}</span>
          <span className="text-secondary text-sm">{character.class}</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground font-inter">Current Location: {location}</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <Sword className="h-4 w-4 text-red-400" />
            <span className="text-sm">STR: {character.stats.strength}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm">DEX: {character.stats.dexterity}</span>
          </div>
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-purple-400" />
            <span className="text-sm">INT: {character.stats.intelligence}</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-400" />
            <span className="text-sm">CHA: {character.stats.charisma}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-1 font-cinzel">Inventory</h4>
          {inventory.length > 0 ? (
            <ul className="text-xs space-y-1 pl-2 font-inter">
              {inventory.map((item, index) => (
                <li key={index} className="text-muted-foreground">• {item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">Empty</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterSheet;
