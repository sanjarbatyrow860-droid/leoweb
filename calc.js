"use strict";

const PRODUCTS = [
    {name: "Хлеб", price: 50},
    {name: "Молоко", price: 90},
    { name: 'Плавленный сыр "Viola" 200гр', price: 450},
    {name: 'Кофе в зёрнах "Nescafe" 500гр', price: 1200}
];
const QUANTITY_PATTERN = /^\d+$/;

function addRow() {
    const order = document.getElementById("order");
    const row = document.createElement("p");
    const select = document.createElement("select");
    const input = document.createElement("input");
    const remove = document.createElement("button");
    const sum = document.createElement("span");
    const error = document.createElement("span");

    row.className = "row";

    select.className = "product";
    select.setAttribute("aria-label", "Товар");
    PRODUCTS.forEach(function (product) {
        const option = document.createElement("option");
        option.value = String(product.price);
        option.textContent = product.name + " — " + product.price + " руб.";
        select.appendChild(option);
    });

    input.className = "quantity";
    input.type = "text";
    input.value = "1";
    input.size = 6;
    input.autocomplete = "off";
    input.setAttribute("aria-label", "Количество");

    remove.type = "button";
    remove.textContent = "Удалить";
    remove.addEventListener("click", function () {
        if (document.querySelectorAll("#order .row").length > 1) {
            row.remove();
        }
    });

    sum.className = "sum";
    error.className = "error";
    error.style.color = "red";

    row.append(select, " × ", input, " ", remove, " ", sum, error);
    order.appendChild(row);
}

function calculate() {
    const rows = document.querySelectorAll("#order .row");
    const result = document.getElementById("result");
    let total = 0;
    let valid = true;

    result.textContent = "";

    rows.forEach(function (row) {
        const text = row.querySelector(".quantity").value.trim();
        const error = row.querySelector(".error");
        const sum = row.querySelector(".sum");
        let cost = 0;

        error.textContent = "";
        sum.textContent = "";

        if (!QUANTITY_PATTERN.test(text)) {
            error.textContent = "Ошибка: допустимы только цифры.";
            valid = false;
        } else {
            cost = parseInt(row.querySelector(".product").value, 10) *
                    parseInt(text, 10);
            sum.textContent = "= " + cost + " руб.";
            total += cost;
        }
    });

    if (valid) {
        result.textContent = "Стоимость заказа: " + total + " руб.";
    }
    return false;
}

function init() {
    const form = document.getElementById("calc-form");

    addRow();
    document.getElementById("add-button").addEventListener("click", addRow);
    document.getElementById("calc-button").addEventListener("click", calculate);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        calculate();
    });
}

window.addEventListener("DOMContentLoaded", init);