// chart.js

let analysisChart = null;
let pieChart = null;
function destroyTable() {
    const container = document.getElementById("table-container");
    if (container) {
        container.innerHTML = ""; // ✅ remove table only
          container.style.display = "none";
    }
}



/* ===================== BAR CHART ===================== */
function renderBarChart(data) {
    try {
        const ctx = document.getElementById("analysisChart").getContext("2d");

        if (analysisChart) {
            analysisChart.destroy();
        }

        analysisChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Messages", "Media Shared", "Links Shared"],
                datasets: [{
                    label: "Chat Analysis",
                    data: [
                        data.num_messages ?? 0,
                        data.num_medias ?? 0,
                        data.num_links ?? 0,
                    ],
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

    } catch (err) {
        console.error("Bar Chart Error:", err);
    }
}

/* ===================== PIE CHART ===================== */
function renderPieChart(data) {
    const ctx = document.getElementById("pieChart")?.getContext("2d");
    if (!ctx) return;

    const tusers = data.top_users;
    const tshares = data.message_share;
    const users=tusers.slice(0,5);
    const shares=tshares.slice(0,5);

    if (!users || !shares || users.length === 0) {
        console.warn("No pie chart data");
        return;
    }

    if (pieChart) pieChart.destroy();

    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: users,
            datasets: [{
                data: shares
            }]
        },
        options: { responsive: true }
    });
}
function renderTable(data) {
    destroyTable(); 
    const tusers = data.top_users || [];
   const users=tusers.slice(0,10);
    const tcounts = data.message_share || [];
    const counts=tcounts.slice(0,10);

    if (users.length === 0 || counts.length === 0) {
        console.warn("No table data");
        return;
    }

    // Get or create container
    let container = document.getElementById("table-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "table-container";
        document.body.appendChild(container); // or append to a specific section
    }

    // Clear previous table
    container.innerHTML = "";
        container.style.display = "block";

    // Create table
    const table = document.createElement("table");
    table.id = "dataTable";

    // Create thead
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    ["USER", "COUNT"].forEach(text => {
        const th = document.createElement("th");
        th.textContent = text;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create tbody
    const tbody = document.createElement("tbody");

    for (let i = 0; i < users.length; i++) {
        const tr = document.createElement("tr");

        const tdUser = document.createElement("td");
        tdUser.textContent = users[i];

        const tdCount = document.createElement("td");
        tdCount.textContent = counts[i] ?? 0;

        tr.appendChild(tdUser);
        tr.appendChild(tdCount);
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    container.appendChild(table);
}
