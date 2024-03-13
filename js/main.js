let title = document.getElementById("title");
let price = document.getElementById("price");
let tax = document.getElementById("tax");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let submit = document.getElementById("submit");
let deleteAllBtn = document.getElementById("deleteAll");
let mood = "create";
let temp;

// Calculate Price Of Product

function getTotalPrice() {
  let priceVal = +price.value;
  let taxVal = +tax.value;
  let adsVal = +ads.value;
  let discountVal = +discount.value;
  if (priceVal !== "" && priceVal > 0) {
    if (taxVal >= 0 || taxVal === "") {
      if (adsVal >= 0 || adsVal === "") {
        if (discountVal >= 0 || discountVal === "") {
          total.textContent = priceVal + taxVal + adsVal - discountVal;
        }
      }
    }
  } else {
    total.textContent = "";
  }
}

[price, tax, ads, discount].forEach((item) =>
  item.addEventListener("keyup", getTotalPrice)
);

// Create New Product

let productData;
if (localStorage.product != null) {
  productData = JSON.parse(localStorage.product);
  readData();
} else {
  productData = [];
}

submit.addEventListener("click", (e) => {
  if (
    price.value === "" ||
    title.value === "" ||
    category.value === "" ||
    count.value > 100
  ) {
    e.preventDefault();
  } else {
    let product = {
      title: title.value.toLowerCase(),
      price: price.value,
      tax: tax.value,
      ads: ads.value,
      discount: discount.value,
      total: total.textContent,
      count: count.value,
      category: category.value.toLowerCase(),
    };

    // Create Multipule Products

    if (mood === "create") {
      if (product.count > 1) {
        for (let i = 0; i < product.count; i++) {
          productData.push(product);
        }
      } else {
        productData.push(product);
      }
    } else {
      productData[temp] = product;
      clearData();
      mood = "create";
      submit.innerHTML = "Create";
      count.style.display = "block";
      count.style.marginTop = "20px";
    }
    localStorage.setItem("product", JSON.stringify(productData));

    clearData();
    readData();
  }
});

// Clear Data

function clearData() {
  title.value = "";
  price.value = "";
  tax.value = "";
  ads.value = "";
  discount.value = "";
  total.textContent = "";
  count.value = "";
  category.value = "";
}

// Read Product Data

function readData() {
  let table = "";
  for (let i = 0; i < productData.length; i++) {
    table += `<tr>
                <td data-label="id">${i + 1}</td>
                <td data-label="title">${productData[i].title}</td>
                <td data-label="price">${productData[i].price}</td>
                <td data-label="taxes">${productData[i].tax}</td>
                <td data-label="ads">${productData[i].ads}</td>
                <td data-label="discount">${productData[i].discount}</td>
                <td data-label="total">${productData[i].total}</td>
                <td data-label="category">${productData[i].category}</td>
                <td><button id="update" onclick="updateProduct(${i})">Update</button></td>
                <td><button id="delete" onclick="deleteProduct(${i})">Delete</button></td>
              </tr>`;
  }
  document.querySelector("tbody").innerHTML = table;
  if (productData.length > 0) {
    if ((deleteAllBtn.innerHTML = "")) {
      deleteAll();
    } else {
      deleteAllBtn.innerHTML = "";
      deleteAll();
    }
  } else {
    deleteAllBtn.innerHTML = "";
  }
}

// Delete Product

function deleteProduct(i) {
  productData.splice(i, 1);
  localStorage.product = JSON.stringify(productData);
  readData();
  clearData();
}

// Delete All

function deleteAll() {
  let deleteBtn = document.createElement("button");
  deleteBtn.append(`Delete All (${productData.length})`);
  deleteBtn.style.cssText =
    "display: block; width: 100%; height: 50px; background-color: var(--mainBackground); color: var(--mainColor); border: none; outline: none; border-radius: 5px; cursor: pointer; margin: 10px 0; font-weight: bold; font-size: 20px; opacity: .8; letter-spacing: 0; transition: all .3s ease-in-out";
  deleteBtn.onmouseenter = function () {
    this.style.cssText += "opacity: 1; letter-spacing: 1px";
  };
  deleteBtn.onmouseleave = function () {
    this.style.cssText += "opacity: .8; letter-spacing: 0";
  };
  deleteBtn.onclick = function () {
    productData = [];
    localStorage.clear();
    readData();
  };
  deleteAllBtn.appendChild(deleteBtn);
  clearData();
}

// Upadate Product

function updateProduct(i) {
  title.value = productData[i].title;
  price.value = productData[i].price;
  tax.value = productData[i].tax;
  ads.value = productData[i].ads;
  discount.value = productData[i].discount;
  getTotalPrice();
  count.style.display = "none";
  category.value = productData[i].category;
  submit.innerHTML = "Update";
  mood = "update";
  temp = i;
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// Search

let searchMood = "title";
let searchBtns = document.querySelectorAll(".search-btns button");
let searchInput = document.getElementById("search");

searchBtns.forEach((e) =>
  e.addEventListener("click", (e) => {
    searchMood = e.target.id;
    searchInput.focus();
    searchInput.value = "";
    readData();
    searchInput.placeholder = "Search by " + searchMood;
  })
);

searchInput.addEventListener("keyup", () => {
  let searchVal = searchInput.value;
  let table = "";
  let res = [];
  for (let i = 0; i < productData.length; i++) {
    if (searchMood === "title") {
      if (productData[i].title.includes(searchVal.toLowerCase())) {
        table += `<tr>
                    <td data-label="id">${i + 1}</td>
                    <td data-label="title">${productData[i].title}</td>
                    <td data-label="price">${productData[i].price}</td>
                    <td data-label="taxes">${productData[i].tax}</td>
                    <td data-label="ads">${productData[i].ads}</td>
                    <td data-label="discount">${productData[i].discount}</td>
                    <td data-label="total">${productData[i].total}</td>
                    <td data-label="category">${productData[i].category}</td>
                    <td><button id="update" onclick="updateProduct(${i})">Update</button></td>
                    <td><button id="delete" onclick="deleteProduct(${i})">Delete</button></td>
                  </tr>`;
      }
    } else if (searchMood === "category") {
      if (productData[i].category.includes(searchVal.toLowerCase())) {
        table += `<tr>
                    <td data-label="id">${i + 1}</td>
                    <td data-label="title">${productData[i].title}</td>
                    <td data-label="price">${productData[i].price}</td>
                    <td data-label="taxes">${productData[i].tax}</td>
                    <td data-label="ads">${productData[i].ads}</td>
                    <td data-label="discount">${productData[i].discount}</td>
                    <td data-label="total">${productData[i].total}</td>
                    <td data-label="category">${productData[i].category}</td>
                    <td><button id="update" onclick="updateProduct(${i})">Update</button></td>
                    <td><button id="delete" onclick="deleteProduct(${i})">Delete</button></td>
                  </tr>`;
      }
    }
  }
  document.querySelector("tbody").innerHTML = table;
});
