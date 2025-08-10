#!/usr/bin/env node

// ANSI color codes for smooth Solar gradient
const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m'
};

// SOLAR ASCII art - retro terminal style
export const solarLogo = `
> solar-code

  ********   *******   **           **     *******           ******    *******   *******   ********
 **//////   **/////** /**          ****   /**////**         **////**  **/////** /**////** /**///// 
/**        **     //**/**         **//**  /**   /**        **    //  **     //**/**    /**/**      
/*********/**      /**/**        **  //** /*******   *****/**       /**      /**/**    /**/******* 
////////**/**      /**/**       **********/**///**  ///// /**       /**      /**/**    /**/**////  
       /**//**     ** /**      /**//////**/**  //**       //**    **//**     ** /**    ** /**      
 ********  //*******  /********/**     /**/**   //**       //******  //*******  /*******  /********
////////    ///////   //////// //      // //     //         //////    ///////   ///////   //////// 
`;

function applySolarGradient(asciiArt) {
  const lines = asciiArt.trim().split('\n');
  let result = '';
  
  // Ultra-smooth Solar gradient array with 100 steps
  const gradient = [];
  
  // Generate 100 color steps from yellow to red using RGB interpolation
  for (let i = 0; i < 100; i++) {
    const progress = i / 99; // 0 to 1
    
    let r, g, b;
    
    if (progress <= 0.5) {
      // Yellow to Orange (first half)
      const localProgress = progress * 2; // 0 to 1
      r = Math.round(255); // Keep red at max
      g = Math.round(255 - (localProgress * 100)); // Yellow to orange
      b = Math.round(0); // Keep blue at 0
    } else {
      // Orange to Red (second half)
      const localProgress = (progress - 0.5) * 2; // 0 to 1
      r = Math.round(255); // Keep red at max
      g = Math.round(155 - (localProgress * 155)); // Orange to red
      b = Math.round(0); // Keep blue at 0
    }
    
    // Convert RGB to closest ANSI 256 color
    const ansiColor = 16 + (36 * Math.floor(r / 51)) + (6 * Math.floor(g / 51)) + Math.floor(b / 51);
    gradient.push(`\x1b[38;5;${Math.min(255, Math.max(16, ansiColor))}m`);
  }
  
  lines.forEach((line) => {
    let coloredLine = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '*' || char === '/') {
        // Apply smooth gradient based on horizontal position  
        const gradientIndex = Math.floor((i / line.length) * gradient.length);
        const color = gradient[Math.min(gradientIndex, gradient.length - 1)];
        coloredLine += color + char + colors.reset;
      } else {
        coloredLine += char;
      }
    }
    
    result += coloredLine + '\n';
  });
  
  return result;
}

function displaySolarLogo() {
  console.clear();
  console.log('\n');
  
  const coloredLogo = applySolarGradient(solarLogo);
  console.log(coloredLogo);
  
  // Tips section
  console.log(colors.dim + 'Tips for getting started:' + colors.reset);
  console.log(colors.dim + '1. Ask questions, edit files, or run commands.' + colors.reset);
  console.log(colors.dim + '2. Be specific for the best results.' + colors.reset);
  console.log(colors.dim + '3. /help for more information.' + colors.reset);
  
  console.log('\n');
  process.stdout.write('> ');
}

// Run only if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  displaySolarLogo();
}