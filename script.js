"use strict";

const dateElement = document.querySelector("#today-date");
const dateInput = document.querySelector("#event-date");
const form = document.querySelector("#event-form");
const feedback = document.querySelector("#form-feedback");
const weekdayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

function getTodayAtLocalMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderToday() {
  const today = getTodayAtLocalMidnight();
  const formattedDate = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(today);

  if (dateElement) dateElement.textContent = `${formattedDate} · ${weekdayNames[today.getDay()]}`;
  if (dateInput) dateInput.value = toDateInputValue(today);
}

function updateTaskProgress() {
  const checkboxes = Array.from(document.querySelectorAll(".task-checkbox"));
  const completed = checkboxes.filter((checkbox) => checkbox.checked).length;
  const total = checkboxes.length;
  const countElement = document.querySelector("#task-progress-count");
  const progressElement = document.querySelector("#progress-fill");

  checkboxes.forEach((checkbox) => {
    const item = checkbox.closest(".task-item");
    if (item) item.classList.toggle("is-done", checkbox.checked);
  });

  if (countElement) countElement.textContent = `${completed} / ${total}`;
  if (progressElement) progressElement.style.width = `${total ? (completed / total) * 100 : 0}%`;
}

renderToday();
updateTaskProgress();

document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
  checkbox.addEventListener("change", updateTaskProgress);
});

document.querySelectorAll("[data-focus]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.focus);
    target?.focus();
    target?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const values = new FormData(form);
  const [year, month, day] = String(values.get("date")).split("-").map(Number);
  const selectedDate = new Date(year, month - 1, day);
  const formattedDate = new Intl.DateTimeFormat("zh-TW", {
    month: "long",
    day: "numeric",
  }).format(selectedDate);
  const title = String(values.get("title")).trim();
  const time = String(values.get("time"));
  const category = String(values.get("category"));

  if (feedback) {
    feedback.textContent = `已在本頁建立「${title}」：${formattedDate} ${time} · ${category}。此示範不會連線或儲存資料。`;
  }
});
