
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Character } from '@/contexts/GameContext';
import { Sword, Book, Compass } from 'lucide-react';

const characterSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  class: z.string().min(1, {
    message: "Please select a class.",
  }),
});

interface CharacterCreationProps {
  onCreateCharacter: (character: Character) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onCreateCharacter }) => {
  const form = useForm<z.infer<typeof characterSchema>>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      class: "",
    },
  });

  const [characterStats, setCharacterStats] = useState({
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    charisma: 10,
  });

  const updateStats = (characterClass: string) => {
    switch (characterClass) {
      case "warrior":
        setCharacterStats({
          strength: 14,
          dexterity: 12,
          intelligence: 8,
          charisma: 10,
        });
        break;
      case "mage":
        setCharacterStats({
          strength: 8,
          dexterity: 10,
          intelligence: 14,
          charisma: 12,
        });
        break;
      case "rogue":
        setCharacterStats({
          strength: 10,
          dexterity: 14,
          intelligence: 12,
          charisma: 8,
        });
        break;
      default:
        setCharacterStats({
          strength: 10,
          dexterity: 10,
          intelligence: 10,
          charisma: 10,
        });
    }
  };

  const onSubmit = (data: z.infer<typeof characterSchema>) => {
    const character: Character = {
      name: data.name,
      class: data.class.charAt(0).toUpperCase() + data.class.slice(1),
      stats: characterStats,
    };
    onCreateCharacter(character);
  };

  const handleClassChange = (value: string) => {
    form.setValue('class', value);
    updateStats(value);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border border-accent/20 shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-cinzel text-secondary">StoryForge</CardTitle>
          <CardDescription className="text-muted-foreground">Create your character to begin your adventure</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your character's name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character Class</FormLabel>
                    <Select onValueChange={handleClassChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warrior" className="flex items-center">
                          <div className="flex items-center gap-2">
                            <Sword className="h-4 w-4 text-red-400" />
                            <span>Warrior</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="mage">
                          <div className="flex items-center gap-2">
                            <Book className="h-4 w-4 text-blue-400" />
                            <span>Mage</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rogue">
                          <div className="flex items-center gap-2">
                            <Compass className="h-4 w-4 text-green-400" />
                            <span>Rogue</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch('class') && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-2">Starting Stats</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Strength: {characterStats.strength}</div>
                    <div>Dexterity: {characterStats.dexterity}</div>
                    <div>Intelligence: {characterStats.intelligence}</div>
                    <div>Charisma: {characterStats.charisma}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
              >
                Begin Adventure
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CharacterCreation;
