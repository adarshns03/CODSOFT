const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
let currentInput = '';
let lastInputIsOperator = false;

function updateDisplay() {
  display.textContent = currentInput || '0';
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const num = button.getAttribute('data-num');
    const op = button.getAttribute('data-op');

    if (button.id === 'clear') {
      // Clear all input
      currentInput = '';
      lastInputIsOperator = false;
      updateDisplay();
      return;
    }

    if (button.id === 'backspace') {
      // Remove last character
      if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') lastInputIsOperator = false;
      }
      updateDisplay();
      return;
    }

    if (button.id === 'equals') {
      try {
        // Replace symbols with JS operators
        let expression = currentInput
          .replace(/÷/g, '/')
          .replace(/×/g, '*')
          .replace(/−/g, '-')
          .replace(/%/g, '*0.01'); // Convert % to *0.01 for percentage
          
        // Evaluate expression safely
        let result = Function('"use strict";return (' + expression + ')')();
        currentInput = result.toString();
        updateDisplay();
        lastInputIsOperator = false;
      } catch {
        display.textContent = 'Error';
        currentInput = '';
        lastInputIsOperator = false;
      }
      return;
    }

    if (num !== null) {
      // Prevent multiple decimals in a number segment
      if (num === '.' && currentInput.endsWith('.')) return;
      
      // If last input was an operator or empty, start fresh if input is zero
      if (currentInput === '0' && num !== '.') {
        currentInput = num;
      } else {
        currentInput += num;
      }
      lastInputIsOperator = false;
      updateDisplay();
      return;
    }

    if (op !== null) {
      if (currentInput === '') {
        // Allow negative number start
        if (op === '-') {
          currentInput = '-';
          lastInputIsOperator = true;
          updateDisplay();
        }
        return;
      }

      if (lastInputIsOperator) {
        // Replace last operator with new one
        currentInput = currentInput.slice(0, -1) + op;
      } else {
        currentInput += op;
      }
      lastInputIsOperator = true;
      updateDisplay();
    }
  });
});
