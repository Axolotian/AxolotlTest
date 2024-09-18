class HyperTest {
  constructor() {
    this.pyodideReady = false; // Flag to check if Pyodide is initialized
    this.pyodideLoading = false;
  }

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
          blockType: Scratch.BlockType.REPORTER,
          text: 'Generate a random number with python, this is a test',
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

  async PythonInit() {
    if (this.pyodideReady) {
      return; // Pyodide is already loaded, no need to reload
    }

    if (typeof pyodide === 'undefined') {
      this.pyodideLoading = true;
      const pyodideScript = document.createElement('script');
      pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/pyodide.js';
      document.head.appendChild(pyodideScript);

      await new Promise((resolve, reject) => {
        pyodideScript.onload = resolve;
        pyodideScript.onerror = reject;
      });

      // Wait for Pyodide to fully load
      await loadPyodide();
      this.pyodideReady = true; // Mark Pyodide as loaded
      this.pyodideLoading = false;
    }
  }

  async GenerateRandomPython() {
    // Ensure Pyodide is loaded
    if (!this.pyodideLoading) {
      return "Please Hold lol"
    }
    if (!this.pyodideReady) {
      await this.PythonInit();
    }

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
