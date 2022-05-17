// webp support
export function isWebp() {
   // Проверка поддержки webp
   function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
         callback(webP.height == 2);
      };
      webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   }
   // Добавление класса _webp или _no-webp для HTML
   testWebP(function (support) {
      let className = support === true ? 'webp' : 'no-webp';
      document.documentElement.classList.add(className);
   });
}

// burger
export function menu(navigation, button) {

   document.querySelector(`.${button}`).addEventListener('click', () => {
      document.querySelector(`.${navigation}`).classList.toggle('active')
      document.body.classList.toggle('lock')
   })
}

//-----Images to background-----//
export function ibg() {

   let ibg = document.querySelectorAll(".ibg");
   for (let i = 0; i < ibg.length; i++) {
      if (ibg[i].querySelector('img')) {
         ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
      }
   }
}
//-----Modal-----//
const html = document.documentElement;
const body = document.querySelector('body')
export class modal {
   constructor(selector , openButton) {
      this.selector = selector
      this.modal = document.querySelector(selector)
      if (openButton !== 'none') {
         this.openButton = document.querySelector(openButton)
      } 
      this.closeButton = this.modal.querySelector("[data-close]")
      this.scrollPosition = 0
      this.fix = document.querySelectorAll(".lock-fix")
      this.openModal()
      this.closeModal()
      this.closeModalByClickOut()
      this.closeModalByPressESC()
      console.log(this.selector , this.openButton , this.closeButton )
      this.marginSize = 0
   }
   lockFix() {
      if (this.fix.length > 0) {
         this.fix.forEach(element => {
            element.style.width = element.offsetWidth + "px"
            element.style.left = element.offsetLeft + "px"
         })
         body.classList.add('lock')
      }
   }
   unlockFix() {
      if (this.fix.length > 0) {
         this.fix.forEach(element => {
            element.style.width = ''
            element.style.left = ''
         })
         body.classList.remove('lock')
      }
   }
   //-----Block scroll-----//
   lockHtml() {
      this.marginSize = window.innerWidth - html.offsetWidth + "px";
      this.scrollPosition = window.scrollY;
      html.style.top = -this.scrollPosition + "px";
      html.classList.add("lock");
      html.style.paddingRight = this.marginSize;
   }
   //-----unblock scroll-----//
   unlockHtml() {
      html.classList.remove("lock");
      html.style.top = "";
      html.style.paddingRight = "";
      window.scrollTo(0, this.scrollPosition);
   }
   //-----open modal-----//
   openModal() {
      if(this.openButton) {
         this.openButton.addEventListener('click' , () => {
            this.lockFix()
            this.lockHtml()
            this.modal.classList.add('modal--active')
         })
      }
   }
   openModalFromOut() {
      this.lockFix()
      this.lockHtml()
      this.modal.classList.add('modal--active')
   }
   //-----close modal by click on button-----//
   closeModal() {
      this.closeButton.addEventListener('click' , () => {
         this.unlockFix()
         this.unlockHtml()
         this.modal.classList.remove('modal--active')
      })
   }
   closeModalFromOut() {
      this.unlockFix()
      this.unlockHtml()
      this.modal.classList.remove('modal--active')
   }
   //-----close by click out-----//
   closeModalByClickOut() {
      document.addEventListener("click", (e) => {
         if (e.target == document.querySelector(".modal--active")) {
            this.modal.classList.remove('modal--active')
            this.unlockFix()
            this.unlockHtml()
         }
      });
   }
   //-----press ESC to close-----//
   closeModalByPressESC() {
      document.addEventListener("keyup", (e) => {
         if (e.key == "Escape" && document.querySelector(".modal.modal--active")) {
            this.modal.classList.remove('modal--active')
            //unlocklockFix();
            //unlockHtml();
         }
      });
   }
}

