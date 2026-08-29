import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
    'const [hasEntered, setHasEntered] = useState(false);',
    `const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem("hasEntered") === "true";
  });`
);

code = code.replace(
    'setHasEntered(true);',
    `setHasEntered(true);
              sessionStorage.setItem("hasEntered", "true");`
);

fs.writeFileSync('src/App.tsx', code);
console.log("App fixed");
