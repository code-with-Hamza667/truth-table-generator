document
  .getElementById("truthTableForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting
    const expression = document.getElementById("expression").value.trim();

    if (expression === "") {
      alert("Please enter a valid logical expression!");
      return;
    }

    const variables = extractVariables(expression);

    if (variables.length === 0) {
      alert("No variables found in the expression!");
      return;
    }

    const truthTable = generateTruthTable(variables);

    const results = truthTable.map((combination) => {
      const evalExpression = evaluateExpression(expression, combination);
      return {
        combination: combination,
        result: evalExpression,
      };
    });

    displayTruthTable(variables, results);
  });

// Function to insert logical operators into the input field
function insertOperator(operator) {
  const input = document.getElementById("expression");
  input.value += operator;
}

// Function to extract unique variables (A, B, C, etc.) from the logical expression
function extractVariables(expression) {
  const variables = new Set();
  for (const char of expression) {
    if (/[A-Z]/.test(char)) {
      variables.add(char);
    }
  }
  return Array.from(variables);
}

// Function to generate all combinations of true/false for the variables
function generateTruthTable(variables) {
  const numRows = Math.pow(2, variables.length);
  const table = [];

  for (let i = 0; i < numRows; i++) {
    const combination = {};
    for (let j = 0; j < variables.length; j++) {
      combination[variables[j]] = Boolean(
        i & (1 << (variables.length - j - 1))
      );
    }
    table.push(combination);
  }
  return table;
}

// Function to evaluate the logical expression based on a combination of truth values
function evaluateExpression(expression, combination) {
  let evalExpression = expression;
  for (const variable in combination) {
    const value = combination[variable] ? "true" : "false";
    const regex = new RegExp(variable, "g");
    evalExpression = evalExpression.replace(regex, value);
  }

  evalExpression = evalExpression
    .replace(/∧/g, "&&")
    .replace(/∨/g, "||")
    .replace(/¬/g, "!");

  try {
    return eval(evalExpression);
  } catch (error) {
    return "Error";
  }
}

// Function to display the truth table in the result div
function displayTruthTable(variables, results) {
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  let tableHTML = "<table><thead><tr>";
  variables.forEach((variable) => {
    tableHTML += `<th>${variable}</th>`;
  });
  tableHTML += "<th>Result</th></tr></thead><tbody>";

  results.forEach((row) => {
    tableHTML += "<tr>";
    variables.forEach((variable) => {
      tableHTML += `<td>${row.combination[variable]}</td>`;
    });
    tableHTML += `<td>${row.result}</td></tr>`;
  });

  tableHTML += "</tbody></table>";
  resultDiv.innerHTML = tableHTML;
}