//-----Animation on scrol-----//
export function scrollAnim() {
   const anItems = document.querySelectorAll('.anim')//add anim class to animated elements
   function animScroll() {
      for (let i = 0; i < anItems.length; i++) {
         const item = anItems[i]
         const height = item.offsetHeight
         const top = item.getBoundingClientRect().top


         const treshold = 3

         let point = height / treshold

         if (height > window.innerHeight) {
            point = window.innerHeight - window.innerHeight / treshold
         }

         if (top > 0 && (top - window.innerHeight / 2 <= 0 + point)) {
            item.classList.add('_active')
         }
         if ((Math.abs(top) > window.innerHeight) && item.classList.contains('_active')) {
            item.classList.remove('_active')
         }

      }
   }
   if (anItems.length > 0) {
      animScroll();
   }
   animScroll();
   window.addEventListener('scroll', animScroll)
}

// polyfill for ie11 (forEach)
export function forEachPolyfill() {
   if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = function (callback, thisArg) {
         thisArg = thisArg || window;
         for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
         }
      };
   }
}

// tabs
export class tabs {
   constructor(selector, options) {
      let defaultOptions = {
         isChanged: () => { }
      }
      this.options = Object.assign(defaultOptions, options)
      this.selector = selector
      this.tabs = document.querySelector(`[data-tabs="${selector}"]`) //select elements with attribute 
      if (this.tabs) {
         this.tabList = this.tabs.querySelector('.tabs__nav') //get list of buttons
         this.tabButtons = this.tabList.querySelectorAll('.tabs__nav-btn') // get buttons
         this.tabPanels = this.tabs.querySelectorAll('.tabs__panel') // get tab panels

      } else {
         console.error(`Selector ${selector} not exist`)
         return
      }
      this.check()
      this.init()
      this.events()
   }
   check() {
      if (document.querySelectorAll(`[data-tabs="${this.selector}"]`).length > 1) {
         console.error('Количество элементов с одинаковым data-tabs больше одного!');
         return;
      }

      if (this.tabButtons.length !== this.tabPanels.length) {
         console.error('Количество кнопок и элементов табов не совпадает!');
         return;
      }
   }
   init() {
      // add attributes for screen reader
      this.tabList.setAttribute('role', 'tablist')
      this.tabButtons.forEach((el, i) => {
         el.setAttribute('role', 'tab')
         el.setAttribute('tabindex', '-1')
         el.setAttribute('id', `${this.selector}${i + 1}`)
         el.classList.remove('tabs__nav-btn--active')
      })
      this.tabPanels.forEach((el, i) => {
         el.setAttribute('role', 'tabpanel')
         el.setAttribute('tabindex', '-1')
         el.setAttribute('aria-labelledby', this.tabButtons[i].id)
         el.classList.remove('tabs__panel--active')
      })
      this.tabButtons[0].classList.add('tabs__nav-btn--active') // activate first panel and button
      this.tabButtons[0].removeAttribute('tabindex')
      this.tabButtons[0].setAttribute('aria-selected', 'true')
      this.tabPanels[0].classList.add('tabs__panel--active')

   }
   events() {
      this.tabButtons.forEach((el, i) => {
         // switch on mouse click
         el.addEventListener('click', (e) => {
            let currentTab = this.tabList.querySelector('[aria-selected')
            if (e.currentTarget !== currentTab) {
               this.switchTabs(e.currentTarget, currentTab)
            }
         })
         // switch on key <- or ->
         el.addEventListener('keydown', (e) => {
            //let index = Array.prototype.indexOf.call(this.tabButtons, e.currentTarget)
            let index = i
            console.log(index, i)
            let dir = null;
            if (e.which === 37) {
               dir = index - 1

            } else if (e.which === 39) {
               dir = index + 1;
            } else if (e.which === 40) {
               dir = 'down'
            } else {
               dir = null
            }
            //console.log(dir)
            if (dir !== null) {
               if (dir === 'down') {
                  this.tabPanels[i].focus()
               } else if (this.tabButtons[dir]) {
                  this.switchTabs(this.tabButtons[dir], e.currentTarget)
               }
            }
         })
      })
   }
   // change classes and atributes to needed tab panel and button
   switchTabs(newTab, oldTab) {
      newTab.focus()
      newTab.removeAttribute('tabindex')
      newTab.setAttribute('aria-selected', 'true')
      oldTab.removeAttribute('aria-selected')
      oldTab.setAttribute('tabindex', '-1')
      let index = Array.prototype.indexOf.call(this.tabButtons, newTab)
      //console.log(index)
      let oldIndex = Array.prototype.indexOf.call(this.tabButtons, oldTab)
      this.tabPanels[oldIndex].classList.remove('tabs__panel--active')
      this.tabPanels[index].classList.add('tabs__panel--active')
      this.tabButtons[oldIndex].classList.remove('tabs__nav-btn--active')
      this.tabButtons[index].classList.add('tabs__nav-btn--active')
      this.options.isChanged(this)
   }
}

