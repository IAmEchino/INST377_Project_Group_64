// This isn't working -- we have no idea why, even the phrase "require" isn't
// working for some reason. We tried multiple times with AI bugchecking and it
// just didn't work. Maybe the the site hosting the library is down?

document.addEventListener('DOMContentLoaded', function() {
    // Ensure Figlet is available
    if (typeof figlet !== 'undefined') {
        figlet.text('Is This Real?', {
            font: 'Standard',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data) {
            if (err) {
                console.error('Error generating ASCII art:', err);
                return;
            }
            
            // Target the ascii-title element instead of ascii-container
            const container = document.getElementById('ascii-title');
            if (container) {
                container.innerHTML = `<pre>${data}</pre>`;
            } else {
                console.error('ASCII title container not found');
            }
        });
    } else {
        console.error('Figlet library not loaded');
    }
});