const fs = require('fs');
let code = fs.readFileSync('src/components/CakeGame.tsx', 'utf8');

// replace useEffect mount to load quests
code = code.replace(
  '  useEffect(() => {\n    const savedCoins = localStorage.getItem("coffee_game_coins");',
  `  useEffect(() => {
    const savedQuests = localStorage.getItem("cake_game_quests");
    if (savedQuests) {
      try {
        setQuests(JSON.parse(savedQuests));
      } catch (e) {}
    }

    const savedCoins = localStorage.getItem("coffee_game_coins");`
);

// replace setQuests in updateQuestProgress
code = code.replace(
  '    setQuests((prev) =>',
  `    setQuests((prev) => {
      const next = prev.map((q) => {
        if (q.type === type && !q.isCompleted) {
          const newProg = Math.min(q.target, q.progress + amount);
          return {
            ...q,
            progress: newProg,
            isCompleted: newProg >= q.target
          };
        }
        return q;
      });
      localStorage.setItem("cake_game_quests", JSON.stringify(next));
      return next;
    });
    // @ts-ignore` // Just to absorb the previous setQuests pattern
);

code = code.replace(
  '// @ts-ignore\n      prev.map((q) => {',
  '      /* prev.map */' // Wait, simple replace is safer. Let's just use sed or standard replace.
);

fs.writeFileSync('src/components/CakeGame.tsx', code);
