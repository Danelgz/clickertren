const screen = document.getElementById('screen');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let operator = null;
let previousValue = null;

function updateScreen() {
    screen.textContent = currentInput || '0';
}

buttons.forEach(btn => {
    const num = btn.dataset.num;
    const op = btn.dataset.op;

    btn.addEventListener('click', () => {
        // Limpiar
        if(btn.id === 'clear') {
            currentInput = '';
            previousValue = null;
            operator = null;
            updateScreen();
            return;
        }

        // Igual
        if(btn.id === 'equals') {
            if(operator && previousValue !== null && currentInput !== '') {
                let result = 0;
                const curr = parseFloat(currentInput);
                const prev = parseFloat(previousValue);

                switch(operator){
                    case '+': result = prev + curr; break;
                    case '-': result = prev - curr; break;
                    case '*': result = prev * curr; break;
                    case '/': result = curr === 0 ? 'Error' : prev / curr; break;
                }

                currentInput = result.toString();
                previousValue = null;
                operator = null;
                updateScreen();
            }
            return;
        }

        // Operadores
        if(op) {
            if(currentInput === '') return;
            if(previousValue !== null) {
                let curr = parseFloat(currentInput);
                let prev = parseFloat(previousValue);
                switch(operator){
                    case '+': previousValue = prev + curr; break;
                    case '-': previousValue = prev - curr; break;
                    case '*': previousValue = prev * curr; break;
                    case '/': previousValue = curr === 0 ? 'Error' : prev / curr; break;
                }
            } else {
                previousValue = currentInput;
            }
            operator = op;
            currentInput = '';
            updateScreen();
            return;
        }

        // Números y punto
        if(num) {
            if(num === '.' && currentInput.includes('.')) return;
            currentInput += num;
            updateScreen();
        }
    });
});
