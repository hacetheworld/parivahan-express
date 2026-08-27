/**
 * Compact searchable dropdown for Parivahan Express, replacing native <select>
 * for long option lists (State, RTO, Year) — native selects render as an
 * unstyled, sometimes full-screen OS picker on mobile. This stays inline,
 * scrolls internally within a fixed max height, and flips above the trigger
 * when there isn't room below, so it always fits in view.
 */
export function createSearchableSelect({
  options,
  value,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No matches found',
  disabled = false,
  hasError = false,
  showSearch = true,
  onChange
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative';

  // Tracked locally so the trigger label updates the instant an option is
  // picked, instead of depending on the parent re-rendering this component
  // with a fresh `value` prop (which, for multi-part fields like DOB, may
  // not happen until every part is filled in).
  let currentValue = value;

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.disabled = disabled;
  trigger.className = `w-full bg-slate-900 border ${hasError ? 'border-red-500' : 'border-slate-700'} rounded-xl px-3.5 py-2.5 text-sm text-left flex items-center justify-between gap-2 focus:outline-none focus:border-emerald-500 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-slate-600'}`;
  trigger.innerHTML = `
    <span class="trigger-label truncate"></span>
    <i data-lucide="chevron-down" class="w-4 h-4 text-slate-400 shrink-0"></i>
  `;
  const triggerLabel = trigger.querySelector('.trigger-label');

  function updateTriggerLabel() {
    const selected = options.find(o => o.value === currentValue);
    triggerLabel.textContent = selected ? selected.label : placeholder;
    triggerLabel.className = `trigger-label truncate ${selected ? 'text-white' : 'text-slate-500'}`;
  }
  updateTriggerLabel();

  const panel = document.createElement('div');
  panel.className = 'hidden absolute z-30 w-full civic-card border border-slate-700 shadow-2xl overflow-hidden';
  panel.innerHTML = `
    ${showSearch ? `
      <div class="p-2 border-b border-slate-800">
        <div class="relative">
          <i data-lucide="search" class="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2"></i>
          <input type="text" class="search-input w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500" placeholder="${searchPlaceholder}" />
        </div>
      </div>
    ` : ''}
    <ul class="options-list max-h-48 overflow-y-auto py-1"></ul>
  `;

  wrapper.appendChild(trigger);
  wrapper.appendChild(panel);

  const searchInput = panel.querySelector('.search-input');
  const optionsList = panel.querySelector('.options-list');

  function renderOptions(filter) {
    const q = filter.trim().toLowerCase();
    const filtered = q ? options.filter(o => o.label.toLowerCase().includes(q)) : options;
    optionsList.innerHTML = '';

    if (!filtered.length) {
      const li = document.createElement('li');
      li.className = 'px-3.5 py-3 text-xs text-slate-500 text-center';
      li.textContent = emptyText;
      optionsList.appendChild(li);
      return;
    }

    filtered.forEach(opt => {
      const li = document.createElement('li');
      const isSelected = opt.value === currentValue;
      li.className = `px-3.5 py-2.5 text-sm cursor-pointer transition-colors hover:bg-emerald-500/10 ${isSelected ? 'text-emerald-400 bg-emerald-500/5 font-semibold' : 'text-slate-200'}`;
      li.textContent = opt.label;
      if (isSelected) li.dataset.selected = 'true';
      li.addEventListener('click', () => {
        currentValue = opt.value;
        updateTriggerLabel();
        closePanel();
        onChange(opt.value);
      });
      optionsList.appendChild(li);
    });
  }

  function handleOutsideClick(e) {
    if (!wrapper.contains(e.target)) closePanel();
  }
  function handleEscape(e) {
    if (e.key === 'Escape') closePanel();
  }

  function openPanel() {
    if (disabled) return;

    // Flip above the trigger when there isn't enough room below, so the
    // panel never gets clipped off the bottom of the viewport.
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const panelEstimatedHeight = 260;
    if (spaceBelow < panelEstimatedHeight && rect.top > spaceBelow) {
      panel.classList.add('bottom-full', 'mb-1.5');
      panel.classList.remove('top-full', 'mt-1.5');
    } else {
      panel.classList.add('top-full', 'mt-1.5');
      panel.classList.remove('bottom-full', 'mb-1.5');
    }

    panel.classList.remove('hidden');
    if (searchInput) searchInput.value = '';
    renderOptions('');
    const selectedLi = optionsList.querySelector('li[data-selected="true"]');
    if (selectedLi) selectedLi.scrollIntoView({ block: 'center' });
    if (searchInput) setTimeout(() => searchInput.focus(), 0);
    document.addEventListener('mousedown', handleOutsideClick, true);
    document.addEventListener('keydown', handleEscape, true);
  }

  function closePanel() {
    panel.classList.add('hidden');
    document.removeEventListener('mousedown', handleOutsideClick, true);
    document.removeEventListener('keydown', handleEscape, true);
  }

  trigger.addEventListener('click', () => {
    if (panel.classList.contains('hidden')) openPanel();
    else closePanel();
  });
  if (searchInput) {
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', (e) => renderOptions(e.target.value));
  }

  return wrapper;
}
