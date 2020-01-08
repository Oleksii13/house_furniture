$(function() {
  // variables

  const cartBtn = $('.cart-btn');
  const closeCartBtn = $('.close-cart');
  const clearCartBtn = $('.clear-cart');
  const cartDOM = $('.cart');
  const cartOverlay = $('.cart-overlay');
  const cartItems = $('.cart-items');
  const cartTotal = $('.cart-total');
  // change error here issue !!!!!!!!!!!!////////////
  const cartContent = document.querySelector('.cart-content');
  // const cartContent = $('.cart-content');
  /////////////////////////////////////////////////////////
  const productsDOM = $('.products-center');

  //cart
  let cart = [];
  // buttons
  let buttonsDOM = [];

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
            add to cart
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$ ${product.price}</h4>
      </article>
      <!-- end single product -->`;
        productsDOM.html(result);
      });
    }
    getBagButtons() {
      const buttons = [...$('.bag-btn')];
      buttonsDOM = buttons;
      buttons.forEach(button => {
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if (inCart) {
          button.innerText = 'In Cart';
          button.disabled = true;
        }
        $(button).click(event => {
          event.target.innerText = 'In Cart';
          event.target.disabled = true;
          // grt product from the products using id
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          // add product to the cart
          cart = [...cart, cartItem];
          // save cart in local storage
          Storage.saveCart(cart);
          // set cart values
          this.setCartValues(cart);
          // display cart item
          this.addCartItem(cartItem);
          // show the cart
          this.showCart();
        });
      });
    }
    setCartValues(cart) {
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
      });
      cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
      cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
      // version one
      // const div = document.createElement('div');
      // $(div).addClass('cart-item');
      // $(div).html(`<img src="${item.image}" alt="product">
      //     <div>
      //       <h4>${item.title}</h4>
      //       <h5>$${item.price}</h5>
      //       <span class="remove-item" data-id='${item.id}'>remove</span>
      //     </div>
      //     <div>
      //       <i class="fas fa-chevron-up" data-id='${item.id}'></i>
      //       <p class="item-amount">${item.amount}</p>
      //       <i class="fas fa-chevron-down" data-id='${item.id}'></i>
      //     </div>`);
      // $(cartContent).append(div);
      // version 2
      $(
        cartContent
      ).append(`<div class='cart-item'><img src='${item.image}' alt='product'>
          <div>
            <h4>${item.title}</h4>
            <h5>$${item.price}</h5>
            <span class='remove-item' data-id='${item.id}'>remove</span>
          </div>
          <div>
            <i class='fas fa-chevron-up' data-id='${item.id}'></i>
            <p class='item-amount'>${item.amount}</p>
            <i class='fas fa-chevron-down' data-id='${item.id}'></i>
          </div></div>`);
      // console.log(cartContent);
    }
    showCart() {
      $(cartOverlay).addClass('transparentBcg');
      $(cartDOM).addClass('showCart');
    }

    setupAPP() {
      cart = Storage.getCart();
      this.setCartValues(cart);
      this.populateCart(cart);
      $(cartBtn).click(this.showCart);
      $(closeCartBtn).click(this.hideCart);
    }
    populateCart(cart) {
      cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
      $(cartOverlay).removeClass('transparentBcg');
      $(cartDOM).removeClass('showCart');
    }

    cartLogic() {
      //clear cart button
      $(clearCartBtn).click(() => {
        this.clearCart();
      });
      //clear functionality
      $(cartContent).click(event => {
        if (event.target.classList.contains('remove-item')) {
          let removeItem = event.target;
          let id = removeItem.dataset.id;
          /////////////////////////////////
          //vanilla JS version
          // cartContent.removeChild(removeItem.parentElement.parentElement);
          // $(cartContent)
          //   .children(removeItem.parentElement.parentElement)
          //   .remove();
          /////////////////////////////////////
          // jquery version
          $(removeItem)
            .parent()
            .parent()
            .remove();
          this.removeItem(id);
        } else if (event.target.classList.contains('fa-chevron-up')) {

        }
      });
    }
    clearCart() {
      let cartItems = cart.map(item => item.id);
      cartItems.forEach(id => this.removeItem(id));
      while (cartContent.children.length > 0) {
        $(cartContent)
          .find(':first-child')
          .remove();
        // console.log(cartContent);
      }
      this.hideCart();
    }
    removeItem(id) {
      cart = cart.filter(item => item.id !== id);
      this.setCartValues(cart);
      Storage.saveCart(cart);
      let button = this.getSingleButton(id);
      button.disabled = false;

      // ////////////////////////////
      // .html() does not work

      // $(button)
      //   .empty()
      //   .append($("<i class='fas fa-shopping-cart'></i>add to text"))
      //   .append('add to cart');

      $(button).html(`<i class='fas fa-shopping-cart'></i>add to text`);

      // console.log(button);

      // //////////////////////////////////////
    }
    getSingleButton(id) {
      return buttonsDOM.find(button => button.dataset.id === id);
    }
  }

  //local storage});
  class Storage {
    static saveProducts(products) {
      localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id) {
      let products = JSON.parse(localStorage.getItem('products'));
      return products.find(product => product.id === id);
    }
    static saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
      return localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
    }
  }

  const ui = new UI();
  const products = new Products();

  // setup app
  ui.setupAPP();

  //get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