//spoilers-acorrdion
let accordionAllInstances = [] //all instances of classes
export class accordion {
   constructor(selector, options) {
      let defaultOptions = {
         isOpen: () => { },
         isClose: () => { },
         speed: 300,
         spoilers: false, //if dont need close all accordions when one open , change on true
         //classes: {},
      }
      this.all = []
      this.options = Object.assign(defaultOptions, options)
      this.accordion = document.querySelector(selector)
      this.accordion.setAttribute('accord-init', true)
      this.control = this.accordion.querySelector('.accordion__control')
      this.content = this.accordion.querySelector('.accordion__content')
      this.event();
      accordionAllInstances.push(this)

   }
   event() {
      if (this.accordion) {
         this.accordion.addEventListener('click', (e) => {

            this.accordion.classList.toggle('open')
            if (this.accordion.classList.contains('open')) {
               this.open()
            } else {
               this.close(this)
            }
         })
      }
   }
   open() {
      if (this.options.spoilers === false) {
         this.closeAll()
      }
      this.accordion.style.setProperty('--accordion-time', `${this.options.speed / 1000}s`)
      this.accordion.classList.add('is-open')
      this.control.setAttribute('aria-expanded', true)
      this.control.setAttribute('aria-hidden', false)
      this.content.style.maxHeight = this.content.scrollHeight + 'px'
      this.options.isOpen(this)
   }
   close(el) {
      el.accordion.classList.remove('open')
      el.accordion.classList.remove('is-open')
      el.control.setAttribute('aria-expanded', false)
      el.control.setAttribute('aria-hidden', true)
      el.content.style.maxHeight = null
      el.options.isClose(this)
   }
   // close all accordions
   closeAll() {
      accordionAllInstances.forEach((el) => {
         if (el.accordion.classList.contains('is-open')) {
            this.close(el)
         }
      })
   }

}

//select 
export function select(selector, filterTrue) {
   const dropDown = document.querySelector(selector)
   let filterItems = 0
   //filter init
   if (filterTrue) {
      const filterList = dropDown.querySelector('.dropdown__filter')
      if (filterList !== 0) {
         filterItems = filterList.querySelectorAll('[filter]')
      }

   }
   if (dropDown !== null) {
      const dropDownButton = dropDown.querySelector('.dropdown__button')
      const dropDownList = dropDown.querySelector('.dropdown__list')
      const dropDownListItems = dropDownList.querySelectorAll('.dropdown__list-item')
      const dropDownInput = dropDown.querySelector('.dropdown__input--hidden')



      //open select list
      dropDownButton.addEventListener('click', function () {
         dropDownList.classList.toggle('dropdown__list--visible')
         this.classList.add('dropdown__button--active') //add active shadow
      })
      //open list and select value
      dropDownListItems.forEach(function (listItem) {
         listItem.addEventListener('click', function (e) {
            e.stopPropagation
            dropDownButton.innerText = this.innerText
            dropDownButton.focus()
            dropDownInput.value = this.dataset.value
            dropDownList.classList.remove('dropdown__list--visible')
            selectFilterValue(listItem.getAttribute('data-value'))
         })
      })
      //close select when click out
      document.addEventListener('click', function (e) {
         if (e.target !== dropDownButton) {
            dropDownList.classList.remove('dropdown__list--visible')
            dropDownButton.classList.remove('dropdown__button--active')
         }
      })
      //close select by press key esc or tab
      document.addEventListener('keydown', function (e) {
         if (e.key === 'Tab' || e.key === 'Escape') {
            dropDownList.classList.remove('dropdown__list--visible')
            dropDownButton.classList.remove('dropdown__button--active')
         }
      })

   }
   function selectFilterValue(filterValue) {
      filterItems.forEach(function (element) {
         let value = element.getAttribute('filter')
         element.style.display = ''
         if (value !== filterValue) {
            element.style.display = 'none'
         }
         if (filterValue === 'all') {
            element.style.display = ''
         }

      })
   }
}
// inputmask
export function telmask(telSelector) {
   telSelector = document.querySelector(telSelector);
   const inputMask = new Inputmask('+380 (99) 999-99-99');
   inputMask.mask(telSelector);
}

