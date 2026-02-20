import { ToolRegistry } from './registry.js';
import { jsonTools } from './tools/jsonEditor.js';

const sidebar = document.getElementById('sidebar');
const workspace = document.getElementById('workspace');

const registry = new ToolRegistry(sidebar, workspace);
registry.registerCategory(jsonTools);
registry.init();

// auto-open first tool for faster access
if (jsonTools.tools.length) {
  registry.activateTool(jsonTools.id, jsonTools.tools[0].id);
  const firstNav = document.querySelector('.nav-item');
  if (firstNav) firstNav.classList.add('active');
}
