// Popup functionality
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', function (event) {
    const plusButton = event.target.closest('.quantity__button[name="plus"]');
    if (!plusButton) return;

    event.preventDefault();
    event.stopPropagation();

    const variantId = plusButton.getAttribute('data-variant-id');
    if (!variantId) {
      console.error('❌ Variant ID not found');
      return;
    }

    const cartItem = plusButton.closest('.cart-item');
    if (!cartItem) {
      console.error('❌ Cart item not found');
      return;
    }

    // Prevent Shopify's default quantity update
    const quantityInput = cartItem.querySelector('input.quantity__input');
    if (quantityInput) {
      quantityInput.setAttribute('data-prevent-shopify-change', 'true');
    }

    // Extract properties from <dt>/<dd> pairs inside .product-option
    const properties = {};
    cartItem.querySelectorAll('.product-option').forEach((option) => {
      const key = option.querySelector('dt')?.textContent.trim().replace(/:$/, '');
      const value = option.querySelector('dd')?.textContent.trim();
      if (key && value) {
        properties[key] = value;
      }
    });

    // Force new cart line
    properties['_duplicate'] = Date.now();

    // Log what we're sending
    console.log('🛒 Duplicating variant:', variantId);
    console.log('📦 Properties:', properties);

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1,
        properties: properties,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Duplicate item added:', data);
        location.reload(); // Optional: remove if cart auto-updates
      })
      .catch((err) => console.error('❌ Error adding item:', err));
  });
  // To show info popup
  document.querySelectorAll('.info_icon')?.forEach((element) => {
    element.addEventListener('click', (event) => {
      document.querySelectorAll('.custom_popup_wrap')?.forEach((popup) => {
        document.body.style.overflowY = 'hidden'; // Disable scroll
        popup.style.display = 'flex';
      });
      event.stopPropagation(); // Prevent event bubbling
    });
  });

  // To Close popup when clicking outside `.custom_pp_content` or clicking `.close_custom_pp`
  document.addEventListener('click', (event) => {
    document.querySelectorAll('.custom_popup_wrap')?.forEach((popup) => {
      if (
        event.target.closest('.close_custom_pp') || // Close on cross icon click
        !event.target.closest('.custom_pp_content') // Close on click outside
      ) {
        popup.style.display = 'none';
        document.body.style.overflowY = 'auto'; // Restore original overflow
      }
    });
  });
});


// FAQs accordion section script starts
    var acc = document.getElementsByClassName("landing-accordion");
    for (let i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("current");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        } 
      });
    }

    $('.head1').click(function(){
      $(this).addClass('active').siblings('.active').removeClass('active');
      var dot = $(this).attr('data-box')
      $('.landing-acc-box').each(function(){
        var dot_para = $(this).attr('data-box');
        if(dot_para == dot){
          $(this).addClass('active').siblings('.active').removeClass('active');
        }
      })
    })
  // FAQs accordion section script ends