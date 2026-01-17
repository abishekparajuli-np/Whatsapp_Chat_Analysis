// script.js - Enhanced version with better UX and error handling

/* ===================== UTILITY FUNCTIONS ===================== */

/**
 * Shows a loading state on a button
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = "Processing...";
        button.style.opacity = "0.7";
        button.style.cursor = "not-allowed";
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || "Analyze";
        button.style.opacity = "1";
        button.style.cursor = "pointer";
    }
}

/**
 * Shows a custom notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of message ('success', 'error', 'warning')
 */
function showNotification(message, type = 'error') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    // Color based on type
    const colors = {
        success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        error: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
        warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    notification.style.background = colors[type] || colors.error;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

/**
 * Validates if a file is a valid text file
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid
 */
function isValidChatFile(file) {
    if (!file) return false;
    
    const validExtensions = ['.txt', '.text'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const isValidSize = file.size <= maxSize;
    
    if (!isValidExtension) {
        showNotification('Please upload a valid text file (.txt)', 'error');
        return false;
    }
    
    if (!isValidSize) {
        showNotification('File size must be less than 10MB', 'error');
        return false;
    }
    
    return true;
}

/**
 * Updates the file upload label with filename
 * @param {string} fileName - Name of uploaded file
 */
function updateFileLabel(fileName) {
    const label = document.querySelector('#uploadForm label[for="chat_file"]');
    if (label) {
        if (fileName) {
            label.textContent = `✓ ${fileName}`;
            label.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        } else {
            label.textContent = 'Upload Chat File';
            label.style.background = '#007bff';
        }
    }
}

/**
 * Resets the analysis UI
 */
function resetAnalysisUI() {
    const stats = document.getElementById('stats');
    if (stats) {
        stats.style.display = 'none';
    }
    
    clearAllVisualizations();
}

/* ===================== FILE UPLOAD HANDLER ===================== */

/**
 * Handles chat file upload and populates user dropdown
 */
document.getElementById('uploadForm').addEventListener('change', async (event) => {
    if (event.target.id === 'chat_file') {
        const chatFile = event.target.files[0];

        // Validate file
        if (!isValidChatFile(chatFile)) {
            event.target.value = ''; // Clear the input
            updateFileLabel('');
            return;
        }

        // Update UI
        updateFileLabel(chatFile.name);
        resetAnalysisUI();

        const formData = new FormData();
        formData.append('chat_file', chatFile);

        // Show loading state
        const userDropdown = document.getElementById('user_dropdown');
        userDropdown.disabled = true;
        userDropdown.innerHTML = '<option disabled selected value="">Loading users...</option>';

        try {
            const response = await fetch('/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.error || 'Failed to upload the chat file');
            }

            const data = await response.json();

            // Reset and populate dropdown
            userDropdown.innerHTML = '<option disabled selected value="">Select a User</option>';
            
            if (!data.user_list || data.user_list.length === 0) {
                throw new Error('No users found in the chat file');
            }

            // Add 'Overall' option first if available
            if (data.user_list.includes('Overall')) {
                const overallOption = document.createElement('option');
                overallOption.value = 'Overall';
                overallOption.textContent = '📊 Overall Analysis';
                overallOption.style.fontWeight = 'bold';
                userDropdown.appendChild(overallOption);
            }

            // Add separator
            const separator = document.createElement('option');
            separator.disabled = true;
            separator.textContent = '──────────────';
            userDropdown.appendChild(separator);

            // Populate with individual users
            data.user_list
                .filter(user => user !== 'Overall')
                .forEach(user => {
                    const option = document.createElement('option');
                    option.value = user;
                    option.textContent = `👤 ${user}`;
                    userDropdown.appendChild(option);
                });

            userDropdown.disabled = false;
            showNotification(`File uploaded successfully! ${data.user_list.length} users found.`, 'success');

        } catch (error) {
            console.error('File upload error:', error);
            showNotification(error.message || 'Failed to process the uploaded file', 'error');
            
            // Reset UI
            userDropdown.innerHTML = '<option disabled selected value="">Select a User</option>';
            userDropdown.disabled = false;
            event.target.value = '';
            updateFileLabel('');
        }
    }
});

/* ===================== ANALYZE BUTTON HANDLER ===================== */

/**
 * Handles the analyze button click to fetch stats and render visualizations
 */
document.getElementById('analyze').addEventListener('click', async () => {
    const userDropdown = document.getElementById('user_dropdown');
    const selectedUser = userDropdown.value;
    const chatFileInput = document.getElementById('chat_file');
    const chatFile = chatFileInput.files[0];
    const analyzeButton = document.getElementById('analyze');

    // Validation
    if (!chatFile) {
        showNotification('Please upload a chat file first', 'warning');
        return;
    }

    if (!selectedUser) {
        showNotification('Please select a user to analyze', 'warning');
        return;
    }

    // Show loading state
    setButtonLoading(analyzeButton, true);
    resetAnalysisUI();

    try {
        // Fetch stats from backend
        const response = await fetch('/fetch_stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selected_user: selectedUser,
                file_name: chatFile.name,
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Failed to fetch statistics');
        }

        const data = await response.json();

        if (!data.results) {
            throw new Error('No results returned from server');
        }

        // Update Stats Cards with animation
        updateStatsCards(data.results);

        // Render Bar Chart
        renderBarChart(data.results);
        renderWordCloud(data.results);
        renderEmojiPieChart(data.results);
        renderEmojiTable(data.results);
        renderLineChartM(data.results);
        renderLineChartD(data.results);
        renderLineChartH(data.results);
        renderDayBarChart(data.results);     
        renderMonthBarChart(data.results);
        renderHeatmap(data.results);

        // Handle Pie Chart and Table for Overall analysis
        const pieChartContainer = document.getElementById('pieChartContainer');
        const isOverallAnalysis = selectedUser === 'Overall';
        const hasUserData = data.results.top_users && data.results.top_users.length > 0;

        if (isOverallAnalysis && hasUserData) {
            pieChartContainer.style.display = 'block';
            renderPieChart(data.results);
            renderTable(data.results);
        } else {
            pieChartContainer.style.display = 'none';
            
            // Clear pie chart and table for individual user analysis
            if (typeof pieChart !== 'undefined' && pieChart !== null) {
                pieChart.destroy();
                pieChart = null;
            }
            destroyTable();
        }

        // Smooth scroll to stats
        document.getElementById('stats').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });

        showNotification('Analysis completed successfully!', 'success');

    } catch (error) {
        console.error('Analysis error:', error);
        showNotification(error.message || 'Failed to analyze chat data', 'error');
        resetAnalysisUI();
    } finally {
        // Reset button state
        setButtonLoading(analyzeButton, false);
    }
});

/* ===================== STATS CARD UPDATER ===================== */

/**
 * Updates stats cards with animation
 * @param {Object} results - Analysis results
 */
function updateStatsCards(results) {
    const stats = document.getElementById('stats');
    const numMessages = document.getElementById('num_messages');
    const numWords = document.getElementById('num_words');
    const numMedias = document.getElementById('num_medias');
    const numLinks = document.getElementById('num_links');

    // Show stats section
    stats.style.display = 'flex';

    // Animate numbers
    animateValue(numMessages, 0, results.num_messages || 0, 800);
    animateValue(numWords, 0, results.num_words || 0, 800);
    animateValue(numMedias, 0, results.num_medias || 0, 800);
    animateValue(numLinks, 0, results.num_links || 0, 800);
}

/**
 * Animates a number from start to end
 * @param {HTMLElement} element - Element to update
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 */
function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (difference * easeOutQuart));
        
        element.textContent = currentValue.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/* ===================== ADD ANIMATION STYLES ===================== */

// Add CSS animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
`;
document.head.appendChild(style);

/* ===================== INITIALIZATION ===================== */

console.log('✅ WhatsApp Chat Analyzer initialized successfully');