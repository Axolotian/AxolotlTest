class HyperTest {
  constructor() {
    this.pyodideReady = false; // Flag to check if Pyodide is initialized
    this.pyodideLoading = false;
    this.pythonCode = `
import random
test = random.randint(1, 10)
test
    `; // Predefine the Python code
    this.preloadPyodide(); // Preload Pyodide when the extension is initialized
  }

  getInfo() {
    return {
      id: 'hypertest',
      name: 'please help me',
      blocks: [
        {
          opcode: 'PythonInit',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Initialise Python',
        },
        {
          opcode: 'GenerateRandomPython',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Generate a random number with python, this is a test',
        },
        {
          opcode: 'checkPython',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Python Initialised?',
        },
        {
          opcode:  'checkPythonLoading',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Python Loading?'
        }
      ],
    };
  }

  async preloadPyodide() {
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
      this.pyodideLoading = false;
      this.pyodideReady = true; // Mark Pyodide as loaded
    }
  }

  async PythonInit() {
    // This function is now almost redundant since Pyodide is preloaded at the start
    if (this.pyodideReady) {
      return;
    }
    await this.preloadPyodide(); // Ensure Pyodide is ready
  }

  async GenerateRandomPython() {
    // Ensure Pyodide is loaded
    if (!this.pyodideReady) {
      if (!this.pyodideLoading){
      await this.PythonInit();
      }
    }

    // Run the pre-defined Python code and get the result
    let result = await pyodide.runPythonAsync(this.pythonCode);
    return result;
  }

  checkPython() {
    return this.pyodideReady;
  }
  checkPythonLoading() {
    return this.pyodideLoading;
  }
}

Scratch.extensions.register(new HyperTest());
