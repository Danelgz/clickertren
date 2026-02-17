const screen = document.getElementById('screen');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let previousValue = null;
let operator = null;
let waitingForNewInput = false;

// Actualiza la pantalla
function updateScreen() {
    screen.textContent = currentInput || '0';
}

// Funciones científicas
function applyScientific(op, value) {
    value = parseFloat(value);
    switch(op){
        case 'sin': return Math.sin(value);
        case 'cos': return Math.cos(value);
        case 'tan': return Math.tan(value);
        case 'sqrt': return Math.sqrt(value);
        case 'log': return Math.log10(value);
        case 'exp': return Math.exp(value);
        default: return value;
    }
}

// Evaluar operaciones básicas
function calculate(a, b, op) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch(op){
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? 'Error' : a / b;
        case '^': return Math.pow(a, b);
        default: return b;
    }
}

buttons.forEach(btn => {
    const num = btn.dataset.num;
    const op = btn.dataset.op;

    btn.addEventListener('click', () => {
        // Limpiar pantalla
        if(btn.id === 'clear') {
            currentInput = '';
            previousValue = null;
            operator = null;
            waitingForNewInput = false;
            updateScreen();
            return;
        }

        // Igual
        if(btn.id === 'equals') {
            if(operator && previousValue !== null && currentInput !== '') {
                try {
                    let result;
                    if(['sin','cos','tan','sqrt','log','exp'].includes(operator)) {
                        result = applyScientific(operator, currentInput);
                    } else {
                        result = calculate(previousValue, currentInput, operator);
                    }
                    currentInput = result.toString();
                    previousValue = null;
                    operator = null;
                    waitingForNewInput = true;
                    updateScreen();
                } catch(e) {
                    currentInput = 'Error';
                    updateScreen();
                }
            }
            return;
        }

        // Operadores
        if(op) {
            if(currentInput === '') return;
            // Operador científico inmediato
            if(['sin','cos','tan','sqrt','log','exp'].includes(op)) {
                currentInput = applyScientific(op, currentInput).toString();
                updateScreen();
                waitingForNewInput = true;
                return;
            }

            // Operador normal
            if(previousValue !== null && operator && !waitingForNewInput) {
                currentInput = calculate(previousValue, currentInput, operator).toString();
            }
            operator = op;
            previousValue = currentInput;
            waitingForNewInput = true;
            return;
        }

        // Números
        if(num) {
            if(waitingForNewInput) {
                currentInput = '';
                waitingForNewInput = false;
            }
            if(num === '.' && currentInput.includes('.')) return;
            currentInput += num;
            updateScreen();
        }
    });
});
