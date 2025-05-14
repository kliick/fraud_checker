const formSwitch = document.getElementById('formSwitch');
const uploadBtn = document.getElementById('uploadBtn');
const fillBtn = document.getElementById('fillBtn');

const form = document.getElementById('predictForm');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const statusDisplay = document.getElementById('dropZoneStatus');
const fileNameDisplay = document.getElementById('fileName');

const formZone = document.getElementById('formZone');

const errorText = document.getElementById('errorDiv');

const resultElement = document.getElementById('result');
const resultTable = document.getElementById('resultTableDiv');

uploadBtn.addEventListener('click', () => {
    uploadBtn.classList.add('active');
    fillBtn.classList.remove('active');

    dropZone.style.display = 'block';
    formZone.style.display = 'none';
});

fillBtn.addEventListener('click', () => {
    fillBtn.classList.add('active');
    uploadBtn.classList.remove('active');

    dropZone.style.display = 'none';
    formZone.style.display = 'block';
    fillForm();
});

// Клик по дропзоне открывает выбор файла
dropZone.addEventListener('click', (e) => {
    if (e.target === dropZone || e.target === fileNameDisplay) {
        fileInput.value == "";
        fileInput.click();
    }
    });

// Обработка выбора файла
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
    fileNameDisplay.textContent = fileInput.files[0].name;
    statusDisplay.textContent = "Обработка...";
    form.requestSubmit();
    }
});

// Drag events
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
    fileInput.files = files;
    fileNameDisplay.textContent = files[0].name;
    statusDisplay.textContent = "Файл загружен";
    form.requestSubmit();
    }
});

// Работа с файлом
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
    const response = await fetch('/predict_file', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();

    if (!response.ok || result.error) {
        let errorMessage = result.error || "Неизвестная ошибка";

        // Если есть missing_columns, добавляем их к сообщению
        if (result.missing_columns) {
        errorMessage += `:\n${result.missing_columns.join(', ')}`;
        }
        
        errorText.innerText = errorMessage;
        throw new Error(errorMessage);
    }

    // Получаем результаты
    const predictions = result.prediction;
    const probabilities = result.probability;

    // Сохраняем для кнопок экспорта
    window._resultsData = predictions.map((pred, idx) => ({
        idx: idx+1,
        prediction: pred,
        probability: probabilities[idx]
    }));

    displayResults(window._resultsData);

    } catch (error) {
    statusDisplay.textContent = 'Повторите загрузку';
    errorText.innerHTML = `<p style="color: red;">Ошибка: ${error.message}</p>`;
    }
});

function displayResults(data) {
    // Скрываем форму
    resultElement.style.display = 'block';
    formSwitch.style.display = 'none';
    form.style.display = 'none';

    const tbody = document.querySelector('#resultTable tbody');
    if (!tbody) {
    console.error('tbody не найден');
    return;
    }
    tbody.innerHTML = "";

    data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.idx}</td><td>${row.prediction}</td><td>${row.probability.toFixed(4)}</td>`;
    tbody.appendChild(tr);
    });
}

document.getElementById('backIndexButton').addEventListener('click', () => {
    dropZone.style.display = 'flex';
    resultElement.style.display = 'none';
    formSwitch.style.display = 'flex';
    form.style.display = 'block';
    
    fileInput.value = "";
    statusDisplay.textContent = "Файл не выбран";

    document.querySelector('#result tbody').innerHTML = "";
});

function downloadCSV() {
    const data = window._resultsData || [];
    const csv = 'Prediction,Probability\n' + data.map(row => `${row.prediction},${row.probability}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.csv';
    link.click();
}

function downloadJSON() {
    const data = window._resultsData || [];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'results.json';
    link.click();
}

function fillForm() {
    return;
}