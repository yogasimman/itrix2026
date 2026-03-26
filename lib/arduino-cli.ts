import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export interface ArduinoCompileResult {
  success: boolean;
  message: string;
  stdout: string;
  stderr: string;
  command: string;
}

const WINDOWS_ARDUINO_CLI_PATHS = [
  'C:\\Program Files\\Arduino CLI\\arduino-cli.exe',
  'C:\\Program Files (x86)\\Arduino CLI\\arduino-cli.exe',
];

async function resolveArduinoCliExecutable(): Promise<string> {
  const configured = process.env.ARDUINO_CLI_PATH;
  if (configured) {
    try {
      await fs.access(configured);
      return configured;
    } catch {
      // Fall through to defaults.
    }
  }

  if (process.platform === 'win32') {
    for (const candidate of WINDOWS_ARDUINO_CLI_PATHS) {
      try {
        await fs.access(candidate);
        return candidate;
      } catch {
        // Try next candidate.
      }
    }
  }

  return 'arduino-cli';
}

export async function compileArduinoSketch(
  code: string,
  fqbn = 'arduino:avr:uno'
): Promise<ArduinoCompileResult> {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'round1-arduino-'));
  const sketchDir = path.join(tempRoot, 'snippet_check');
  const inoPath = path.join(sketchDir, 'snippet_check.ino');

  try {
    await fs.mkdir(sketchDir, { recursive: true });
    await fs.writeFile(inoPath, code, 'utf-8');

    const args = ['compile', '--fqbn', fqbn, sketchDir];
    const executable = await resolveArduinoCliExecutable();
    const command = `${executable} ${args.join(' ')}`;

    try {
      const { stdout, stderr } = await execFileAsync(executable, args, {
        windowsHide: true,
        timeout: 30_000,
        maxBuffer: 1024 * 1024 * 8,
      });

      return {
        success: true,
        message: 'Compilation successful.',
        stdout: stdout || '',
        stderr: stderr || '',
        command,
      };
    } catch (error: unknown) {
      const err = error as {
        code?: string | number;
        stdout?: string;
        stderr?: string;
        message?: string;
      };

      if (err.code === 'ENOENT') {
        return {
          success: false,
          message: 'arduino-cli was not found. Install Arduino CLI and add it to PATH.',
          stdout: err.stdout || '',
          stderr: err.stderr || err.message || '',
          command,
        };
      }

      return {
        success: false,
        message: 'Compilation failed. Fix compiler errors and try again.',
        stdout: err.stdout || '',
        stderr: err.stderr || err.message || '',
        command,
      };
    }
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}