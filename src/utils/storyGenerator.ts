
// This file simulates AI story generation
// In a real implementation, this would call the OpenAI API

interface StoryContext {
  recentStory: string[];
  character: {
    name: string;
    class: string;
    stats: {
      strength: number;
      dexterity: number;
      intelligence: number;
      charisma: number;
    };
  };
  inventory: string[];
  location: string;
  recentEvents: string[];
}

interface StoryResponse {
  storyText: string;
  newLocation?: string;
  newItems?: string[];
  removedItems?: string[];
}

// Sample responses for different actions
const actionResponses: Record<string, StoryResponse[]> = {
  look: [
    {
      storyText: "You scan your surroundings carefully. The stone walls are adorned with faded tapestries depicting ancient battles. A torch flickers nearby, casting dancing shadows across the floor. You notice a small wooden chest in the corner that you hadn't seen before.",
      newItems: ["Small Wooden Chest"]
    },
    {
      storyText: "The room is dimly lit by shafts of light filtering through cracks in the ceiling. Dust particles dance in the beams. The air smells of old parchment and something vaguely metallic. Near the eastern wall, you spot a glint of metal—a silver key half-buried in debris.",
      newItems: ["Silver Key"]
    }
  ],
  
  explore: [
    {
      storyText: "You venture deeper into the unexplored passageway. The corridor twists and turns, eventually opening into a grand hall with towering columns. Crystal chandeliers hang overhead, somehow still glowing with magical light after all these years. At the far end, you see a statue holding what appears to be a magical orb.",
      newLocation: "Grand Hall",
      newItems: ["Magical Orb"]
    },
    {
      storyText: "Your exploration leads you to a lush garden hidden within stone walls. Despite being underground, plants thrive here, fed by an unknown magical source. Glowing mushrooms provide soft illumination, and in the center bubbles a small spring. This place feels untouched by the corruption that plagues the outer world.",
      newLocation: "Hidden Garden"
    }
  ],
  
  talk: [
    {
      storyText: "\"Well met, traveler,\" says the weathered old man. His eyes betray a wisdom beyond his apparent years. \"These are dark times for our realm. The Crimson Crown has been stolen from the royal vault, and with it, the magical barrier protecting our lands weakens daily. If you seek purpose, perhaps this quest would suit someone of your talents.\"",
    },
    {
      storyText: "The hooded figure leans forward, speaking in hushed tones. \"Not all who wander these parts come with good intentions. Watch for the sign of the serpent. Those who bear it serve the Shadow Guild. They seek the ancient artifacts to perform a ritual that would plunge our world into eternal darkness. I can offer you this charm for protection.\"",
      newItems: ["Protection Charm"]
    }
  ],
  
  fight: [
    {
      storyText: "You ready your weapon as the creature lunges toward you. Its claws slash through the air, but you deftly sidestep the attack. Countering with a strike of your own, you catch it across its flank. The beast howls in pain but doesn't retreat. Instead, its eyes glow with a newfound fury as it prepares for another assault. You'll need to be more careful with your next move.",
    },
    {
      storyText: "The bandit draws his blade with a sneer. \"Bad choice, friend.\" He's quick, but you're quicker. As he lunges, you parry his attack and deliver a decisive blow. He stumbles backward, clutching his wound. \"Enough! Enough...\" he gasps, dropping his weapon. \"Take this and spare me. It's worth more than my life anyway.\" He tosses a jeweled pendant at your feet before fleeing into the shadows.",
      newItems: ["Jeweled Pendant"]
    }
  ],
  
  use: [
    {
      storyText: "You carefully apply the healing potion to your wounds. The liquid tingles as it makes contact with your skin, and you watch in amazement as your injuries begin to close before your eyes. The empty vial crumbles to dust—clearly, its magic was single-use.",
      removedItems: ["Healing Potion"]
    },
    {
      storyText: "You insert the Silver Key into the ancient lock. It fits perfectly. With a turn, you hear a series of clicks and whirrs as long-dormant mechanisms spring to life. The door swings open silently, revealing a treasury that hasn't been disturbed for centuries. Golden coins and precious gems glitter in the light of your torch.",
      newLocation: "Ancient Treasury",
      newItems: ["Gold Coins", "Ruby Necklace"],
      removedItems: ["Silver Key"]
    }
  ]
};

