(function($) {

    "use strict";

    var searchPopup = function() {
      // open search box
      $('#header-nav').on('click', '.search-button', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });

      $('#header-nav').on('click', '.btn-close-search', function(e) {
        $('.search-popup').toggleClass('is-visible');
      });
      
      $(".search-popup-trigger").on("click", function(b) {
          b.preventDefault();
          $(".search-popup").addClass("is-visible"),
          setTimeout(function() {
              $(".search-popup").find("#search-popup").focus()
          }, 350)
      }),
      $(".search-popup").on("click", function(b) {
          ($(b.target).is(".search-popup-close") || $(b.target).is(".search-popup-close svg") || $(b.target).is(".search-popup-close path") || $(b.target).is(".search-popup")) && (b.preventDefault(),
          $(this).removeClass("is-visible"))
      }),
      $(document).keyup(function(b) {
          "27" === b.which && $(".search-popup").removeClass("is-visible")
      })
    }

    var initProductQty = function(){

      $('.product-qty').each(function(){

        var $el_product = $(this);
        var quantity = 0;

        $el_product.find('.quantity-right-plus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            $el_product.find('#quantity').val(quantity + 1);
        });

        $el_product.find('.quantity-left-minus').click(function(e){
            e.preventDefault();
            var quantity = parseInt($el_product.find('#quantity').val());
            if(quantity>0){
              $el_product.find('#quantity').val(quantity - 1);
            }
        });

      });

    }

    // إنشاء كائن للسلة
    let cart = {
        items: [],
        total: 0,
        count: 0
    };

    // تحديث عرض السلة
    function updateCartDisplay() {
        const cartItemsList = document.getElementById('cartItemsList');
        const cartTotal = document.getElementById('cartTotal');
        
        // تفريغ القائمة
        cartItemsList.innerHTML = '';
        
        if (cart.items.length === 0) {
            cartItemsList.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        } else {
            // إضافة كل منتج للقائمة
            cart.items.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image || '../img/default-product.jpg'}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                    </div>
                    <div class="cart-item-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                cartItemsList.appendChild(cartItem);
            });
        }
        
        // تحديث الإجمالي
        cartTotal.textContent = `$${cart.total.toFixed(2)}`;
    }

    // إضافة منتج للسلة
    function addToCart(productId, productName, price, image, quantity = 1) {
        const existingItem = cart.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                id: productId,
                name: productName,
                price: price,
                image: image,
                quantity: quantity
            });
        }
        
        updateCartTotal();
        updateCartCount();
        updateCartDisplay();
        saveCart();
        showAddToCartConfirmation();
    }

    // حذف منتج من السلة
    function removeFromCart(productId) {
        cart.items = cart.items.filter(item => item.id !== productId);
        updateCartTotal();
        updateCartCount();
        updateCartDisplay();
        saveCart();
    }

    // تحديث عداد السلة
    function updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        cart.count = cart.items.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = cart.count;
        
        // إظهار العداد فقط إذا كانت السلة تحتوي على منتجات
        cartCount.style.display = cart.count > 0 ? 'block' : 'none';
    }

    // تحديث إجمالي السلة
    function updateCartTotal() {
        cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // حفظ السلة في localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // استرجاع السلة من localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
        }
    }

    // عرض رسالة تأكيد الإضافة للسلة
    function showAddToCartConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.className = 'cart-confirmation';
        confirmation.innerHTML = `
            <div class="cart-confirmation-content">
                <i class="fas fa-check-circle"></i>
                تمت الإضافة إلى السلة
            </div>
        `;
        
        document.body.appendChild(confirmation);
        
        // إخفاء الرسالة بعد ثانيتين
        setTimeout(() => {
            confirmation.remove();
        }, 2000);
    }

    // تبديل عرض/إخفاء السلة
    document.getElementById('cartIcon').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('cartDropdown');
        dropdown.classList.toggle('active');
    });

    // إغلاق السلة عند النقر خارجها
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('cartDropdown');
        if (!e.target.closest('.cart-wrapper')) {
            dropdown.classList.remove('active');
        }
    });

    // تحديث زر "إضافة إلى السلة"
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const productCard = button.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = parseFloat(productCard.querySelector('.product-price').dataset.price);
            const productImage = productCard.querySelector('.product-image')?.src;
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // تحميل السلة عند بدء الصفحة
    document.addEventListener('DOMContentLoaded', () => {
        loadCart();
        updateCartDisplay();
    });

    $(document).ready(function() {

      searchPopup();
      initProductQty();

      var swiper = new Swiper(".main-swiper", {
        speed: 500,
        navigation: {
          nextEl: ".swiper-arrow-prev",
          prevEl: ".swiper-arrow-next",
        },
      });         

      var swiper = new Swiper(".product-swiper", {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
          el: "#mobile-products .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        },
      });      

      var swiper = new Swiper(".product-watch-swiper", {
        slidesPerView: 4,
        spaceBetween: 10,
        pagination: {
          el: "#smart-watches .swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          }
        },
      }); 

      var swiper = new Swiper(".testimonial-swiper", {
        loop: true,
        navigation: {
          nextEl: ".swiper-arrow-prev",
          prevEl: ".swiper-arrow-next",
        },
      }); 

    }); // End of a document ready

})(jQuery);