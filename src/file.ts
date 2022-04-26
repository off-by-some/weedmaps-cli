import fs from "fs";
import logger from "./logger";

async function readFile(path: string) {
  try {
    return await fs.promises.readFile(path)
  } catch (error) {
    await fs.promises.writeFile(path, '')
    return "[]";
  }
}

function writeFile(path, content) {
  return fs.promises.writeFile(path, content);
}

async function commit(path, payload) {
  const content      = await readFile(path);
  const currentState = JSON.parse(content.toString());
  const newState     = currentState.concat(payload);

  await writeFile(path, JSON.stringify(newState, undefined, 2));
}

export async function save(path, payload=[]) {
  try {
    return commit(path, payload);
  } catch (error) {
    logger.error(`Failed to write ${payload.length} items. Error: ${error.message}`)
  }
}