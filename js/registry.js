export class ToolRegistry {
  constructor(sidebarEl, workspaceEl) {
    this.sidebarEl = sidebarEl;
    this.workspaceEl = workspaceEl;
    this.categories = [];
    this.activeTool = null;
  }

  registerCategory(category) {
    this.categories.push(category);
  }

  init() {
    this.renderSidebar();
  }

  renderSidebar() {
    this.sidebarEl.innerHTML = '';
    this.categories.forEach((cat) => {
      const group = document.createElement('div');
      group.className = 'nav-group';

      const title = document.createElement('h2');
      title.textContent = cat.label || cat.id;
      group.appendChild(title);

      cat.tools.forEach((tool) => {
        const item = document.createElement('div');
        item.className = 'nav-item';
        item.dataset.toolId = tool.id;

        item.innerHTML = `
          <div class="nav-dot"></div>
          <div class="nav-text">
            <div class="nav-title">${tool.label}</div>
            <div class="nav-desc">${tool.desc || ''}</div>
          </div>
        `;

        item.addEventListener('click', () => {
          this.activateTool(cat.id, tool.id);
          document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
          item.classList.add('active');
        });

        group.appendChild(item);
      });

      this.sidebarEl.appendChild(group);
    });
  }

  activateTool(categoryId, toolId) {
    const category = this.categories.find((c) => c.id === categoryId);
    if (!category) return;
    const tool = category.tools.find((t) => t.id === toolId);
    if (!tool) return;

    this.activeTool = tool;
    this.workspaceEl.innerHTML = '';
    tool.render(this.workspaceEl);
  }
}
