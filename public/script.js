document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const saveButton = document.querySelector('.save');
    const cancelButton = document.querySelector('.cancel');
    let currentColor = 'red';
    let isDrawing = false;

    // Create board cells
    for (let i = 0; i < 250 * 250; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
    }

    // Handle color selection
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', () => {
            currentColor = button.dataset.color;
        });
    });

    // Handle drawing
    board.addEventListener('mousedown', () => isDrawing = true);
    board.addEventListener('mouseup', () => isDrawing = false);
    board.addEventListener('mouseleave', () => isDrawing = false);

    board.addEventListener('mousemove', (e) => {
        if (isDrawing && e.target.classList.contains('cell')) {
            e.target.style.backgroundColor = currentColor;
        }
    });

    board.addEventListener('click', (e) => {
        if (e.target.classList.contains('cell')) {
            e.target.style.backgroundColor = currentColor;
        }
    });

    // Handle cancel
    cancelButton.addEventListener('click', () => {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.style.backgroundColor = 'white';
        });
    });

    // Handle save
    saveButton.addEventListener('click', () => {
        const drawing = [];
        document.querySelectorAll('.cell').forEach(cell => {
            drawing.push(cell.style.backgroundColor);
        });
        fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drawing }),
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
        }
    });
});
