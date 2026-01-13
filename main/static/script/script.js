// Event Listener for Upload (to Populate User Dropdown)
document.getElementById('uploadForm').addEventListener('change', async (event) => {
    if (event.target.id === 'chat_file') {
        const chatFile = event.target.files[0];

        if (!chatFile) {
            alert("Please upload a valid file.");
            return;
        }

        const formData = new FormData();
        formData.append('chat_file', chatFile);

        try {
            const response = await fetch('/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                alert(errorResponse.error || "Failed to upload the chat file.");
                return;
            }

            const data = await response.json();
            const userDropdown = document.getElementById('user_dropdown');

            userDropdown.innerHTML = '<option disabled selected value="">Select a User</option>'; // Reset dropdown

            // Populate the dropdown with user list
            data.user_list.forEach(user => {
                const option = document.createElement('option');
                option.value = user;
                option.textContent = user;
                userDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("An error occurred during file upload:", error);
            alert("Failed to process the uploaded file. Please try again.");
        }
    }
});

// Event Listener for Analyze Button (to Fetch Stats and Render Charts)
document.getElementById("analyze").addEventListener("click", async () => {
    const userDropdown = document.getElementById("user_dropdown");
    const selectedUser = userDropdown.value;

    const chatFileInput = document.getElementById("chat_file");
    const chatFile = chatFileInput.files[0];

    // Ensure a user and file are selected
    if (!selectedUser || !chatFile) {
        alert("Please select a user and upload a chat file before analyzing.");
        return;
    }

    try {
        // Fetch stats from backend
        const response = await fetch("/fetch_stats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                selected_user: selectedUser,
                file_name: chatFile.name,
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            alert(errorResponse.error || "Failed to fetch stats.");
            return;
        }

        const data = await response.json();

        // Update Stats Section
        const stats = document.getElementById("stats");
        const numMessages = document.getElementById("num_messages");
        const numWords = document.getElementById("num_words");
        const numMedias = document.getElementById("num_medias");
        const numLinks = document.getElementById("num_links");

        stats.style.display = "flex"; // Display the stats section
        numMessages.textContent = data.results.num_messages || 0;
        numWords.textContent = data.results.num_words || 0;
        numMedias.textContent = data.results.num_medias || 0;
        numLinks.textContent = data.results.num_links || 0;

        // Render Bar Chart
        renderBarChart(data.results);

        // Conditionally render the Pie Chart
        const pieChartContainer = document.getElementById("pieChartContainer");
if (
    selectedUser === 'Overall' &&
    data.results.top_users &&
    data.results.top_users.length > 0
) {
    pieChartContainer.style.display = "block";
    renderPieChart(data.results);
    renderTable(data.results);
} else {
    pieChartContainer.style.display = "none";

    // 🔥 destroy pie chart
    if (pieChart) {
        pieChart.destroy();
        pieChart = null;
    }

    // 🔥 destroy table
    destroyTable();
}
    } catch (error) {
        console.error("An error occurred during analysis:", error);
        alert("Failed to analyze the chat data. Please try again.");
    }
});
