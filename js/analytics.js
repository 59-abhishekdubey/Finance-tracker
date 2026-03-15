// ========== ANALYTICS CALCULATIONS ==========

// Get spending breakdown by category
function getSpendingByCategory(transactions) {

    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (transaction.type === "expense") {

            const category = transaction.category;

            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }

            categoryTotals[category] += transaction.amount;

        }

    });

    const categoryArray = Object.entries(categoryTotals).map(([category, amount]) => ({

        category: category,
        amount: amount,
        color: getCategoryColor(category),
        icon: getIcon(category)

    }));

    categoryArray.sort((a, b) => b.amount - a.amount);

    return categoryArray;
}



// Get total spending
function getTotalSpending(transactions) {

    return transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

}



// Get top spending categories
function getTopCategories(categoryData, limit = 3) {
    return categoryData.slice(0, limit);
}



// Compare this week vs last week
function getWeekComparison(transactions) {

    const now = new Date();

    const thisWeekStart = new Date();
    thisWeekStart.setDate(now.getDate() - 7);

    const thisWeek = transactions
        .filter(t => t.type === "expense" && new Date(t.date) >= thisWeekStart)
        .reduce((sum, t) => sum + t.amount, 0);


    const lastWeekStart = new Date();
    lastWeekStart.setDate(now.getDate() - 14);

    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(now.getDate() - 7);

    const lastWeek = transactions
        .filter(t => {

            const date = new Date(t.date);

            return (
                t.type === "expense" &&
                date >= lastWeekStart &&
                date < lastWeekEnd
            );

        })
        .reduce((sum, t) => sum + t.amount, 0);


    const difference = thisWeek - lastWeek;

    const percentChange =
        lastWeek > 0 ? ((difference / lastWeek) * 100) : 0;


    return {

        thisWeek: thisWeek,
        lastWeek: lastWeek,
        difference: difference,
        percentChange: Math.round(percentChange),
        isIncrease: difference > 0

    };

}



// ========== ANALYTICS SCREEN ==========

function renderAnalyticsScreen() {

    const container = document.createElement("div");
    container.className = "container-narrow";

    const transactions = getTransactions();
    const budget = getBudget();
    const spent = calculateSpent(transactions);



    // Header
    const title = document.createElement("h1");
    title.textContent = "📊 Analytics";

    const subtitle = document.createElement("p");
    subtitle.className = "text-secondary";
    subtitle.textContent = "Deep dive into your spending";

    container.appendChild(title);
    container.appendChild(subtitle);



    // Overview cards
    const overviewGrid = document.createElement("div");
    overviewGrid.className = "analytics-overview-grid";

    const totalCard = createAnalyticsMiniCard(
        "Total Spent",
        formatCurrency(spent.total)
    );

    const remaining = Math.max(budget.total - spent.total, 0);

    const remainingCard = createAnalyticsMiniCard(
        "Remaining",
        formatCurrency(remaining)
    );

    const txCard = createAnalyticsMiniCard(
        "Transactions",
        String(transactions.length)
    );

    const avgCard = createAnalyticsMiniCard(
        "Avg / Transaction",
        formatCurrency(
            transactions.length > 0
                ? Math.round(spent.total / transactions.length)
                : 0
        )
    );

    overviewGrid.appendChild(totalCard);
    overviewGrid.appendChild(remainingCard);
    overviewGrid.appendChild(txCard);
    overviewGrid.appendChild(avgCard);

    container.appendChild(overviewGrid);



    container.appendChild(createSpacer());



    // Category breakdown
    const categoryData = getSpendingByCategory(transactions);

    const categoryContent = document.createElement("div");

    if (categoryData.length === 0) {

        const empty = document.createElement("p");
        empty.className = "text-secondary";
        empty.textContent = "No expenses to analyze.";
        empty.style.textAlign = "center";

        categoryContent.appendChild(empty);

    } else {

        const maxAmount = categoryData[0].amount;

        categoryData.forEach(cat => {

            categoryContent.appendChild(
                createCategoryBar(cat, maxAmount, spent.total)
            );

        });

    }

    const categoryCard = createCard(
        "Spending by Category",
        "Where your money goes",
        categoryContent
    );

    container.appendChild(categoryCard);



    return container;

}



// ========== UI HELPERS ==========

// mini stat card
function createAnalyticsMiniCard(label, value) {

    const card = document.createElement("div");
    card.className = "analytics-mini-card";

    const labelEl = document.createElement("div");
    labelEl.className = "text-secondary";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "analytics-mini-value";
    valueEl.textContent = value;

    card.appendChild(labelEl);
    card.appendChild(valueEl);

    return card;

}



// category bar
function createCategoryBar(cat, maxAmount, total) {

    const row = document.createElement("div");
    row.className = "analytics-cat-row";

    const name = document.createElement("span");
    name.textContent =
        getIcon(cat.category) +
        " " +
        cat.category.charAt(0).toUpperCase() +
        cat.category.slice(1);

    const amount = document.createElement("span");
    amount.textContent =
        formatCurrency(cat.amount) +
        " (" +
        calculatePercentage(cat.amount, total) +
        "%)";

    const bar = document.createElement("div");
    bar.className = "analytics-bar";

    const fill = document.createElement("div");
    fill.className = "analytics-bar-fill";

    const width = maxAmount > 0 ? (cat.amount / maxAmount) * 100 : 0;

    fill.style.width = width + "%";
    fill.style.backgroundColor = cat.color;

    bar.appendChild(fill);

    row.appendChild(name);
    row.appendChild(amount);
    row.appendChild(bar);

    return row;

}



// spacer
function createSpacer() {

    const s = document.createElement("div");
    s.style.height = "40px";

    return s;

}