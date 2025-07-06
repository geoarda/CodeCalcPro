const display = document.getElementById('calc-display');
const buttons = document.querySelectorAll('.buttons button');
const darkModeToggle = document.getElementById('dark-mode-toggle');

let memory = 0;
let currentInput = '';
let lastOperator = null;
let operand = null;
let resultDisplayed = false;

function updateDisplay(value) {
  display.value = value;
}

function clearAll() {
  currentInput = '';
  lastOperator = null;
  operand = null;
  resultDisplayed = false;
  updateDisplay('');
}

function appendNumber(num) {
  if (resultDisplayed) {
    currentInput = '';
    resultDisplayed = false;
  }
  if (num === '.' && currentInput.includes('.')) return;
  currentInput += num;
  updateDisplay(currentInput);
}

function calculate(a, b, operator) {
  a = parseFloat(a);
  b = parseFloat(b);
  switch(operator) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? 'Hata' : a / b;
    case '%': return a * b / 100;
    default: return b;
  }
}

function handleOperator(op) {
  if (currentInput === '' && op !== '-') return;
  if (operand !== null && lastOperator !== null && currentInput !== '') {
    let res = calculate(operand, currentInput, lastOperator);
    if (res === 'Hata') {
      updateDisplay(res);
      clearAll();
      return;
    }
    operand = res;
    updateDisplay(res);
    currentInput = '';
  } else if(currentInput !== '') {
    operand = parseFloat(currentInput);
    currentInput = '';
  }
  lastOperator = op;
  resultDisplayed = false;
}

function calculateResult() {
  if (operand === null || lastOperator === null || currentInput === '') return;
  let res = calculate(operand, currentInput, lastOperator);
  if (res === 'Hata') {
    updateDisplay(res);
    clearAll();
    return;
  }
  updateDisplay(res);
  currentInput = '';
  operand = null;
  lastOperator = null;
  resultDisplayed = true;
}

function memoryClear() {
  memory = 0;
}

function memoryRecall() {
  currentInput = memory.toString();
  updateDisplay(currentInput);
}

function memoryAdd() {
  if (currentInput === '') return;
  memory += parseFloat(currentInput);
}

function memorySubtract() {
  if (currentInput === '') return;
  memory -= parseFloat(currentInput);
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.getAttribute('data-action');
    if (!isNaN(action)) {
      appendNumber(action);
    } else {
      switch(action) {
        case 'clear': clearAll(); break;
        case 'decimal': appendNumber('.'); break;
        case 'add': handleOperator('+'); break;
        case 'subtract': handleOperator('-'); break;
        case 'multiply': handleOperator('*'); break;
        case 'divide': handleOperator('/'); break;
        case 'percent': handleOperator('%'); break;
        case 'equals': calculateResult(); break;
        case 'memory-clear': memoryClear(); break;
        case 'memory-recall': memoryRecall(); break;
        case 'memory-add': memoryAdd(); break;
        case 'memory-subtract': memorySubtract(); break;
      }
    }
  });
});

darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
});

// Klavye ile kullanım desteği, Backspace ve Copy kısayolu eklendi
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
  } else if (e.key === '.') {
    appendNumber('.');
  } else if (['+', '-', '*', '/'].includes(e.key)) {
    handleOperator(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    calculateResult();
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput);
  } else if (e.key.toLowerCase() === 'c') {
    clearAll();
  } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
    // Ctrl+C / Cmd+C ile sonucu kopyalama
    navigator.clipboard.writeText(display.value).catch(() => {});
  }
});
