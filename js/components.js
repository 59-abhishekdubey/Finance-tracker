// ========== UI COMPONENT BUILDERS ==========

// Create a button
function createButton(text, onClick, variant = 'primary', size = '', icon = null) {
    const button = document.createElement('button');
    button.className = `btn btn-${variant} ${size ? `btn-${size}` : ''}`;
    
    if (icon) {
        const iconSpan = document.createElement('span');
        iconSpan.textContent = icon;
        button.appendChild(iconSpan);
    }
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    button.appendChild(textSpan);
    
    if (onClick) {
        button.onclick = onClick;
    }
    
    return button;
}

// Create a card
function createCard(title, subtitle, content) {
    const card = document.createElement('div');
    card.className = 'card';
    
    if (title || subtitle) {
        const header = document.createElement('div');
        header.className = 'card-header';
        
        if (title) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'card-title';
            titleEl.textContent = title;
            header.appendChild(titleEl);
        }
        
        if (subtitle) {
            const subtitleEl = document.createElement('p');
            subtitleEl.className = 'card-subtitle';
            subtitleEl.textContent = subtitle;
            header.appendChild(subtitleEl);
        }
        
        card.appendChild(header);
    }
    
    if (content) {
        card.appendChild(content);
    }
    
    return card;
}

// Create large stat display
function createStatLarge(value, label, sublabel) {
    const stat = document.createElement('div');
    stat.className = 'stat-large';
    
    const valueEl = document.createElement('div');
    valueEl.className = 'stat-value';
    valueEl.textContent = value;
    
    const labelEl = document.createElement('div');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;
    
    stat.appendChild(valueEl);
    stat.appendChild(labelEl);
    
    if (sublabel) {
        const sublabelEl = document.createElement('div');
        sublabelEl.className = 'stat-sublabel';
        sublabelEl.textContent = sublabel;
        stat.appendChild(sublabelEl);
    }
    
    return stat;
}

// Create progress bar
function createProgressBar(label, spent, total, type) {
    const group = document.createElement('div');
    group.className = 'progress-group';
    
    // Header
    const header = document.createElement('div');
    header.className = 'progress-header';
    
    const labelEl = document.createElement('div');
    labelEl.className = 'progress-label';
    labelEl.textContent = label;
    
    const amountEl = document.createElement('div');
    amountEl.className = 'progress-amount';
    amountEl.textContent = `${formatCurrency(spent)} / ${formatCurrency(total)}`;
    
    header.appendChild(labelEl);
    header.appendChild(amountEl);
    
    // Progress bar
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    
    const fill = document.createElement('div');
    fill.className = `progress-fill progress-${type}`;
    const percentage = Math.min((spent / total) * 100, 100);
    fill.style.width = `${percentage}%`;
    
    bar.appendChild(fill);
    
    // Meta info
    const meta = document.createElement('div');
    meta.className = 'progress-meta';
    
    const percentageText = document.createElement('span');
    percentageText.textContent = `${Math.round(percentage)}% used`;
    
    const remaining = document.createElement('span');
    const remainingAmount = Math.max(total - spent, 0);
    remaining.textContent = `${formatCurrency(remainingAmount)} remaining`;
    
    meta.appendChild(percentageText);
    meta.appendChild(remaining);
    
    // Assemble
    group.appendChild(header);
    group.appendChild(bar);
    group.appendChild(meta);
    
    return group;
}


// Create transaction item
function createTransactionItem(transaction, showActions = true) {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.style.position = 'relative';
    
    // Icon
    const icon = document.createElement('div');
    icon.className = 'transaction-icon';
    icon.style.backgroundColor = getCategoryColor(transaction.category) + '20';
    icon.textContent = getIcon(transaction.category);
    
    // Details
    const details = document.createElement('div');
    details.className = 'transaction-details';
    
    const name = document.createElement('div');
    name.className = 'transaction-name';
    name.textContent = transaction.name;
    
    const meta = document.createElement('div');
    meta.className = 'transaction-meta';
    
    const category = document.createElement('span');
    category.className = 'transaction-category';
    category.style.backgroundColor = getCategoryColor(transaction.category) + '20';
    category.style.color = getCategoryColor(transaction.category);
    category.textContent = transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1);
    
    const time = document.createElement('span');
    time.textContent = transaction.time;
    
    meta.appendChild(category);
    meta.appendChild(document.createTextNode(' • '));
    meta.appendChild(time);
    
    details.appendChild(name);
    details.appendChild(meta);
    
    // Amount
    const amount = document.createElement('div');
    amount.className = 'transaction-amount';
    amount.textContent = formatCurrency(transaction.amount);
    
    // Actions container
    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = 'var(--space-xs)';
    actions.style.marginLeft = 'var(--space-sm)';
    
    if (showActions) {
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-ghost btn-small';
        editBtn.textContent = '✏️';
        editBtn.style.minHeight = '32px';
        editBtn.style.padding = 'var(--space-xs)';
        editBtn.onclick = (e) => {
            e.stopPropagation();
            showEditTransactionModal(transaction);
        };
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-ghost btn-small';
        deleteBtn.textContent = '🗑️';
        deleteBtn.style.minHeight = '32px';
        deleteBtn.style.padding = 'var(--space-xs)';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            showDeleteConfirmation(transaction);
        };
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
    }
    
    item.appendChild(icon);
    item.appendChild(details);
    item.appendChild(amount);
    if (showActions) {
        item.appendChild(actions);
    }
    
    return item;
}

