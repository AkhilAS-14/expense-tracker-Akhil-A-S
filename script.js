const transactionForm = document.getElementById("transaction-form");
const editForm = document.getElementById("edit-form");

const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");

const balanceElement = document.getElementById("balance");
const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const transactionList = document.getElementById("transaction-list");
const transactionCount = document.getElementById("transaction-count");
const emptyState = document.getElementById("empty-state");

const typeFilter = document.getElementById("type-filter");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search");

const monthFilter = document.getElementById("month-filter");
const monthlyIncomeElement = document.getElementById("monthly-income");
const monthlyExpensesElement = document.getElementById("monthly-expenses");
const monthlyBalanceElement = document.getElementById("monthly-balance");
const categoryChart = document.getElementById("category-chart");

const formError = document.getElementById("form-error");

const editModal = document.getElementById("edit-modal");
const closeModalButton = document.getElementById("close-modal");
const cancelEditButton = document.getElementById("cancel-edit");

const editIdInput = document.getElementById("edit-id");
const editTypeInput = document.getElementById("edit-type");
const editAmountInput = document.getElementById("edit-amount");
const editCategoryInput = document.getElementById("edit-category");
const editDateInput = document.getElementById("edit-date");
const editDescriptionInput = document.getElementById("edit-description");
const editError = document.getElementById("edit-error");

let transactions = JSON.parse(localStorage.getItem("expenseTrackerTransactions")) || [];

function getTodayDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCurrentMonth() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(date) {
    if (!date) {
        return "";
    }

    const dateObject = new Date(`${date}T00:00:00`);

    return dateObject.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function saveTransactions() {
    localStorage.setItem(
        "expenseTrackerTransactions",
        JSON.stringify(transactions)
    );
}

function updateSummary() {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
        const amount = Number(transaction.amount);

        if (transaction.type === "income") {
            totalIncome += amount;
        } else {
            totalExpenses += amount;
        }
    });

    const balance = totalIncome - totalExpenses;

    totalIncomeElement.textContent = formatCurrency(totalIncome);
    totalExpensesElement.textContent = formatCurrency(totalExpenses);
    balanceElement.textContent = formatCurrency(balance);
}

function getFilteredTransactions() {
    const selectedType = typeFilter.value;
    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.trim().toLowerCase();

    return transactions.filter((transaction) => {
        const type = String(transaction.type || "").toLowerCase();
        const category = String(transaction.category || "").toLowerCase();
        const description = String(transaction.description || "").toLowerCase();
        const amount = String(transaction.amount || "").toLowerCase();
        const date = String(transaction.date || "").toLowerCase();

        const matchesType =
            selectedType === "all" ||
            type === selectedType.toLowerCase();

        const matchesCategory =
            selectedCategory === "all" ||
            category === selectedCategory.toLowerCase();

        const matchesSearch =
            searchTerm === "" ||
            category.includes(searchTerm) ||
            description.includes(searchTerm) ||
            amount.includes(searchTerm) ||
            date.includes(searchTerm);

        return matchesType && matchesCategory && matchesSearch;
    });
}

function renderTransactions() {
    const filteredTransactions = getFilteredTransactions();

    transactionList.innerHTML = "";

    if (filteredTransactions.length === 0) {
        transactionList.appendChild(emptyState);
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";

        filteredTransactions.sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        filteredTransactions.forEach((transaction) => {
            const transactionItem = document.createElement("div");

            transactionItem.className = "transaction-item";

            const sign = transaction.type === "income" ? "+" : "-";
            const amountClass =
                transaction.type === "income"
                    ? "income-amount"
                    : "expense-amount";

            transactionItem.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-title">
                        ${escapeHTML(transaction.category)}
                    </div>

                    <div class="transaction-description">
                        ${escapeHTML(transaction.description)}
                    </div>

                    <div class="transaction-meta">
                        <span class="category-badge">
                            ${escapeHTML(transaction.category)}
                        </span>

                        <span>
                            ${formatDate(transaction.date)}
                        </span>
                    </div>
                </div>

                <div class="transaction-right">

                    <div class="transaction-amount ${amountClass}">
                        ${sign}${formatCurrency(Number(transaction.amount))}
                    </div>

                    <div class="transaction-actions">

                        <button
                            type="button"
                            class="action-btn edit-btn"
                            data-id="${transaction.id}"
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            class="action-btn delete-btn"
                            data-id="${transaction.id}"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;

            transactionList.appendChild(transactionItem);
        });
    }

    transactionCount.textContent =
        `${filteredTransactions.length} transaction${filteredTransactions.length === 1 ? "" : "s"}`;
}

function escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

function updateMonthlySummary() {
    const selectedMonth = monthFilter.value;

    let monthlyIncome = 0;
    let monthlyExpenses = 0;

    transactions.forEach((transaction) => {
        if (transaction.date.startsWith(selectedMonth)) {
            const amount = Number(transaction.amount);

            if (transaction.type === "income") {
                monthlyIncome += amount;
            } else {
                monthlyExpenses += amount;
            }
        }
    });

    const monthlyBalance = monthlyIncome - monthlyExpenses;

    monthlyIncomeElement.textContent = formatCurrency(monthlyIncome);
    monthlyExpensesElement.textContent = formatCurrency(monthlyExpenses);
    monthlyBalanceElement.textContent = formatCurrency(monthlyBalance);

    renderCategoryChart(selectedMonth);
}

