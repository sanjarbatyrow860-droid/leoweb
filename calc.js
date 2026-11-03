"use strict";

const PRODUCTS = [
    {name: "Хлеб", price: 50},
    {name: "Молоко", price: 90},
    { name: 'Плавленный сыр "Viola" 200гр', price: 450},
    {name: 'Кофе в зёрнах "Nescafe" 500гр', price: 1200}
];
const QUANTITY_PATTERN = /^\d+$/;

// Калькулятор услуги: цены и правила показа опций/свойств по типам услуги.
const SERVICES = {
    consulting: {price: 1000, hasOptions: false, hasProperty: false},
    layout: {price: 3000, hasOptions: true, hasProperty: false},
    support: {price: 2000, hasOptions: false, hasProperty: true}
};
const SERVICE_OPTIONS = {
    standard: 0,
    responsive: 1000,
    animated: 2500
};
const SERVICE_PROPERTY_PRICE = 500;
const SERVICE_QUANTITY_PATTERN = /^[1-9]\d*$/;

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

function updateServicePrice() {
    const form = document.getElementById("service-form");
    const select = document.getElementById("service-select");
    const checkbox = document.getElementById("service-property-checkbox");
    const quantityText = document.getElementById("service-quantity").value.trim();
    const error = document.getElementById("service-error");
    const result = document.getElementById("service-result");
    const service = SERVICES[form.elements.serviceType.value];
    let price = service.price;

    // Показываем или скрываем select и чекбокс в зависимости от типа услуги.
    document.getElementById("service-options").hidden = !service.hasOptions;
    document.getElementById("service-property").hidden = !service.hasProperty;

    // Для скрытых элементов сбрасываем значения, чтобы они не влияли на цену.
    if (service.hasOptions) {
        price += SERVICE_OPTIONS[select.value];
    } else {
        select.selectedIndex = 0;
    }
    if (service.hasProperty) {
        if (checkbox.checked) {
            price += SERVICE_PROPERTY_PRICE;
        }
    } else {
        checkbox.checked = false;
    }

    error.textContent = "";
    result.textContent = "";

    if (!SERVICE_QUANTITY_PATTERN.test(quantityText)) {
        error.textContent = "Ошибка: введите целое число больше нуля.";
        return;
    }
    result.textContent = "Стоимость услуги: " +
            price * parseInt(quantityText, 10) + " руб.";
}

function initServiceCalculator() {
    const form = document.getElementById("service-form");

    form.addEventListener("input", updateServicePrice);
    form.addEventListener("change", updateServicePrice);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });
    updateServicePrice();
}

function init() {
    const form = document.getElementById("calc-form");

    initServiceCalculator();
    addRow();
    document.getElementById("add-button").addEventListener("click", addRow);
    document.getElementById("calc-button").addEventListener("click", calculate);
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        calculate();
    });
}

window.addEventListener("DOMContentLoaded", init);