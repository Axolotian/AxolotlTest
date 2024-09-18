class HyperTest {
  getInfo() {
    return {
      id: 'hypertest',
      name: 'please help me',
      blocks: [
        {
          opcode: 'convert',
          blockType: Scratch.BlockType.REPORTER,
          text: 'convert [TEXT] to [FORMAT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Apple'
            },
            FORMAT: {
              type: Scratch.ArgumentType.STRING,
              menu: 'FORMAT_MENU'
            }
          }
        },        
        {
          opcode: 'PythonInit',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Initialise Python',
        },
        {
          opcode: 'GenerateRandomPython',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Generate a random number with python, this is a test',
        },
        {
          opcode: 'runPythonCode',
          blockType: Scratch.BlockType.REPORTER,
          text: 'run python code(dont use)',
        }
      ],
      menus: {
        FORMAT_MENU: {
          acceptReporters: true,
          items: [
            {
              text: 'UPPERCASE',
              value: 'up'
            },
            {
              text: 'lowercase',
              value: 'low'
            }
          ]
        }
      }
    };
  }

  convert(args) {
    if (args.FORMAT === 'up') {
      return args.TEXT.toString().toUpperCase();
    } else {
      return args.TEXT.toString().toLowerCase();
    }
  }
  async PythonInit() {
    // Load Pyodide (this part will run the Python code inside the browser)
    if (typeof pyodide === 'undefined') {
      const pyodideScript = document.createElement('script');
      pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js';
      document.head.appendChild(pyodideScript);
      await new Promise((resolve) => (pyodideScript.onload = resolve));
      await loadPyodide();
    }
  }
  async GenerateRandomPython() {const pythonCode = `
import random
test = random.randint(1, 10)
test
    `;
    
    // Run the Python code and get the result
    let result = await pyodide.runPythonAsync(pythonCode);
    return result;
  }
}

  async runPythonCode() {
    // Load Pyodide (this part will run the Python code inside the browser)
    if (typeof pyodide === 'undefined') {
      const pyodideScript = document.createElement('script');
      pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js';
      document.head.appendChild(pyodideScript);
      await new Promise((resolve) => (pyodideScript.onload = resolve));
      await loadPyodide();
    }

    // Python code you want to run
    const pythonCode = `
import random
test = random.randint(1, 10)
test
    `;
    
    // Run the Python code and get the result
    let result = await pyodide.runPythonAsync(pythonCode);
    return result;
  }
}


Scratch.extensions.register(new HyperTest());