// Default responses when no specific action is matched
const defaultResponses: StoryResponse[] = [
  {
    storyText: "You consider your options carefully. The path ahead isn't clear, but you sense that important decisions await. Your instincts have guided you well so far—perhaps they will continue to serve you in the trials to come."
  },
  {
    storyText: "Time passes as you contemplate your next move. The world around you continues its subtle movements: dust motes floating in sunbeams, the distant call of birds, the rustle of leaves in a gentle breeze. These quiet moments are rare in an adventurer's life."
  }
];

// Location-specific descriptions
const locationDescriptions: Record<string, string[]> = {
  "Training Grounds": [
    "The clash of steel rings out as warriors practice their combat skills. Seasoned veterans shout instructions to new recruits. The smell of sweat and determination fills the air.",
    "Training dummies bear the countless marks of blade strikes and arrow hits. A weapons rack nearby holds an impressive array of practice weapons."
  ],
  "Mage Tower": [
    "Arcane symbols glow faintly on the walls, and the air tingles with magical energy. Books and scrolls are stacked haphazardly on tables and shelves.",
    "A crystal orb sits at the center of the room, occasionally pulsing with blue light. Apprentices whisper to each other as they practice minor cantrips in the corners."
  ],
  "Shadowy Alley": [
    "The narrow passage between buildings blocks most sunlight, creating a perpetual twilight. Footsteps echo strangely here, sometimes seeming to come from impossible directions.",
    "Cloaked figures conduct business in hushed tones. No one makes eye contact for too long. A secret door is visible to your trained eye, hidden within an ordinary-looking wall."
  ],
  "Village Square": [
    "Merchants call out their wares as villagers go about their daily business. The smell of fresh bread wafts from the bakery, while children play games near the central fountain.",
    "Town announcements are posted on a notice board. A group of elders discusses recent events in hushed tones, occasionally glancing at passersby with concern."
  ],
  "Grand Hall": [
    "The ceiling soars overhead, supported by intricately carved columns. Faded banners of ancient houses hang along the walls, telling stories of forgotten nobility.",
    "Your footsteps echo in the vast space. A raised dais at the far end once held a throne, now missing. Something about this place feels important, as if history itself watches you."
  ],
  "Hidden Garden": [
    "Impossibly, butterflies flit between exotic flowers that should not be able to grow underground. The air is clean and fresh, a stark contrast to the musty corridors outside.",
    "A small stone bench sits beside a bubbling spring. The water appears to glow slightly, and you sense it might have healing properties. This peaceful sanctuary feels untouched by time."
  ],
  "Ancient Treasury": [
    "Piles of gold coins reflect your torchlight, creating a dazzling display. Gemstones of every color imaginable are scattered among artifacts of obvious historical significance.",
    "Despite the wealth surrounding you, you feel uneasy. Many of these treasures have magical auras, and disturbing them without understanding their nature could be dangerous."
  ]
};

export const generateStory = async (playerAction: string, context: StoryContext): Promise<StoryResponse> => {
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Process the player's action to determine response type
  const actionLower = playerAction.toLowerCase();
  let responsePool: StoryResponse[] = [];
  
  // Match action to response types
  if (actionLower.includes('look') || actionLower.includes('examine') || actionLower.includes('search')) {
    responsePool = actionResponses.look;
  } else if (actionLower.includes('explore') || actionLower.includes('go') || actionLower.includes('move')) {
    responsePool = actionResponses.explore;
  } else if (actionLower.includes('talk') || actionLower.includes('speak') || actionLower.includes('ask')) {
    responsePool = actionResponses.talk;
  } else if (actionLower.includes('fight') || actionLower.includes('attack') || actionLower.includes('kill')) {
    responsePool = actionResponses.fight;
  } else if (actionLower.includes('use') || actionLower.includes('open') || actionLower.includes('activate')) {
    responsePool = actionResponses.use;
  } else {
    responsePool = defaultResponses;
  }
  
  // Select a random response from the appropriate pool
  let response = responsePool[Math.floor(Math.random() * responsePool.length)];
  
  // Add location-specific flavor if available
  if (context.location && locationDescriptions[context.location]) {
    const locationDesc = locationDescriptions[context.location];
    const randomDesc = locationDesc[Math.floor(Math.random() * locationDesc.length)];
    
    // Sometimes include location descriptions
    if (Math.random() > 0.7) {
      response = {
        ...response,
        storyText: response.storyText + "\n\n" + randomDesc
      };
    }
  }
  
  // In a real implementation, we would call the OpenAI API here
  // const openAIResponse = await callOpenAI(playerAction, context);
  // return processOpenAIResponse(openAIResponse);
  
  return response;
};
