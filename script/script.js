document.addEventListener("DOMContentLoaded", () => {

  const listItemsAvailable = document.querySelector('.bucket__row');
  const listItemsEnded = document.querySelector('.missing');
  const blockForPrice = document.querySelector('.total');
  const blocksDeliveryPhotos = document.querySelectorAll('.section-delivery-middle__photo-descr');


  const itemsAvailable = listItemsAvailable.querySelectorAll('.bucket__item-delete');
  console.log(itemsAvailable)
  let goodsPrices = [];

  for (let i = 0; i<itemsAvailable.length; i++){
    let itemAmount = parseInt(itemsAvailable[i].querySelector('.counter').innerHTML);
    let itemTotalPrice = parseInt(itemsAvailable[i].querySelector('.total-price').innerHTML.replace(/\s/g, ''));
    console.log('Цена')
    console.log(itemTotalPrice)
    let itemPreviosTotalPrice = parseInt(itemsAvailable[i].querySelector('.crossed').innerHTML.replace(/\s/g, ''));
    console.log(itemPreviosTotalPrice)

    let itemPrice = parseFloat((itemTotalPrice/itemAmount).toFixed(3));
    console.log(itemPrice)
    let itemPreviosPrice = parseFloat((itemPreviosTotalPrice/itemAmount).toFixed(3));
    let itemDiscount = itemPreviosPrice - itemPrice;

    goodsPrices.push({'itemPrice': itemPrice, 'itemPreviosPrice': itemPreviosPrice, 'itemDiscount': itemDiscount})
    console.log(goodsPrices)
  }

  const accordionHeaders = document.querySelectorAll('.cart__hold');

  accordionHeaders.forEach(function(accordionHeader){
    accordionHeader.addEventListener('click', function (){
      accordionHeader.parentNode.querySelector('.bucket__row').classList.toggle('passive');
      accordionHeader.querySelector('.arrow').classList.toggle('arrow__return');
      if(accordionHeader.querySelector('.bucket__menu-check')){
        accordionHeader.querySelector('.bucket__menu-check').classList.toggle('passive');
        accordionHeader.querySelector('.bucket__menu-hidden').classList.toggle('passive');

        let totalSumm = 0;
        let totalAmount = 0;

        for (let i = 0; i<itemsAvailable.length; i++){
          if (itemsAvailable[i].classList.contains('bucket__item-delete')) {
            const itemAmount = parseInt(itemsAvailable[i].querySelector('.counter').innerHTML);
            const itemPrice = goodsPrices[i].itemPrice;
            console.log(itemPrice)
            totalAmount += itemAmount;
            totalSumm += itemAmount*itemPrice;
            console.log(totalSumm)
            console.log('Финальная',totalSumm)
          }
        }
        
        if (totalAmount%10===1 && totalAmount!==11){
          accordionHeader.querySelector('.menu__text').innerHTML = `${totalAmount}`+' '+'товар'+' · '+makeStrfromNumber(parseFloat((totalSumm).toFixed(3))) + ' ' + 'сом';
        } else if ((totalAmount%10===2 || totalAmount%10===3 || totalAmount%10==4) && (totalAmount!==12 || totalAmount!==13 || totalAmount!==14)){
          accordionHeader.querySelector('.menu__text').innerHTML = `${totalAmount}`+' '+'товара'+' · '+makeStrfromNumber(parseFloat((totalSumm).toFixed(3))) + ' ' + 'сом';
        } else{
          accordionHeader.querySelector('.menu__text').innerHTML = `${totalAmount}`+' '+'товаров'+' · '+makeStrfromNumber(parseFloat((totalSumm).toFixed(3))) + ' ' + 'сом';
        };
      };
    });
  });


  const btnsMinus = document.querySelectorAll('.button-minus');
  const btnsPlus = document.querySelectorAll('.button-plus');

  btnsMinus.forEach(function(btnMinus){
    btnMinus.addEventListener('click', function (){
      let count = parseInt(btnMinus.parentNode.querySelector('.counter').innerHTML);
      console.log(count)
      let btnPlus = btnMinus.parentNode.querySelector('.button-plus');
      if (count > 1){
        let newCount = count - 1;
        if (newCount === 1){
          btnMinus.classList.remove('btn-active');
        }
        btnMinus.parentNode.querySelector('.counter').innerHTML = `${newCount}`; 
        btnPlus.classList.add('btn-active');
      } else{
        btnMinus.parentNode.querySelector('.counter').innerHTML = '1';
        btnMinus.classList.remove('btn-active');
      }
      calculateTotalPrice();
    });
  });

  btnsPlus.forEach(function(btnPlus){
    btnPlus.addEventListener('click', function (){
      let count = parseInt(btnPlus.parentNode.querySelector('.counter').innerHTML);
      console.log(count)
      let btnMinus = btnPlus.parentNode.querySelector('.button-minus');
      let newCount = count + 1;
      console.log(newCount)
      if (btnPlus.parentNode.parentNode.querySelector('.bucket__item-remain')) {
        let str = btnPlus.parentNode.parentNode.querySelector('.bucket__item-remain').innerHTML;
        for (let el of str.trim().split(' ')){
          console.log(el)
          if (!isNaN(parseInt(el)) && count===el-1){
            btnPlus.classList.remove('btn-active');
            btnPlus.parentNode.querySelector('.counter').innerHTML = `${newCount}`;
            btnMinus.classList.add('btn-active');
          } else if (!isNaN(parseInt(el)) && count<el-1)  {
            btnPlus.parentNode.querySelector('.counter').innerHTML = `${newCount}`;
            btnMinus.classList.add('btn-active');
          };
        };
      } else{
        btnPlus.parentNode.querySelector('.counter').innerHTML = `${newCount}`;
        btnMinus.classList.add('btn-active');
      }; 
      calculateTotalPrice();
    });
  });

  
  const checkAll = document.getElementById('bucket_all');
  const checkboxes = document.querySelectorAll('.c-check__item');
  const totalAmountCheckbox = checkboxes.length;

  checkAll.addEventListener('click', function(){
    if (this.checked) {
      checkboxes.forEach(function(el){
        el.checked = true;
      });
      calculateTotalPrice();
    };
  });

  checkboxes.forEach(function(el){
    el.addEventListener('click', () => {
      let uncheckAmount = 0;
      for(let checkbox of checkboxes){
        if (!checkbox.checked){
          uncheckAmount++;
        };
      };
      if (totalAmountCheckbox === uncheckAmount){
        checkAll.checked = false;
      };
      calculateTotalPrice();
    });
  });
  
  const payNowCheck = document.getElementById('check__payment');
  const oderBtn = document.querySelector('.total__paybutton');
  const totalPrice = document.querySelector('.total__sum-field');
  console.log('666')
  console.log(totalPrice)

  payNowCheck.addEventListener('click', () => {
    if (payNowCheck.checked){
      oderBtn.innerHTML = 'Оплатить' + ' ' + `${totalPrice.innerHTML}`;
    } else{
      oderBtn.innerHTML = 'Заказать';
    };
  });

  
  const nameInput = document.getElementById('name');
  const surnameInput = document.getElementById('surname');
  const emailInput = document.getElementById('email');
  const telInput = document.getElementById('tel');
  const indexInput = document.getElementById('index');
  const massInputs = [nameInput, surnameInput, emailInput, telInput, indexInput];

  if (window.screen.availWidth < 685){
    emailInput.parentNode.querySelector('.upper-placeholder').innerHTML = 'Электронная почта'
  }

  window.addEventListener('resize', () => {
    if (window.screen.availWidth < 685){
      emailInput.parentNode.querySelector('.upper-placeholder').innerHTML = 'Электронная почта'
    }
  });

  telInput.addEventListener('focus', function() {
    if(!this.value.trim()){
      this.value = '+';
    }
  });

  telInput.addEventListener('blur', function() {
    if(this.value.trim().length===1){
      this.value = '';
    }    
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===18){
      this.value=this.value+" ";
    } 
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===2){
      this.value=this.value+" (";
    } 
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===7){
      this.value=this.value+") ";
    } 
  });

  telInput.addEventListener("keypress", function(){
    if (this.value.length===12 || this.value.length===15){
      this.value=this.value+"-";
    } 
  });
  oderBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const email = emailInput.value.trim();
    const tel = telInput.value.trim();
    const index = indexInput.value.trim();

    let massErrors = [];

    massErrors.push(errorsInName(name));
    massErrors.push(errorsInSurname(surname));
    massErrors.push(errorsInEmail(email));
    massErrors.push(errorsInTel(tel));
    massErrors.push(errorsInIndex(index));    

    for (let i in massErrors){
      manageErrorElement(massErrors[i], i);
    };

    for (let i in massErrors){
      if(massErrors[i]){
        location.href = "#" + massInputs[i].id;
        break
      };
    };
  });


  for (let i in massInputs){
    massInputs[i].addEventListener('blur', function(){
      if(this.value.trim()){
        hangListenerOnInput(this.value.trim(), i);
      };
    }); 
    massInputs[i].addEventListener('keyup', function(){
      if(massInputs[i].parentNode.querySelector('.section-recipient-form__error')){
        hangListenerOnInput(this.value.trim(), i);
      };
    });
  };

  const deleteItemBtn = document.querySelectorAll('.button__delete');
  const cartBtnHeader = document.querySelector('.shop'); 
  const cartBtnFooter = document.querySelector('.footer__count');
  console.log(cartBtnFooter)

  deleteItemBtn.forEach((el) => {
    el.addEventListener('click', (e) =>{
      console.log(e)
      const path = e.currentTarget.dataset.path;
      console.log(`[data-target="${path}"]`)
      document.querySelector(`[data-target="${path}"]`).classList.add('passive');
      if(document.querySelector(`[data-target="${path}"]`).classList.contains('bucket__item-delete')){
        document.querySelector(`[data-target="${path}"]`).classList.remove('bucket__item-delete');
        let cartAmountItems = [];
        cartAmountItems.push(cartBtnHeader.querySelector('.cart-amount-items'));
        cartAmountItems.push(cartBtnFooter.querySelector('.cart-amount-items'));
        for (i in cartAmountItems){
          cartAmountItems[i].innerHTML = `${parseInt(cartAmountItems[i].innerHTML)-1}`;
          if (parseInt(cartAmountItems[i].innerHTML) === 0){
            cartAmountItems[i].classList.add('passive');
          };
        };
      } else if(document.querySelector(`[data-target="${path}"]`).classList.contains('missing__item')){
        document.querySelector(`[data-target="${path}"]`).classList.remove('missing__item');
        const count = listItemsEnded.querySelectorAll('.missing__item').length;

        if (count%10===1 && count!==11){
          document.querySelector(`[data-target="${path}"]`).parentNode.previousElementSibling.querySelector('.header-text').innerHTML = 'Отсутствует · '+`${count}`+' товар';
        } else if ((count%10===2 || count%10===3 || count%10==4) && (count!==12 || count!==13 || count!==14)){
          document.querySelector(`[data-target="${path}"]`).parentNode.previousElementSibling.querySelector('.header-text').innerHTML = 'Отсутствуют · '+`${count}`+' товара';
        } else{
          document.querySelector(`[data-target="${path}"]`).parentNode.previousElementSibling.querySelector('.header-text').innerHTML = 'Отсутствует · '+`${count}`+' товаров';
        };
      }
      calculateTotalPrice()
    });
  });

  const changeBtn = document.querySelectorAll('.change__btn');
  
  const modalProperties = {
    title: '',
    deliveryType: '',
    deliveryAdress: '',
    cardNumber: '',
    homeAdress: ['Бишкек, улица Табышалиева, 57', 
    'Бишкек, улица Жукеева-Пудовкина, 77/1', 
    'Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1'],
    pointAdress: ['г. Бишкек, улица Ахматбека Суюмбаева, 12/1', 
    'г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1', 
    'г. Бишкек, улица Табышалиева, д. 57'],
    allCardsName: ['mir', 'visa', 'mastercard', 'maestro'],
    allCardsNumber: ['1234 56•• •••• 1234', '1234 56•• •••• 1243', '1234 56•• •••• 2134', '1234 56•• •••• 2143']
  }

  

  changeBtn.forEach((el) => {
    el.addEventListener('click', () =>{
      modalProperties.deliveryType = '';
      modalProperties.cardNumber = '';
      modalProperties.title = el.previousElementSibling.innerHTML;

      let finalDeliveryType = [];
      let finalDeliveryAdress = [];
      let finalCardNumber = [];
      let finalCardName = [];
      
      if (el.parentNode.parentNode.querySelector('.section-delivery-middle__title') || el.parentNode.parentNode.querySelector('.total__delivery-adress')){
        finalDeliveryType.push(document.querySelector('.section-delivery-middle__title-place'));
        finalDeliveryType.push(document.querySelector('.total__delivery-title'));
        finalDeliveryAdress.push(document.querySelector('.delivery__adress'));
        finalDeliveryAdress.push(document.querySelector('.total__delivery-adress'));
        modalProperties.deliveryType = finalDeliveryType[0].innerHTML.trim();
        modalProperties.deliveryAdress = finalDeliveryAdress[0].innerHTML.trim();
      }else if(el.parentNode.parentNode.querySelector('.payment-type__number') || el.parentNode.parentNode.querySelector('.payment__number')){
        finalCardNumber.push(document.querySelector('.payment-type__number'));
        finalCardNumber.push(document.querySelector('.payment__number'));
        finalCardName.push(document.querySelector('.section-payment-bottom__card-icon'));
        finalCardName.push(document.querySelector('.total__payment-icon'));
        modalProperties.cardNumber = finalCardNumber[0].innerHTML.trim();
      };

      createModal(modalProperties, finalDeliveryType, finalDeliveryAdress, finalCardNumber, finalCardName);
    });
  });


  function createModal(modalProperties, finalDeliveryType, finalDeliveryAdress, finalCardNumber, finalCardName){
    const { title, deliveryType, deliveryAdress, cardNumber, homeAdress, pointAdress, allCardsName, allCardsNumber} = modalProperties;

    const modal = document.createElement('div');
    const modalContainer = document.createElement('div');
    const modalHeader = document.createElement('div');
    const modalBtns = document.createElement('div');
    const modalCheckboxes = document.createElement('div');
    const modalSubmit = document.createElement('div');
    const modalCheckboxesList = document.createElement('ul');
    const modalTitle = document.createElement('h2');
    const modalCloseBtn = document.createElement('button');
    const modalDeliveryBtn1 = document.createElement('button');
    const modalDeliveryBtn2 = document.createElement('button');
    const modalDeliveryTitle = document.createElement('h3');
    const modalCheckbox = document.createElement('div');
    const modalSubmitBtn = document.createElement('button');

    modal.classList.add('modal', 'flex');
    modalContainer.classList.add('modal-container', 'flex');
    modalHeader.classList.add('modal-header', 'flex');
    modalCheckboxes.classList.add('modal-checkboxes', 'flex');
    modalSubmit.classList.add('modal-submit');
    modalCheckboxesList.classList.add('modal-checkboxes-list', 'list-resert');
    modalTitle.classList.add('modal-header__title');
    modalCloseBtn.classList.add('modal-header__btn', 'btn-resert');
    modalDeliveryTitle.classList.add('modal-checkboxes__title');
    modalCheckbox.classList.add('modal-checkbox');
    modalSubmitBtn.classList.add('modal-submit__btn', 'btn-resert');

    modalTitle.innerHTML = title;
    modalSubmitBtn.innerHTML = 'Выбрать';

    if(deliveryType){   
      modalBtns.classList.add('modal-delivery-btns', 'flex');
      modalDeliveryBtn1.classList.add('modal-delivery-btns__btn', 'btn-resert');
      modalDeliveryBtn2.classList.add('modal-delivery-btns__btn', 'btn-resert');
      modalDeliveryBtn1.innerHTML = 'В пункт выдачи';
      modalDeliveryBtn2.innerHTML = 'Курьером';

      

      if(deliveryType.toLowerCase().includes('пункт выдачи')){ 
        modalDeliveryBtn1.classList.add('modal-delivery-btns__btn-active');
        modalBtns.append(modalDeliveryBtn1);
        modalBtns.append(modalDeliveryBtn2);
        modalDeliveryTitle.innerHTML = 'Адреса пунктов выдачи';

        createModalCheckboxes(pointAdress, true, true, deliveryAdress, allCardsName, modalCheckboxesList);

      } else{
        modalDeliveryBtn2.classList.add('modal-delivery-btns__btn-active');
        modalBtns.append(modalDeliveryBtn1);
        modalBtns.append(modalDeliveryBtn2);
        modalDeliveryTitle.innerHTML = 'Мои адреса';

        createModalCheckboxes(homeAdress, false, true, deliveryAdress, allCardsName, modalCheckboxesList);
      };

      hangListenerOnModalBtns (modalDeliveryBtn1, modalDeliveryBtn2, pointAdress, homeAdress, deliveryAdress, allCardsName, modalCheckboxesList, modalDeliveryTitle);

    }else if(cardNumber){
      modalContainer.classList.add('modal-container-card');
      createModalCheckboxes(allCardsNumber, false, false, cardNumber, allCardsName, modalCheckboxesList);
    };

    modalCloseBtn.addEventListener('click', () =>{
      modal.remove();
      document.body.classList.remove('stop-scroll');
    });

    hangListenerOnModalCheckboxes(modalCheckboxesList);

    modalSubmitBtn.addEventListener('click', () =>{
      let boolean = false;
      for (let i=0; i<modalCheckboxesList.childNodes.length; i++){
        if(modalCheckboxesList.childNodes[i].firstChild.firstChild.checked === true){
          boolean = true;
          if(deliveryType){
            if (modalDeliveryBtn1.classList.contains('modal-delivery-btns__btn-active')){
              finalDeliveryType[0].innerHTML = 'Пункт выдачи';
              finalDeliveryType[1].innerHTML = 'Доставка в пункт выдачи';
              finalDeliveryAdress[0].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
              finalDeliveryAdress[0].nextElementSibling.classList.remove('passive');
              finalDeliveryAdress[1].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
            } else{
              finalDeliveryType[0].innerHTML = 'Курьер';
              finalDeliveryType[1].innerHTML = 'Курьером';
              finalDeliveryAdress[0].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
              finalDeliveryAdress[0].nextElementSibling.classList.add('passive');
              finalDeliveryAdress[1].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.innerHTML;
            };
          } else if(cardNumber){
            for (j in finalCardNumber){
              finalCardNumber[j].innerHTML = modalCheckboxesList.childNodes[i].firstChild.childNodes[1].lastChild.innerHTML;
              finalCardName[j].classList.remove('modal-checkbox__icon-mir', 'modal-checkbox__icon-visa', 'modal-checkbox__icon-maestro', 'modal-checkbox__icon-mastercard');
              if(modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-mir')){
                finalCardName[j].classList.add('modal-checkbox__icon-mir');
              } else if (modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-visa')){
                finalCardName[j].classList.add('modal-checkbox__icon-visa');
              } else if (modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-mastercard')){
                finalCardName[j].classList.add('modal-checkbox__icon-mastercard');
              } else if (modalCheckboxesList.childNodes[i].firstChild.childNodes[1].firstChild.classList.contains('modal-checkbox__icon-maestro')){
                finalCardName[j].classList.add('modal-checkbox__icon-maestro');
              };
            };
          };
        };
      };
      if (boolean){
        modal.remove();
        document.body.classList.remove('stop-scroll');
      } else{
        for (let i=0; i<modalCheckboxesList.childNodes.length; i++){
          modalCheckboxesList.childNodes[i].firstChild.lastChild.classList.add('modal-checkbox__sign-error');
        };
      };
    });
    
    modalHeader.append(modalTitle);
    modalHeader.append(modalCloseBtn);
    if(deliveryType){
      modalCheckboxes.append(modalDeliveryTitle);
    }
    modalCheckboxes.append(modalCheckboxesList);
    modalSubmit.append(modalSubmitBtn);
    modalContainer.append(modalHeader);
    if(deliveryType){
      modalContainer.append(modalBtns);
    }
    modalContainer.append(modalCheckboxes);
    modalContainer.append(modalSubmit);
    modal.append(modalContainer);
    document.body.append(modal);
    document.body.classList.add('stop-scroll');
  };


  function hangListenerOnModalCheckboxes(modalCheckboxesList){
    for (let i=0; i<modalCheckboxesList.childNodes.length; i++){
      modalCheckboxesList.childNodes[i].firstChild.addEventListener('click', () => {
        if(modalCheckboxesList.childNodes[i].firstChild.firstChild.checked === true){
          for (let j=0; j<modalCheckboxesList.childNodes.length; j++){
            if (i!==j){
              modalCheckboxesList.childNodes[j].firstChild.firstChild.checked = false;
            };
            modalCheckboxesList.childNodes[j].firstChild.lastChild.classList.remove('modal-checkbox__sign-error');
          };
        };
      });
    };
  };

  function hangListenerOnModalBtns (btn, otherBtn, pointAdress, homeAdress, deliveryAdress, allCardsName, modalCheckboxesList, modalDeliveryTitle){
    btn.addEventListener('click', () =>{
      btn.classList.add('modal-delivery-btns__btn-active');
      otherBtn.classList.remove('modal-delivery-btns__btn-active');
      modalDeliveryTitle.innerHTML = 'Адреса пунктов выдачи';
      createModalCheckboxes(pointAdress, true, true, deliveryAdress, allCardsName, modalCheckboxesList);
      hangListenerOnModalCheckboxes(modalCheckboxesList);
    });
    otherBtn.addEventListener('click', () =>{
      otherBtn.classList.add('modal-delivery-btns__btn-active');
      btn.classList.remove('modal-delivery-btns__btn-active');
      modalDeliveryTitle.innerHTML = 'Мои адреса';
      createModalCheckboxes(homeAdress, false, true, deliveryAdress, allCardsName, modalCheckboxesList);
      hangListenerOnModalCheckboxes(modalCheckboxesList);
    });
  }


  function createModalCheckboxes(mass, deliveryType, isDelivery, checkedMeaning, allCardsName, modalCheckboxesList){
    while (modalCheckboxesList.firstChild) {
      modalCheckboxesList.removeChild(modalCheckboxesList.lastChild);
    }
    for (let i in mass){
      const modalCheckbox = document.createElement('li');
      const modalCheckboxLabel = document.createElement('lable');
      const modalCheckboxInput = document.createElement('input');
      const modalCheckboxDescr = document.createElement('div');
      const modalCheckboxText = document.createElement('span');
      const modalCheckboxInfo = document.createElement('div');
      const modalCheckboxInfoText = document.createElement('span');
      const modalCheckboxInfoStar = document.createElement('span');
      const modalCheckboxSign = document.createElement('span');
      const modalCheckboxIcon = document.createElement('span');
      const modalCheckboxDelete = document.createElement('button');

      modalCheckboxInput.type = 'checkbox';
      modalCheckboxInput.name = 'check';

      modalCheckbox.classList.add('modal-checkbox', 'flex');
      modalCheckboxLabel.classList.add('modal-checkbox__label', 'flex');
      modalCheckboxInput.classList.add('modal-checkbox__input');
      modalCheckboxSign.classList.add('modal-checkbox__sign');

      modalCheckboxText.innerHTML = mass[i];

      if(isDelivery){
        modalCheckboxDescr.classList.add('modal-checkbox__descr', 'flex');
        modalCheckboxText.classList.add('modal-checkbox__text');
        modalCheckboxInfo.classList.add('modal-checkbox__info');
        modalCheckboxInfoStar.classList.add('modal-checkbox__info-star');
        modalCheckboxDelete.classList.add('modal-checkbox__btn', 'btn-resert');
        modalCheckboxInfoStar.innerHTML = '4.99';

        modalCheckboxDelete.addEventListener('click', () =>{
          modalCheckbox.remove();
        });
      }else{
        modalCheckbox.classList.add('modal-checkbox-card');
        modalCheckboxLabel.classList.add('modal-checkbox__label-card');
        modalCheckboxDescr.classList.add('modal-checkbox__text', 'flex');
        modalCheckboxIcon.classList.add('modal-checkbox__icon');

        switch(allCardsName[i]){
          case 'mir':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-mir');
            break;
          case 'visa':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-visa');
            break;
          case 'mastercard':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-mastercard');
            break;
          case 'maestro':
            modalCheckboxIcon.classList.add('modal-checkbox__icon-maestro');
            break;
        };
      }
      

      modalCheckboxLabel.addEventListener('click', () =>{
        if(modalCheckboxInput.checked){
          modalCheckboxInput.checked = false;
        } else{
          modalCheckboxInput.checked = true;
        }
      });
      
      if(mass[i] === checkedMeaning){
        modalCheckboxInput.checked = true;
      };

      if(!isDelivery){
        modalCheckboxDescr.append(modalCheckboxIcon);
      };
      modalCheckboxDescr.append(modalCheckboxText);
      if(deliveryType){
        modalCheckboxInfo.append(modalCheckboxInfoStar);
        modalCheckboxInfo.append(modalCheckboxInfoText);
        modalCheckboxDescr.append(modalCheckboxInfo);
      };
      modalCheckboxLabel.append(modalCheckboxInput);
      modalCheckboxLabel.append(modalCheckboxDescr);
      modalCheckboxLabel.append(modalCheckboxSign);
      modalCheckbox.append(modalCheckboxLabel);
      if(isDelivery){
        modalCheckbox.append(modalCheckboxDelete);
      };
      modalCheckboxesList.append(modalCheckbox);
    };
    return(modalCheckboxesList);
  };
  

  function hangListenerOnInput(value, i){
    switch (i) {
      case '0':
        manageErrorElement(errorsInName(value), i);
        break;
      case '1':
        manageErrorElement(errorsInSurname(value), i);
        break;
      case '2':
        manageErrorElement(errorsInEmail(value), i);
        break;
      case '3':
        manageErrorElement(errorsInTel(value), i);
        break;
      case '4':
        manageErrorElement(errorsInIndex(value), i);
        break;
    };
  };


  function manageErrorElement(error, i){
    if(error){
      if(massInputs[i].parentNode.querySelector('.section-recipient-form__error')){
        massInputs[i].parentNode.querySelector('.section-recipient-form__error').classList.remove('passive');
        massInputs[i].parentNode.querySelector('.section-recipient-form__error').innerHTML = error;
      } else{
        let textError = document.createElement('span');
        textError.classList.add('section-recipient-form__error');
        if(massInputs[i].parentNode.querySelector('.section-recipient-form__info')){
          textError.classList.add('section-recipient-form__error-index');
        }
        textError.innerHTML = error;
        massInputs[i].parentNode.append(textError);
      };
      massInputs[i].classList.add('section-recipient-form__input-wrong');
    } else {
      if(massInputs[i].parentNode.querySelector('.section-recipient-form__error')){
        massInputs[i].parentNode.querySelector('.section-recipient-form__error').classList.add('passive');
        massInputs[i].classList.remove('section-recipient-form__input-wrong');
      }
    };
  };

  function errorsInName(name){
    let textErrorName = '';
    if (!name){
      textErrorName = 'Укажите имя';
    } else if(/[^a-z]/i.test(name) && /[^а-я]/i.test(name)){
      textErrorName = 'Введите корректное имя';
    }
    return(textErrorName);
  }

  function errorsInSurname(surname){
    let textErrorSurname = '';
    if (!surname){
      textErrorSurname = 'Введите фамилию';
    } else if(/[^a-z]/i.test(surname) && /[^а-я]/i.test(surname)){
      textErrorSurname = 'Введите корректную фамилию';
    } 
    return(textErrorSurname);
  }

  function errorsInEmail(email){
    let textErrorEmail = '';
    if (!email){
      textErrorEmail = 'Укажите электронную почту';
    } else if(!validateEmail(email)){
      textErrorEmail = 'Укажеите корректный адрес';
    }
    return(textErrorEmail);
  }

  function errorsInTel(tel){
    let textErrorTel = '';
    if (!tel){
      textErrorTel = 'Укажите номер телефона';
    } else if(!validateTel(tel)){
      textErrorTel = 'Формат: +9 (999) 999-99-99';
    }
    return(textErrorTel);
  }

  function errorsInIndex(index){
    let textErrorIndex = '';
    if (!index){
      textErrorIndex = 'Укажите индекс';
    } else if(index.length > 10) {
      textErrorIndex = 'Индекс не может быть длинне 10 цифр';
    } else if(!validateIndex(index)){
      textErrorIndex = 'Укажите корректный ИНН';
    }
    return(textErrorIndex);
  }

  

  function validateEmail(email){
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  function validateTel(tel){
    return tel.match(
      /^[+][0-9][\s][(][0-9]{3}[)][\s][0-9]{3}[-][0-9]{2}[-][0-9]{2}$/
    );
  };

  function validateIndex(index){
    return index.match(
      /^([0-9]{6}|[0-9]{7}|[0-9]{8}|[0-9]{9}|[0-9]{10})$/
    );
  };



  function calculateTotalPrice(){
    let totalSumm = 0;
    let totalPreviousSumm = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    console.log(goodsPrices)
    for (let i = 0; i<itemsAvailable.length; i++){
      if (itemsAvailable[i].classList.contains('bucket__item-delete')) {
        if (itemsAvailable[i].querySelector('.c-check__item').checked) {
          const itemAmount = parseInt(itemsAvailable[i].querySelector('.counter').innerHTML);
          const totalItemPrice = parseFloat((itemAmount*goodsPrices[i].itemPrice).toFixed(0));
          console.log(itemAmount)
          const totalItemPreviosPrice = parseFloat((itemAmount*goodsPrices[i].itemPreviosPrice).toFixed(0));
          
          totalSumm += totalItemPrice;
          console.log(totalSumm)
          totalPreviousSumm += totalItemPreviosPrice;
          totalAmount += itemAmount
          console.log(totalAmount)
          totalDiscount += itemAmount*goodsPrices[i].itemDiscount;

          const totalItemPriceText = itemsAvailable[i].querySelector('.total-price');
  
          totalItemPriceText.innerHTML = makeStrfromNumber(totalItemPrice);
          itemsAvailable[i].querySelector('.crossed').innerHTML = makeStrfromNumber(totalItemPreviosPrice);
          
        };
      }

    }

    if (totalAmount%10===1 && totalAmount!==11){
      blockForPrice.querySelector('.section-total-top__item-amount').innerHTML = `${totalAmount}`+' '+'товар';
    } else if ((totalAmount%10===2 || totalAmount%10===3 || totalAmount%10==4) && (totalAmount!==12 || totalAmount!==13 || totalAmount!==14)){
      blockForPrice.querySelector('.section-total-top__item-amount').innerHTML = `${totalAmount}`+' '+'товара';
    } else{
      blockForPrice.querySelector('.section-total-top__item-amount').innerHTML = `${totalAmount}`+' '+'товаров';
    }

    totalPrice.innerHTML = makeStrfromNumber(totalSumm)  + ' ' + 'сом';
    blockForPrice.querySelector('.section-total-top__item-prev-price').innerHTML = makeStrfromNumber(totalPreviousSumm)  + ' ' + 'сом';
    blockForPrice.querySelector('.section-total-top__item-discount').innerHTML = '−'+ makeStrfromNumber(totalDiscount)  + ' ' + 'сом';

    if (payNowCheck.checked){
      oderBtn.innerHTML = 'Оплатить' + ' ' + `${totalPrice.innerHTML}`;
    };
    calculateAmountInDilivery();
  };

  function makeStrfromNumber(number){
    const masNumber = `${number}`.split('');
    let strNumber ='';
    let count = 0;

    for (let i in masNumber){
      if(count%3===0 && masNumber[masNumber.length-1-i] !== '.'){
        strNumber += ' ';
      }
      if (masNumber[masNumber.length-1-i] === '.'){
        count = 0;
      } else {
        count++;
      }
      strNumber += `${masNumber[masNumber.length-1-i]}`;
      
    }

    const resultStr = strNumber.split('').reverse().join('');
    return(resultStr);
  };



  function calculateAmountInDilivery (){
    const deliveryDay = document.querySelector('.section-total-middle__descr-day');
    console.log(blocksDeliveryPhotos)
    blocksDeliveryPhotos[0].parentNode.classList.remove('passive');
    blocksDeliveryPhotos[1].parentNode.classList.remove('passive');
    blocksDeliveryPhotos[1].parentNode.previousElementSibling.style.marginBottom = '';
    blocksDeliveryPhotos[0].parentNode.parentNode.style.marginBottom = '';
    blocksDeliveryPhotos[0].parentNode.parentNode.nextElementSibling.classList.remove('passive');
    deliveryDay.classList.remove('passive');
    deliveryDay.innerHTML = '5–6 февраля';
    let countBottom = 0;
    let countTop = 0;
    listItemsAvailable.querySelectorAll('.bucket__item-delete').forEach(function(el){

      let itemImg = el.querySelector('.image__wrapper').getElementsByTagName("img")[0];
      let itemAmount = parseInt(el.querySelector('.counter').innerHTML);
      let itemSrc = itemImg.getAttribute('src');

      let imgDeliveryBlockTop = blocksDeliveryPhotos[0].querySelector(`[src='${itemSrc}']`);
      console.log(imgDeliveryBlockTop)
      let imgDeliveryBlockBottom = blocksDeliveryPhotos[1].querySelector(`[src='${itemSrc}']`);
      
      if (el.querySelector('.c-check__item').checked){
        countTop ++;
        imgDeliveryBlockTop.parentNode.classList.remove('passive');
        if (imgDeliveryBlockBottom) {
          imgDeliveryBlockBottom.parentNode.classList.remove('passive');
        }
    
        if (itemAmount === 1){
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.add('passive');
        } else {
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.remove('passive');
        };
        if (itemAmount > 184){
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').innerHTML = `184`;
          if (itemAmount - 184 ===1 ) {
            imgDeliveryBlockBottom.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.add('passive');
          } else {
            imgDeliveryBlockBottom.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').classList.remove('passive');
            imgDeliveryBlockBottom.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').innerHTML = `${itemAmount - 184}`;
          };
          countBottom++;
        } else {
          imgDeliveryBlockTop.parentNode.querySelector('.section-delivery-middle__photo-descr-amount').innerHTML = `${itemAmount}`;
        };
      } else{
        imgDeliveryBlockTop.parentNode.classList.add('passive');
        if (imgDeliveryBlockBottom){
          imgDeliveryBlockBottom.parentNode.classList.add('passive');
        };
      };   
    });
    if(!countTop){
      blocksDeliveryPhotos[0].parentNode.classList.add('passive');
      blocksDeliveryPhotos[0].parentNode.previousElementSibling.style.marginBottom = '0';
      blocksDeliveryPhotos[0].parentNode.parentNode.style.marginBottom = '0';
      blocksDeliveryPhotos[0].parentNode.parentNode.nextElementSibling.classList.add('passive');
      deliveryDay.classList.add('passive');
    };
    if(!countBottom){
      blocksDeliveryPhotos[1].parentNode.classList.add('passive');
      blocksDeliveryPhotos[1].parentNode.previousElementSibling.style.marginBottom = '0';
      deliveryDay.innerHTML = '5–6 фев';
    };

    listItemsAvailable.querySelectorAll('.section-cart-accordion-list__item.passive').forEach(function(el){
      
      let itemImg = el.querySelector('.image__wrapper').getElementsByTagName("img")[0];
      let itemSrc = itemImg.getAttribute('src');

      let imgDeliveryBlockTop = blocksDeliveryPhotos[0].querySelector(`[src='${itemSrc}']`);
      let imgDeliveryBlockBottom = blocksDeliveryPhotos[1].querySelector(`[src='${itemSrc}']`);

      imgDeliveryBlockTop.parentNode.classList.add('passive');
        if (imgDeliveryBlockBottom){
          imgDeliveryBlockBottom.parentNode.classList.add('passive');
        };
    });
    
  };

  calculateTotalPrice();

});