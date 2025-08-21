/**
 * Splitter Script
 * - Normalizes Jon Suh Hamburger Animations
 * - Makes each animation standalone like slider.css
 * - Adds Squarespace-friendly hover/active states
 * - Adds default thickness, color, and speed variables
 * - Writes output CSS files under src/
 */

const fs = require("fs");
const path = require("path");

// Correct paths: go up one level from scripts/ to project root
const inputPath = path.join(__dirname, "..", "src", "hamburgers.css");
const outputDir = path.join(__dirname, "..", "src");

// Check if input exists
if (!fs.existsSync(inputPath)) {
  console.error("❌ hamburgers.css not found in src/");
  process.exit(1);
}

// Read full CSS
const inputCss = fs.readFileSync(inputPath, "utf8");

// Split by animation headers (each block starts with /* ... */)
const animations = inputCss.split("/*").slice(1);

animations.forEach((block) => {
  // Extract animation name (e.g., hamburger--slider)
  const match = block.match(/hamburger--([a-z0-9\-]+)/);
  if (!match) return;
  const animName = match[1];

  // Clean CSS: wrap block comment back
  let css = "/* " + block.trim();

  // Normalize selectors for Squarespace
  css = css.replace(/\.hamburger/g, `.header-burger-btn`);

  // Default Squarespace variables for thickness, color, speed
  const defaultVars = `
/* Default Hamburger Variables */
.header-burger-btn {
  --b-hamburger-layer-height: 2px;       /* thickness */
  --b-hamburger-color: var(--navigationLinkColor, #000);  /* bar color */
  --b-hamburger-speed: 0.35s;            /* animation speed */
}
.header-burger-btn .hamburger-inner,
.header-burger-btn .hamburger-inner::before,
.header-burger-btn .hamburger-inner::after {
  height: var(--b-hamburger-layer-height);
  background-color: var(--b-hamburger-color);
  transition-duration: var(--b-hamburger-speed);
}
`;

  // hover/active states
  const extraStates = `
/* Hover & Active States */
.header-burger-btn.hamburger--${animName}.burger--active:hover {
  opacity: 0.7;
}
.header-burger-btn.hamburger--${animName}.burger--active:active {
  opacity: 0.7;
}
`;

  // Combine everything
  const outputCss = defaultVars + "\n" + css + "\n" + extraStates;

  // Write output file under src/
  const outputPath = path.join(outputDir, `${animName}.css`);
  fs.writeFileSync(outputPath, outputCss, "utf8");
  console.log(`✅ Generated: ${animName}.css`);
});

console.log("✨ All animations split successfully into src/ folder with default variables!");