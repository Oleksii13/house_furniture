$(function() {
  // variables

  const cartBtn = $('.cart-btn');
  const closeCartBtn = $('.close-cart');
  const clearCartBtn = $('.clear-cart');
  const cartDOM = $('.cart');
  const cartOverlay = $('.cart-overlay');
  const cartItems = $('.cart-items');
  const cartTotal = $('.cart-total');
  const cartContent = $('.cart-content');
  const productsDOM = $('.products-center');

  //cart
  let cart = [];

  //getting the products
  class Products {
    async getProducts() {
      try {
        let result = await fetch('products.json');
        let data = await result.json();
        let products = data.items;
        products = products.map(item => {
          const { title, price } = item.fields;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, price, id, image };
        });
        return products;
      } catch (error) {
        console.log(error);
      }
    }
  }

  //display products
  class UI {
    displayProducts(products) {
      let result = '';
      products.forEach(product => {
        result += `
      <!-- single product -->
      <article class="product">
        <div class="img-container">
          <img src="${product.image}" alt="product" class="product-img" />
          <button class="bag-btn" data-id=${product.id}>
            <i class="fas fa-shopping-cart"></i>
            add to bag
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$ ${product.price}</h4>
      </article>
      <!-- end single product -->`;
        productsDOM.html(result);
      });
    }
  }

  //local storage});
  class Storage {}

  $(document).ready(() => {
    const ui = new UI();
    const products = new Products();

    //get all products
    products.getProducts().then(products => ui.displayProducts(products));
  });
});
