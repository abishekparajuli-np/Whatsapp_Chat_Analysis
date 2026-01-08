document.getElementById('uploadForm').addEventListener('change', async (event) => {
    if (event.target.id === 'chat_file') {
        const formData = new FormData();
        formData.append('chat_file', event.target.files[0]);

        const response = await fetch('/', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        const userDropdown = document.getElementById('user_dropdown');
        userDropdown.innerHTML = '<option disabled selected value="">Select a User</option>';

        data.user_list.forEach(user => {
            const option = document.createElement('option');
            option.value = user;
            option.textContent = user;
            userDropdown.appendChild(option);
        });
    }
});

document.getElementById('analyze').addEventListener('click', async () => {
    const selectedUser = document.getElementById('user_dropdown').value;
    const chatFileName = document.getElementById('chat_file').files[0].name;

    const response = await fetch('/fetch_stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            selected_user: selectedUser,
            file_name: chatFileName
        })
    });

    const data = await response.json();
    const stats = document.getElementById('stats');
    const numMessages = document.getElementById('num_messages');
    const numWords = document.getElementById('num_words');
    const numMedias = document.getElementById('num_medias');
    const numLinks = document.getElementById('num_links');

    stats.style.display = 'flex';
    numMessages.textContent = data.results.num_messages;
    numWords.textContent = data.results.num_words;
    numMedias.textContent = data.results.num_medias;
    numLinks.textContent = data.results.num_links;
});