// Create histogram chart
function createHistogram(data) {
    const container = document.createElement('div');
    container.className = 'histogram-container';
    
    // Header
    const header = document.createElement('div');
    header.className = 'histogram-header';
    
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = 'Daily Spending';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'card-subtitle';
    subtitle.textContent = 'Last 7 days';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    
    // Chart
    const chart = document.createElement('div');
    chart.className = 'histogram-chart';
    
    // CRITICAL FIX: Find actual max amount from the data
    const amounts = data.map(day => day.amount).filter(amt => amt > 0);
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 1;
    
    console.log('=== HISTOGRAM DEBUG ===');
    console.log('All daily amounts:', data.map(d => `${d.label}: ₹${d.amount}`));
    console.log('Max amount found:', maxAmount);
    
    data.forEach(day => {
        const barWrapper = document.createElement('div');
        barWrapper.className = 'histogram-bar-wrapper';
        
        const bar = document.createElement('div');
        bar.className = 'histogram-bar';
        
        // Calculate and set height
        if (day.amount > 0) {
            // CRITICAL: Proper percentage calculation
            const heightPercentage = (day.amount / maxAmount) * 100;
            bar.style.height = `${heightPercentage}%`;
            bar.style.minHeight = '8px'; // Minimum visible height
            
            console.log(`${day.label}: ₹${day.amount} → ${heightPercentage.toFixed(1)}% height`);
            
            // Amount label - ALWAYS VISIBLE
            const amountLabel = document.createElement('div');
            amountLabel.className = 'histogram-bar-amount';
            amountLabel.textContent = formatCurrency(day.amount);
            amountLabel.style.opacity = '1'; // ALWAYS SHOW
            bar.appendChild(amountLabel);
            
        } else {
            // No spending - empty bar
            bar.style.height = '2px';
            bar.style.opacity = '0.3';
        }
        
        // Color based on today
        if (day.isToday) {
            bar.style.backgroundColor = 'var(--color-primary)';
            bar.style.opacity = '1';
        } else if (day.amount > 0) {
            bar.style.backgroundColor = 'var(--color-primary)';
            bar.style.opacity = '0.7';
        }
        
        // Day label
        const label = document.createElement('div');
        label.className = 'histogram-bar-label';
        label.textContent = day.label;
        
        if (day.isToday) {
            label.style.fontWeight = 'var(--font-semibold)';
            label.style.color = 'var(--color-primary)';
        }
        
        barWrapper.appendChild(bar);
        barWrapper.appendChild(label);
        chart.appendChild(barWrapper);
    });
    
    console.log('=== END DEBUG ===');
    
    container.appendChild(header);
    container.appendChild(chart);
    
    return container;
}
// Create category pill
function createCategoryPill(category, active, onClick) {
    const pill = document.createElement('div');
    pill.className = `category-pill ${active ? 'active' : ''}`;
    
    const icon = document.createElement('div');
    icon.className = 'category-icon';
    icon.textContent = getIcon(category.toLowerCase());
    
    const name = document.createElement('div');
    name.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    
    pill.appendChild(icon);
    pill.appendChild(name);
    
    pill.onclick = () => onClick(category);
    
    return pill;
}

// Create bottom navigation
function createBottomNav(activeScreen) {
    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    
    const navItems = [
        { icon: getIcon('home'), label: 'Home', id: 'home' },
        { icon: getIcon('chart'), label: 'Stats', id: 'stats' },
        { icon: getIcon('chat'), label: 'AI Chat', id: 'ai' }
    ];
    
    navItems.forEach(item => {
        const navItem = document.createElement('a');
        navItem.className = 'nav-item';
        if (item.id === activeScreen) {
            navItem.classList.add('active');
        }
        
        const iconSpan = document.createElement('span');
        iconSpan.className = 'nav-icon';
        iconSpan.textContent = item.icon;
        
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label;
        
        navItem.appendChild(iconSpan);
        navItem.appendChild(labelSpan);
        
        navItem.onclick = () => switchScreen(item.id);
        
        nav.appendChild(navItem);
    });
    
    return nav;
}

// Create modal
function createModal(title, content, onClose) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const header = document.createElement('div');
    header.className = 'modal-header';
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'modal-title';
    titleEl.textContent = title;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.textContent = getIcon('close');
    closeBtn.onclick = () => {
        overlay.remove();
        if (onClose) onClose();
    };

    const navItems = [
    { icon: getIcon('home'), label: 'Home', id: 'home' },
    { icon: getIcon('chart'), label: 'Stats', id: 'stats' },
    { icon: '📊', label: 'Analytics', id: 'analytics' },
    { icon: getIcon('chat'), label: 'AI', id: 'ai' },
    { icon: '⚙️', label: 'Settings', id: 'settings' }  // ADD THIS LINE
];


    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    
    const body = document.createElement('div');
    body.className = 'modal-body';
    body.appendChild(content);
    
    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    
    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (onClose) onClose();
        }
    };
    
    return overlay;
}