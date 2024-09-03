document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const saveButton = document.querySelector('.save');
    const cancelButton = document.querySelector('.cancel');
    let currentColor = 'red';
    let isDrawing = false;
    let snapshot;

    // Set canvas dimensions
    canvas.width = 500;
    canvas.height = 500;
    
    // Ensure drawing settings are appropriate
    ctx.lineWidth = 2; // Set line width for strokes
    ctx.setLineDash([]); // Reset line dash to ensure solid lines
    ctx.fillStyle = currentColor; // Set initial fill color
    
    // Handle color selection
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', () => {
            currentColor = button.dataset.color;
            document.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            ctx.strokeStyle = currentColor; // Update stroke color
            ctx.fillStyle = currentColor; // Update fill color
        });
    });
    
    // Start drawing
    const startDraw = (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    };
    
    // Drawing on the canvas
    const drawing = (e) => {
        if (!isDrawing) return;
        ctx.putImageData(snapshot, 0, 0); // Restore the image data
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke(); // Apply the stroke
    };
    
    // Handle drawing
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawing);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);
    
    // Handle cancel
    cancelButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    });
    
    // Handle save
    saveButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL(); // Get canvas image data
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataURL }), // Send image data to server
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
    });
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const key = parseInt(e.key, 10);
        if (key >= 1 && key <= 7) {
            currentColor = document.getElementById(`color${key}`).dataset.color;
            ctx.strokeStyle = currentColor; // Update stroke color for keyboard shortcuts
            ctx.fillStyle = currentColor; // Update fill color for keyboard shortcuts
        }
    });
});