function renderCategoryChart(selectedMonth) {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
        if (
            transaction.type === "expense" &&
            transaction.date.startsWith(selectedMonth)
        ) {
            const category = transaction.category;
            const amount = Number(transaction.amount);

            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }

            categoryTotals[category] += amount;
        }
    });

    categoryChart.innerHTML = "";

    const categories = Object.entries(categoryTotals);

    if (categories.length === 0) {
        categoryChart.innerHTML = `
            <div class="empty-chart">
                <p>No expense data available.</p>
            </div>
        `;

        return;
    }

    categories.sort((a, b) => b[1] - a[1]);

    const highestAmount = categories[0][1];

    categories.forEach(([category, amount]) => {
        const percentage = (amount / highestAmount) * 100;

        const row = document.createElement("div");

        row.className = "category-row";

        row.innerHTML = `
            <div class="category-name">
                ${escapeHTML(category)}
            </div>

            <div class="category-bar-container">
                <div
                    class="category-bar"
                    style="width: ${percentage}%"
                ></div>
            </div>

            <div class="category-value">
                ${formatCurrency(amount)}
            </div>
        `;

        categoryChart.appendChild(row);
    });
}

function validateTransaction(type, amount, category, date, description) {
    if (!type) {
        return "Please select a transaction type.";
    }

    if (!amount || Number(amount) <= 0) {
        return "Please enter an amount greater than 0.";
    }

    if (!category) {
        return "Please select a category.";
    }

    if (!date) {
        return "Please select a date.";
    }

    if (!description.trim()) {
        return "Please enter a description.";
    }

    return "";
}

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    formError.textContent = "";

    const type = document.querySelector(
        'input[name="transaction-type"]:checked'
    ).value;

    const amount = amountInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value.trim();

    const error = validateTransaction(
        type,
        amount,
        category,
        date,
        description
    );

    if (error) {
        formError.textContent = error;
        return;
    }

    const transaction = {
        id: Date.now(),
        type: type,
        amount: Number(amount),
        category: category,
        date: date,
        description: description
    };

    transactions.push(transaction);

    saveTransactions();

    transactionForm.reset();

    dateInput.value = getTodayDate();

    document.querySelector(
        'input[name="transaction-type"][value="income"]'
    ).checked = true;

    formError.textContent = "";

    updateApplication();
});

function openEditModal(id) {
    const transaction = transactions.find(
        (item) => item.id === id
    );

    if (!transaction) {
        return;
    }

    editIdInput.value = transaction.id;
    editTypeInput.value = transaction.type;
    editAmountInput.value = transaction.amount;
    editCategoryInput.value = transaction.category;
    editDateInput.value = transaction.date;
    editDescriptionInput.value = transaction.description;

    editError.textContent = "";

    editModal.classList.remove("hidden");
}

function closeEditModal() {
    editModal.classList.add("hidden");
    editError.textContent = "";
}

editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    editError.textContent = "";

    const id = Number(editIdInput.value);
    const type = editTypeInput.value;
    const amount = editAmountInput.value;
    const category = editCategoryInput.value;
    const date = editDateInput.value;
    const description = editDescriptionInput.value.trim();

    const error = validateTransaction(
        type,
        amount,
        category,
        date,
        description
    );

    if (error) {
        editError.textContent = error;
        return;
    }

    const transactionIndex = transactions.findIndex(
        (transaction) => transaction.id === id
    );

    if (transactionIndex === -1) {
        editError.textContent = "Transaction not found.";
        return;
    }

    transactions[transactionIndex] = {
        id: id,
        type: type,
        amount: Number(amount),
        category: category,
        date: date,
        description: description
    };

    saveTransactions();

    closeEditModal();

    updateApplication();
});

function deleteTransaction(id) {
    const transaction = transactions.find(
        (item) => item.id === id
    );

    if (!transaction) {
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
        return;
    }

    transactions = transactions.filter(
        (item) => item.id !== id
    );

    saveTransactions();

    updateApplication();
}

transactionList.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);

    if (button.classList.contains("edit-btn")) {
        openEditModal(id);
    }

    if (button.classList.contains("delete-btn")) {
        deleteTransaction(id);
    }
});

typeFilter.addEventListener("change", renderTransactions);
categoryFilter.addEventListener("change", renderTransactions);
searchInput.addEventListener("input", renderTransactions);

monthFilter.addEventListener("change", updateMonthlySummary);

closeModalButton.addEventListener("click", closeEditModal);
cancelEditButton.addEventListener("click", closeEditModal);

editModal.addEventListener("click", function (event) {
    if (event.target === editModal) {
        closeEditModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !editModal.classList.contains("hidden")) {
        closeEditModal();
    }
});

function updateApplication() {
    updateSummary();
    renderTransactions();
    updateMonthlySummary();
}

dateInput.value = getTodayDate();
monthFilter.value = getCurrentMonth();

updateApplication();