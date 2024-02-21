document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
});

function toLocalDateString(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
}

function saveData() {
    const inputDate = document.getElementById('date').value;
    const date = new Date(inputDate);
    const dateString = toLocalDateString(date);
    const meals = document.getElementById('meals').value;
    const exercises = document.getElementById('exercises').value;
    const status = document.body.dataset.status || 'good';
    const imageFile = document.getElementById('imageFile').files[0];

    const reader = new FileReader();
    reader.onloadend = function() {
        const imageBase64 = reader.result;
        const data = { meals, exercises, status, image: imageBase64 };
        localStorage.setItem(dateString, JSON.stringify(data));
        alert('记录已保存！');
        renderCalendar();
    };
    if (imageFile) {
        reader.readAsDataURL(imageFile);
    } else {
        const data = { meals, exercises, status, image: null };
        localStorage.setItem(dateString, JSON.stringify(data));
        alert('记录已保存！');
        renderCalendar();
    }
}

function deleteData() {
    const inputDate = document.getElementById('date').value;
    const dateString = toLocalDateString(new Date(inputDate));
    localStorage.removeItem(dateString);
    alert('记录已删除！');
    renderCalendar();
}

function setStatus(status) {
    document.body.dataset.status = status;
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateString = toLocalDateString(date);
        const data = JSON.parse(localStorage.getItem(dateString));

        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        dayElement.addEventListener('click', function() { showDetails(dateString); });

        if (data) {
            dayElement.classList.add(data.status);
        }

        calendar.appendChild(dayElement);
    }
}

function showDetails(dateString) {
    const data = JSON.parse(localStorage.getItem(dateString));
    const modal = document.getElementById('detailsModal');
    const content = document.getElementById('detailsContent');
    content.innerHTML = ''; // 清空之前的内容

    if (data) {
        let detailsHtml = `<p>日期: ${dateString}</p>
                           <p>餐饮: ${data.meals}</p>
                           <p>运动: ${data.exercises}</p>
                           <p>状态: ${data.status}</p>`;
        if (data.image) {
            detailsHtml += `<img src="${data.image}" style="max-width:200px; display:block; margin-top:10px;">`; // 添加图片
        }
        content.innerHTML = detailsHtml;
        modal.style.display = 'flex'; // 显示模态框
    } else {
        alert('这一天没有记录。');
    }
}

function closeModal() {
    document.getElementById('detailsModal').style.display = 'none'; // 关闭模态框
}
       