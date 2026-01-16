// chart.js - Enhanced version with titles and emoji table

let analysisChart = null;
let pieChart = null;
let EmojipieChart = null;

/**
 * Safely destroys and clears the data table
 */
function destroyTable() {
    const container = document.getElementById("table-container");
    if (container) {
        container.innerHTML = "";
        container.style.display = "none";
    }
}

/**
 * Safely destroys and clears the emoji table
 */
function destroyEmojiTable() {
    const container = document.getElementById("emoji-table-container");
    if (container) {
        container.innerHTML = "";
        container.style.display = "none";
    }
}

/**
 * Destroys existing chart instance if present
 */
function destroyChart(chartInstance) {
    if (chartInstance) {
        chartInstance.destroy();
        return null;
    }
    return chartInstance;
}

/* ===================== BAR CHART ===================== */
/**
 * Renders a bar chart showing messages, media, and links
 * @param {Object} data - Contains num_messages, num_medias, num_links
 */
function renderBarChart(data) {
    try {
        const canvas = document.getElementById("analysisChart");
        if (!canvas) {
            console.error("Bar chart canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");

        // Destroy previous chart instance
        analysisChart = destroyChart(analysisChart);

        const chartData = {
            labels: ["Messages", "Media Shared", "Links Shared"],
            datasets: [{
                label: "Chat Analysis",
                data: [
                    data.num_messages ?? 0,
                    data.num_medias ?? 0,
                    data.num_links ?? 0,
                ],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(67, 233, 123, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(67, 233, 123, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Chat Overview Statistics',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    color: '#2c3e50'
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        },
                        padding: 8
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 13,
                            weight: '500'
                        },
                        padding: 8
                    },
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };

        analysisChart = new Chart(ctx, {
            type: "bar",
            data: chartData,
            options: chartOptions
        });

        console.log("✅ Bar chart rendered successfully");

    } catch (err) {
        console.error("❌ Bar Chart Error:", err);
    }
}

/* ===================== USER PIE CHART ===================== */
/**
 * Renders a pie chart showing top 5 users by message share
 * @param {Object} data - Contains top_users and message_share arrays
 */
function renderPieChart(data) {
    try {
        const canvas = document.getElementById("pieChart");
        if (!canvas) {
            console.error("Pie chart canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");

        const tusers = data.top_users || [];
        const tshares = data.message_share || [];
        
        // Get top 5 users
        const users = tusers.slice(0, 5);
        const shares = tshares.slice(0, 5);

        if (!users.length || !shares.length) {
            console.warn("No pie chart data available");
            return;
        }

        // Show pie chart container
        const pieContainer = document.getElementById("pieChartContainer");
        if (pieContainer) {
            pieContainer.style.display = "block";
        }

        // Destroy previous chart instance
        pieChart = destroyChart(pieChart);

        // Dynamic color generation
        const backgroundColors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(240, 147, 251, 0.8)',
            'rgba(79, 172, 254, 0.8)',
            'rgba(67, 233, 123, 0.8)',
            'rgba(245, 87, 108, 0.8)'
        ];

        const borderColors = [
            'rgba(102, 126, 234, 1)',
            'rgba(240, 147, 251, 1)',
            'rgba(79, 172, 254, 1)',
            'rgba(67, 233, 123, 1)',
            'rgba(245, 87, 108, 1)'
        ];

        const chartData = {
            labels: users,
            datasets: [{
                data: shares,
                backgroundColor: backgroundColors.slice(0, users.length),
                borderColor: borderColors.slice(0, users.length),
                borderWidth: 2,
                hoverOffset: 15
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Top 5 Most Active Users',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#2c3e50'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} messages (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };

        pieChart = new Chart(ctx, {
            type: "pie",
            data: chartData,
            options: chartOptions
        });

        console.log("✅ Pie chart rendered successfully");

    } catch (err) {
        console.error("❌ Pie Chart Error:", err);
    }
}

/* ===================== USER DATA TABLE ===================== */
/**
 * Renders a table showing all users and their message counts
 * @param {Object} data - Contains top_users and message_share arrays
 */
function renderTable(data) {
    try {
        destroyTable();

        const users = data.top_users || [];
        const counts = data.message_share || [];

        if (!users.length || !counts.length) {
            console.warn("No table data available");
            return;
        }

        // Validate data consistency
        if (users.length !== counts.length) {
            console.error("User and count arrays length mismatch");
            return;
        }

        // Get container
        const container = document.getElementById("table-container");
        if (!container) {
            console.error("Table container not found");
            return;
        }

        // Clear and show container
        container.innerHTML = "";
        container.style.display = "block";

        // Create table element
        const table = document.createElement("table");
        table.id = "dataTable";

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const headers = ["Rank", "User", "Messages"];
        headers.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");

        users.forEach((user, index) => {
            const tr = document.createElement("tr");

            // Rank cell
            const tdRank = document.createElement("td");
            tdRank.textContent = index + 1;
            tdRank.style.fontWeight = "600";
            tdRank.style.color = "#667eea";

            // User cell
            const tdUser = document.createElement("td");
            tdUser.textContent = user;
            tdUser.style.fontWeight = "500";

            // Count cell
            const tdCount = document.createElement("td");
            tdCount.textContent = counts[index]?.toLocaleString() ?? "0";
            tdCount.style.fontWeight = "600";

            tr.appendChild(tdRank);
            tr.appendChild(tdUser);
            tr.appendChild(tdCount);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        console.log(`✅ Table rendered with ${users.length} rows`);

    } catch (err) {
        console.error("❌ Table Render Error:", err);
    }
}

/* ===================== EMOJI PIE CHART ===================== */
/**
 * Renders a pie chart showing top 5 emojis
 * @param {Object} data - Contains emoji_list [[emoji, count], ...]
 */
function renderEmojiPieChart(data) {
    try {
        const canvas = document.getElementById("EmojipieChart");
        if (!canvas) {
            console.error("Emoji pie chart canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");

        const emojiList = data.emoji_list || [];

        if (!emojiList.length) {
            console.warn("No emoji data available");
            return;
        }

        // Take top 5 emojis
        const topEmojis = emojiList.slice(0, 5);

        // Separate labels and values
        const labels = topEmojis.map(item => item[0]);
        const values = topEmojis.map(item => item[1]);

        // Show emoji pie chart container
        const EmojipieContainer = document.getElementById("EmojipieChartContainer");
        if (EmojipieContainer) {
            EmojipieContainer.style.display = "block";
        }

        // Destroy previous chart instance
        EmojipieChart = destroyChart(EmojipieChart);

        const backgroundColors = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(240, 147, 251, 0.8)',
            'rgba(79, 172, 254, 0.8)',
            'rgba(67, 233, 123, 0.8)',
            'rgba(245, 87, 108, 0.8)'
        ];

        const borderColors = [
            'rgba(102, 126, 234, 1)',
            'rgba(240, 147, 251, 1)',
            'rgba(79, 172, 254, 1)',
            'rgba(67, 233, 123, 1)',
            'rgba(245, 87, 108, 1)'
        ];

        const chartData = {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: borderColors.slice(0, labels.length),
                borderWidth: 2,
                hoverOffset: 15
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Top 5 Most Used Emojis',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    color: '#2c3e50'
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return {
                                        text: `${label}: ${value} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} times (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };

        EmojipieChart = new Chart(ctx, {
            type: "pie",
            data: chartData,
            options: chartOptions
        });

        console.log("✅ Emoji Pie Chart rendered");

    } catch (err) {
        console.error("❌ Emoji Pie Chart Error:", err);
    }
}

/* ===================== EMOJI DATA TABLE ===================== */
/**
 * Renders a table showing all emojis and their usage counts
 * @param {Object} data - Contains emoji_list [[emoji, count], ...]
 */
function renderEmojiTable(data) {
    try {
        destroyEmojiTable();

        const emojiList = data.emoji_list || [];

        if (!emojiList.length) {
            console.warn("No emoji table data available");
            return;
        }

        // Get container
        const container = document.getElementById("emoji-table-container");
        if (!container) {
            console.error("Emoji table container not found");
            return;
        }

        // Clear and show container
        container.innerHTML = "";
        container.style.display = "block";

        // Create table element
        const table = document.createElement("table");
        table.id = "emojiDataTable";

        // Create table header
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const headers = ["Rank", "Emoji", "Count"];
        headers.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");

        emojiList.forEach((item, index) => {
            const tr = document.createElement("tr");

            // Rank cell
            const tdRank = document.createElement("td");
            tdRank.textContent = index + 1;
            tdRank.style.fontWeight = "600";
            tdRank.style.color = "#667eea";

            // Emoji cell
            const tdEmoji = document.createElement("td");
            tdEmoji.textContent = item[0];
            tdEmoji.style.fontSize = "20px";

            // Count cell
            const tdCount = document.createElement("td");
            tdCount.textContent = item[1]?.toLocaleString() ?? "0";
            tdCount.style.fontWeight = "600";

            tr.appendChild(tdRank);
            tr.appendChild(tdEmoji);
            tr.appendChild(tdCount);
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);

        console.log(`✅ Emoji table rendered with ${emojiList.length} rows`);

    } catch (err) {
        console.error("❌ Emoji Table Render Error:", err);
    }
}

/* ===================== WORD CLOUD ===================== */
/**
 * Renders a word cloud from word frequency data
 * @param {Object} data - Contains word_cloud array of [word, frequency] pairs
 */
function renderWordCloud(data) {
    try {
        const canvas = document.getElementById("wordCloud");
        if (!canvas) {
            console.error("Word cloud canvas not found");
            return;
        }

        const wordCloudData = data.word_cloud || [];

        if (!wordCloudData.length) {
            console.warn("No word cloud data available");
            return;
        }

        // Clear canvas
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth || 800;
        canvas.height = canvas.offsetHeight || 500;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Get max frequency for scaling
        const maxFreq = Math.max(...wordCloudData.map(item => item[1]));
        const minFreq = Math.min(...wordCloudData.map(item => item[1]));

        // Color palette
        const colors = [
            '#667eea',
            '#764ba2',
            '#f093fb',
            '#f5576c',
            '#4facfe',
            '#00f2fe',
            '#43e97b',
            '#38f9d7'
        ];

        // Calculate font sizes
        const maxFontSize = 80;
        const minFontSize = 16;

        // Prepare words with positions
        const words = wordCloudData.slice(0, 50).map((item, index) => {
            const [word, freq] = item;
            const scale = (freq - minFreq) / (maxFreq - minFreq || 1);
            const fontSize = minFontSize + (maxFontSize - minFontSize) * scale;
            
            return {
                text: word,
                frequency: freq,
                fontSize: fontSize,
                color: colors[index % colors.length],
                placed: false,
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        });

        // Sort by frequency (largest first for better placement)
        words.sort((a, b) => b.fontSize - a.fontSize);

        // Simple spiral placement algorithm
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const placedRects = [];

        function checkCollision(x, y, width, height) {
            const margin = 8;
            return placedRects.some(rect => 
                x < rect.x + rect.width + margin &&
                x + width + margin > rect.x &&
                y < rect.y + rect.height + margin &&
                y + height + margin > rect.y
            );
        }

        // Place words
        words.forEach(word => {
            ctx.font = `bold ${word.fontSize}px Arial, sans-serif`;
            const metrics = ctx.measureText(word.text);
            word.width = metrics.width;
            word.height = word.fontSize;

            let placed = false;
            let angle = 0;
            let radius = 0;
            const maxRadius = Math.min(canvas.width, canvas.height) / 2;

            // Spiral placement
            while (!placed && radius < maxRadius) {
                const x = centerX + radius * Math.cos(angle) - word.width / 2;
                const y = centerY + radius * Math.sin(angle) - word.height / 2;

                // Check bounds and collisions
                if (x >= 0 && x + word.width <= canvas.width &&
                    y >= 0 && y + word.height <= canvas.height &&
                    !checkCollision(x, y, word.width, word.height)) {
                    
                    word.x = x;
                    word.y = y;
                    word.placed = true;
                    placed = true;
                    
                    placedRects.push({
                        x: x,
                        y: y,
                        width: word.width,
                        height: word.height
                    });
                }

                angle += 0.3;
                if (angle > Math.PI * 2) {
                    angle = 0;
                    radius += 5;
                }
            }
        });

        // Draw words
        words.forEach(word => {
            if (word.placed) {
                ctx.font = `bold ${word.fontSize}px Arial, sans-serif`;
                ctx.fillStyle = word.color;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                ctx.fillText(word.text, word.x, word.y);
            }
        });

        console.log(`✅ Word cloud rendered with ${words.filter(w => w.placed).length} words`);

    } catch (err) {
        console.error("❌ Word Cloud Error:", err);
    }
}
let timelineChart = null;

/**
 * Renders a line chart showing message count per month
 * @param {Object} data - Contains monthly_timeline [[month, count], ...]
 */
function renderLineChartM(data) {
    try {
        const canvas = document.getElementById("timelineChartM");
        if (!canvas) {
            console.error("Timeline chart canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");
        // Separate months and counts
        const months = data.time_m || [];
        const counts = data.message_cont_m || [];

        if (!months) {
            console.warn("No monthly timeline data available");
            return;
        }

        // Show timeline chart container
        const timelineContainer = document.getElementById("timelineChartContainer");
        if (timelineContainer) {
            timelineContainer.style.display = "block";
        }

        // Destroy previous chart instance
        timelineChart = destroyChart(timelineChart);



        const chartData = {
            labels: months,
            datasets: [{
                label: 'Messages per Month',
                data: counts,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 3
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Message Activity Over Time',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    color: '#2c3e50'
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `Messages: ${value.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        },
                        padding: 8,
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Number of Messages',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: {
                            top: 10,
                            bottom: 0
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        padding: 8,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: {
                            top: 10,
                            bottom: 0
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };

        timelineChart = new Chart(ctx, {
            type: "line",
            data: chartData,
            options: chartOptions
        });

        console.log("✅ Timeline chart rendered successfully");

    } catch (err) {
        console.error("❌ Timeline Chart Error:", err);
    }
}
/**
 * Renders a line chart showing message count per month
 * @param {Object} data - Contains monthly_timeline [[month, count], ...]
 */
function renderLineChartD(data) {
    try {
        const canvas = document.getElementById("timelineChartD");
        if (!canvas) {
            console.error("Timeline chart canvas not found");
            return;
        }

        const ctx = canvas.getContext("2d");
        // Separate months and counts
        const months = data.time_d || [];
        const counts = data.message_cont_d|| [];

        if (!months) {
            console.warn("No monthly timeline data available");
            return;
        }

        // Show timeline chart container
        const timelineContainer = document.getElementById("timelineChartContainer");
        if (timelineContainer) {
            timelineContainer.style.display = "block";
        }

        // Destroy previous chart instance
        timelineChart = destroyChart(timelineChart);



        const chartData = {
            labels: months,
            datasets: [{
                label: 'Messages per Day',
                data: counts,
                borderColor: 'rgb(33, 69, 233)',
                backgroundColor: 'rgba(20, 50, 184, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgb(25, 54, 181)',
                pointBorderColor: '#dad6d6',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: 'rgb(47, 76, 206)',
                pointHoverBorderColor: '#fdad6d6ff',
                pointHoverBorderWidth: 3
            }]
        };

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Message Activity Over Time',
                    font: {
                        size: 20,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    },
                    color: '#2c3e50'
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14,
                            weight: '600'
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            return `Messages: ${value.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12
                        },
                        padding: 8,
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Number of Messages',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: {
                            top: 10,
                            bottom: 0
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        padding: 8,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            size: 13,
                            weight: '600'
                        },
                        padding: {
                            top: 10,
                            bottom: 0
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };

        timelineChart = new Chart(ctx, {
            type: "line",
            data: chartData,
            options: chartOptions
        });

        console.log("✅ Timeline chart rendered successfully");

    } catch (err) {
        console.error("❌ Timeline Chart Error:", err);
    }
}

/* ===================== UTILITY FUNCTIONS ===================== */
/**
 * Renders all visualizations at once
 * @param {Object} data - Complete analysis data
 */
function renderAllVisualizations(data) {
    if (!data) {
        console.error("No data provided for visualization");
        return;
    }

    renderBarChart(data);
    renderPieChart(data);
    renderTable(data);
    renderEmojiPieChart(data);
    renderEmojiTable(data);
    renderLineChartM(data)
    renderLineChartD(data)
}

/**
 * Clears all charts and tables
 */
function clearAllVisualizations() {
    analysisChart = destroyChart(analysisChart);
    pieChart = destroyChart(pieChart);
    EmojipieChart = destroyChart(EmojipieChart);
    timelineChart=destroyChart(timelineChart);
    destroyTable();
    destroyEmojiTable();
    
    const pieContainer = document.getElementById("pieChartContainer");
    if (pieContainer) {
        pieContainer.style.display = "none";
    }
    
    const EmojipieContainer = document.getElementById("EmojipieChartContainer");
    if (EmojipieContainer) {
        EmojipieContainer.style.display = "none";
    }
        const timelineContainer = document.getElementById("timelineChartContainer");
    if (timelineContainer) {
        timelineContainer.style.display = "none";
    }
    console.log("✅ All visualizations cleared");
}