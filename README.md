# 📱 WhatsApp Chat Analysis

A **production-ready web application** for analyzing and visualizing WhatsApp chat exports. The project transforms raw chat data into **clear, interactive insights** about communication patterns, user behavior, language usage, and engagement trends.

This application demonstrates strong skills in **Python, Flask, data analysis, and frontend visualization**, making it suitable for real-world analytics use cases.

![Python](https://img.shields.io/badge/Python-3.x-blue.svg)
![Flask](https://img.shields.io/badge/Flask-Web_Framework-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🌟 Key Features

* **📊 Statistics Dashboard**
  Provides core chat metrics such as total messages, total words, media shared, and links exchanged.

* **👥 User Activity Analysis**
  Identifies the most active participants in group chats and shows individual contribution levels.

* **📈 Timeline Visualizations**

  * Monthly messaging trends
  * Daily activity patterns
  * Hourly distribution of messages

* **☁️ Word Cloud Analysis**
  Visualizes frequently used words after cleaning stop-words, system messages, and noise.

* **😀 Emoji Insights**
  Displays emoji usage through charts and tables, highlighting communication style and sentiment.

* **🗓️ Activity Heatmap**
  Reveals messaging intensity across days of the week and hours of the day.

* **📅 Day & Month Comparisons**
  Bar charts to compare activity across weekdays and months for deeper behavioral insights.

---

## 🛠️ Technology Stack

### Backend

* **Python**
* **Flask** – RESTful web application framework

### Frontend

* **HTML, CSS, JavaScript**
* **Chart.js** – Interactive and responsive data visualizations

### Data Processing & NLP

* **Pandas & NumPy** – Data cleaning and analysis
* **URLExtract** – Link detection
* **emoji** – Emoji extraction and frequency analysis
* **wordcloud** – Word cloud generation

---

## 📁 Project Structure

```
Whatsapp_Chat_Analysis/
├── app.py                          # Application entry point
├── main/
│   ├── __init__.py                 # Flask app initialization
│   ├── routes.py                   # API routes and endpoints
│   ├── preprocessor.py             # Chat parsing and preprocessing
│   ├── helper.py                   # Analysis and aggregation logic
│   ├── templates/
│   │   └── whatsapp_chat_analysis.html  # Main UI template
│   └── static/
│       ├── css/
│       │   └── style.css           # Application styling
│       └── script/
│           ├── script.js           # Frontend logic
│           └── chart.js            # Chart rendering utilities
├── dataset/                        # Sample chat files
├── uploads/                        # Uploaded chat files
└── jupyternotebook/                # Development and experimentation
```


## 🚀 Getting Started

### Prerequisites

* Python 3.x
* pip (Python package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abishekparajuli-np/Whatsapp_Chat_Analysis.git
   cd Whatsapp_Chat_Analysis
   ```

2. **Create and activate a virtual environment (recommended)**

   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**

   ```bash
   pip install flask pandas numpy urlextract emoji wordcloud
   ```

4. **Run the application**

   ```bash
   python app.py
   ```

5. Open your browser and navigate to:
   **[http://localhost:5000](http://localhost:5000)**

---

## 📲 Exporting a WhatsApp Chat

1. Open WhatsApp and select the chat to analyze
2. Tap **⋮ → More → Export chat**
3. Choose **Without Media** for faster processing
4. Save the exported `.txt` file
5. Upload the file to the application



## 📖 How to Use

1. Upload a WhatsApp chat export (`.txt` file)
2. Select a specific user or choose **Overall** for group analysis
3. Click **Analyze** to generate insights
4. Explore dashboards, charts, and statistics


## 📊 Analysis Overview

| Feature        | Description                              |
| -------------- | ---------------------------------------- |
| Total Messages | Total number of messages sent            |
| Total Words    | Aggregate word count across all messages |
| Media Shared   | Number of media files exchanged          |
| Links Shared   | URLs detected in chat messages           |
| Busiest Users  | Most active participants in group chats  |
| Word Cloud     | Frequently used words visualization      |
| Emoji Analysis | Emoji usage frequency and distribution   |
| Timeline       | Messaging activity over time             |
| Heatmap        | Day-hour interaction intensity           |



🤝 Contributing

Contributions are welcome and appreciated.

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "Add YourFeature"`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request



 📝 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.



 👨‍💻 Author

**Abishek Parajuli**
GitHub: [@abishekparajuli-np](https://github.com/abishekparajuli-np)



 🙏 Acknowledgments

* **Chart.js** – Interactive charting library
* **Flask** – Lightweight and powerful web framework
* **Pandas** – Data manipulation and analysis


