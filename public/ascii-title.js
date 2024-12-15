document.addEventListener('DOMContentLoaded', () => {
    const asciiTitleContainer = document.getElementById('ascii-title');
    
    if (asciiTitleContainer) {
      figlet.text('Is This Real?', {
        font: 'Standard', 
        horizontalLayout: 'default',
        verticalLayout: 'default'
      }, (err, asciiText) => {
        if (err) {
          console.error('Error generating ASCII text:', err);
          return;
        }
        asciiTitleContainer.textContent = asciiText;
      });
    }
  });
  