// validation form

export function validate(formSelector, nameField , mailField , telField) {
   const validation = new JustValidate(formSelector);
   validation
      .addField(nameField, [
         {
            rule: 'minLength',
            value: 3,
         },
         {
            rule: 'maxLength',
            value: 30,
         },
         {
            rule: 'required',
            value: true,
            errorMessage: 'Введите имя!'
         }
      ])
      .addField(mailField, [
         {
            rule: 'required',
            value: true,
            errorMessage: 'Email обязателен',
         },
         {
            rule: 'email',
            value: true,
            errorMessage: 'Введите корректный Email',
         },
      ])
      .addField(telField, [
         {
            rule: 'required',
            value: true,
            errorMessage: 'Телефон обязателен',
         },
         {
            rule: 'function',
            validator: function () {
               const selector = document.querySelector(telField)
               const phone = selector.inputmask.unmaskedvalue();
               return phone.length === 9;
            },
            errorMessage: 'Введите корректный телефон',
         },

      ])
      //.onSuccess((event) => {

      //   formData = new FormData(event.target);
      //   event.target.reset();
        

      //});

}
export function send(formData , file) {
   let xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
         if (xhr.status === 200) {
            console.log('Отправлено');
         }
      }
   }

   xhr.open('POST', `${file}`, true); //select php file to send mail or telegram
   xhr.send(formData);
}
export function addOrder(formData , orderArray) {
   formData.append('Order' ,JSON.stringify(orderArray))
   formData.set('Сумма' , total)
}

