        // Immediate check for Figlet library
        console.log('Figlet loaded:', typeof figlet !== 'undefined');
        
        // Add a script to explicitly load and verify Figlet
        document.addEventListener('DOMContentLoaded', function() {
            // Check if figlet is available
            if (typeof figlet === 'undefined') {
                console.error('Figlet is not loaded');
                
                // Alternative loading method
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/figlet/1.5.2/figlet.min.js';
                script.onload = function() {
                    console.log('Figlet loaded dynamically');
                    initFiglet();
                };
                script.onerror = function() {
                    console.error('Failed to load Figlet library dynamically');
                };
                document.head.appendChild(script);
            } else {
                initFiglet();
            }
        });

        function initFiglet() {
            figlet.text('Hello World', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            }, function(err, data) {
                if (err) {
                    console.error('Error generating ASCII art:', err);
                    return;
                }
                
                const container = document.getElementById('ascii-container');
                container.innerHTML = `<pre>${data}</pre>`;
            });
        }