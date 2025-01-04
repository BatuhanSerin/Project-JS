function main() {
  let productDetail = document.querySelector(".product-detail");

  const PRODUCTS_URL =
    "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
  const LOCAL_STORAGE_KEY = "liked-products";

  const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedData) {
    //if there is no data in local storage fetch it from the API
    $.getJSON(PRODUCTS_URL, (products) => {
      //store the data in local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      //create the carousel
      createCarousel(products);
    }).fail(function () {
      console.error("Error fetching products.");
    });
  } else {
    //if there is data in local storage create the carousel with the data
    createCarousel(JSON.parse(storedData));
  }
  function createCarousel(products) {
    let carouselContainer = document.createElement("div");
    carouselContainer.innerHTML = `
            <h2>You Might Also Like</h2>
            <div class="carousel-wrapper" style="overflow: hidden; position: relative;">
                <div class="carousel-track" style="display: flex; gap: 10px; transition: transform 0.5s ease;">
                    ${products
                      .map(
                        (product) => `
                            <div class="carousel-item" style="flex: 0 0 calc(100% / 6.5); text-align: center;">
                                <a href="${product.url}" target="_blank">
                                    <img src="${product.img}" alt="${
                          product.name
                        }" style="width: 100%; border-radius: 5px;">
                                    <p>${product.name}</p>
                                    <p>${product.price}</p>
                                </a>
                                <button class="heart-icon" data-id="${
                                  product.id
                                }" 
                                style="background: none; border: none; cursor: pointer; font-size: 18px; color: 
                                ${
                                  localStorage.getItem("liked-" + product.id)
                                    ? "blue"
                                    : "black"
                                };">&#9829;</button>
                            </div>
                        `
                      )
                      .join("")}
                </div>
                <button class="carousel-arrow previous round"  style="left: 0; ">&#129152;</button>
                <button class="carousel-arrow next round" style="right: 0;">&#129154;</button>
            </div>
        `;

    //add the crousle to the page after the product detail
    productDetail.insertAdjacentElement("afterend", carouselContainer);

    const previousArrow = carouselContainer.querySelector(".previous.round");
    const nextArrow = carouselContainer.querySelector(".next.round");
    const carouselTrack = carouselContainer.querySelector(".carousel-track");

    let position = 0;

    previousArrow.onclick = function () {
      position = Math.max(0, position - 1);
      updateCarousel();
    };

    //minimum position between the length of the products and current position to prevent going out of bounds
    nextArrow.onclick = function () {
      position = Math.min(products.length - 6.5, position + 1);
      updateCarousel();
    };
    function updateCarousel() {
      let itemWidth = carouselTrack.children[0].offsetWidth;
      carouselTrack.style.transform =
        "translateX(-" + position * itemWidth + "px)";
    }
    const heartIcons = carouselContainer.querySelectorAll(".heart-icon");
    heartIcons.forEach(function (heart) {
      heart.onclick = function () {
        let productId = heart.dataset.id;
        let isliked = localStorage.getItem("liked-" + productId);
        if (isliked) {
          localStorage.removeItem("liked-" + productId);
          heart.style.color = "black";
        } else {
          localStorage.setItem("liked-" + productId, true);
          heart.style.color = "blue";
        }
      };
    });
  }
}
main();