// cart 
// function to custom quantity stepper
export function customStepper() {
   const cards = document.querySelectorAll('.card')
   if (cards.length > 0) {
      cards.forEach((element) => {
         const plusButton = element.querySelector('.card__quantity-plus')
         const minusButton = element.querySelector('.card__quantity-minus')
         const counter = element.querySelector('.card__quantity-counter')
         const maxQuantity = 99
         let quantity = 0
         function render() {
            counter.value = quantity
         }
         plusButton.addEventListener('click', () => {
            if (quantity < maxQuantity) {
               quantity += 1
               render()
            }
         })
         minusButton.addEventListener('click', () => {
            if (quantity > 0) {
               quantity -= 1
               render()
            }
         })
      })
   }
}
export let orderArray = []
var total = 0
// main function of cart
export function cart() {
   const cards = document.querySelectorAll('.card')
   const cart = document.querySelector('.cart')
   const list = document.querySelector('.cart__list')
   const totalPrice = Number(document.querySelector('.cart__total-price span').textContent.replace(/\D+/g, ""))
   let order = {
      id: '',
      name: '',
      image: '',
      price: '',
      quantity: '',
   }
   
   // convert obbject order to html
   function renderCart() {
      if (orderArray.length > 0) {
         orderArray.forEach(element => {
            let template = `
            <li class="cart__item" data-id="${element.id}">
               <article class="cart__product">
                  <h2 class="cart__product-name">${element.name}</h2>
                  <div class="cart__product-image"><img src="${element.image}" alt="product image"</div>
                  <p class="cart__product-price">Цена: <span>${element.price}</span> UAH</p>
                  <p class="cart__product-quantity">Общее колличество: <span>${element.quantity}</span></p>
                  <button class="cart__product-delete">X</button>
               </article>
            </li>`
            list.innerHTML += template
         })
      }
   }
   // extract data from html to object order and push to array
   function addToCart() {
      if (cards.length > 0) {
         cards.forEach((element, index) => {
            const addButton = element.querySelector('.card__add-button')
            element.setAttribute('data-id', index);

            const wasOrder = element.querySelector('.card__order')

            addButton.addEventListener('click', () => {
               const name = element.querySelector('.card__name').textContent
               const image = element.querySelector('.card__image img').src
               const price = element.querySelector('.card__price span').textContent
               const quantity = element.querySelector('.card__quantity-counter').value
               const id = element.dataset.id
               let notExist = true
               order = {
                  id: id,
                  name: name,
                  image: image,
                  price: price,
                  quantity: quantity,
               }
               // change quantity of product
               orderArray.forEach(element => {
                  if (id === element.id) {
                     element.quantity = parseInt(element.quantity) + parseInt(quantity)
                     notExist = false
                  }


               })
               // push uniqy object to array
               if (quantity > 0 && notExist) {
                  orderArray.push(order)
                  wasOrder.textContent = 'Уже в корзине'
               }

               list.innerHTML = ''
               renderCart()
               printQuantity()
               CalcPrice()

            })
         })
    
      }
   }
   addToCart()

   //remove object from array by id
   const removeFromCart = (productParent) => {
      //console.log(productParent.dataset.id)
      orderArray.forEach(element => {
         if (productParent.dataset.id === element.id) {
            let i = orderArray.indexOf(element)
            orderArray.splice([i], 1)
         }
      })
      console.log(orderArray)
      const wasOrder = document.querySelector(`.card[data-id="${productParent.dataset.id}"]`).querySelector('.card__order')
      wasOrder.textContent = ''
      list.innerHTML = ''
      renderCart()
      //console.log(orderArray)
      printQuantity()
      CalcPrice()
   }
   // total quantity of products
   const printQuantity = () => {
      const length = document.querySelector('.cart__list').children.length
      length > 0 ? cart.classList.add('cart--active') : cart.classList.remove('cart--active')
      document.querySelector('.cart__button-quantity').textContent = length
   }
   document.querySelector('.cart__list').addEventListener('click', (e) => {
      if (e.target.classList.contains('cart__product-delete')) {
         removeFromCart(e.target.closest('.cart__item'))
      }
   })

   // total price
   function CalcPrice() {
      let sum = 0
      orderArray.forEach(element => {
         sum = sum + (element.price * element.quantity)
      })
      document.querySelector('.cart__total-price span').textContent = sum
      total = sum.toFixed(2)
   }
}
export function clearCart() {
   orderArray = []
   document.querySelector('.cart__list').innerHTML = ''
   const cards = document.querySelectorAll('.card')
   if (cards.length > 0) {
      cards.forEach((element) => {
         const counter = element.querySelector('.card__quantity-counter')
         counter.value = 0
      })
   }
   document.querySelector('.cart__total-price span').textContent = 0
   document.querySelector('.cart').classList.remove('.cart--active')
   document.querySelector('.cart__button-quantity').textContent = 0
   document.querySelectorAll('.card__order').forEach(element =>{
      element.textContent = ''
   })

}
export function thanks (name) {
   return `
   <div class="modal__body">
      <div class="modal__content">
         <a href="#anchor" data-close class="modal__close">X</a>
         <div class="modal__text">
            ${name} , thank for You order!
         </div>
      </div>
   </div>
`
}


