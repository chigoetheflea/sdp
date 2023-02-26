"use strict";

const MENU_ACTIVE_CLASS = `header__menu--active`;
const MENU_CLOSED_CLASS = `header__menu--closed`;
const CLASS_REMOVING_TIME = 700;

const SLIDER_CLASSES = [`peppermint`, `peppermint-inactive`];
const SLIDER = `.js-slider`;
const SLIDER_NAV = `.js-slider-navigation`;
const SLIDER_PREV = `.js-slider-prev`;
const SLIDER_NEXT = `.js-slider-next`;
const SLIDER_DOTS = `.js-slider-dots`;

const MODAL = `.js-modal`;
const MODAL_CLOSE = `.js-modal-close`;
const MODAL_ACTIVE_CLASS = `modal--active`;
const MODAL_CLOSED_CLASS = `modal--closed`;

const SCROLL_BUTTON_CLASS = `.js-scroll`;

const HEADER = `.header`;
const HEADER_INVERSE_CLASS = `header--gold`;
const INVERSE_CLASS = `.js-inverse`;

const LOADING = `.js-loading`;
const LOADING_HIDDEN_CLASS = `loading--hidden`;

const SCROLL_OFFSET = -50;

const FORM = `.form`;
const FORM_RESULT = `.form__result`;
const FORM_INPUT = `.form__input`;
const FORM_RESULT_ACTIVE_CLASS = `form__result--active`;
const FORM_ALERT_ERROR = `Ошибка отправки!`;
const FORM_ALERT_SUCCESS = `Отправлено!`;
const FORM_METHOD = `POST`;
const FORM_SERVER_URL = (typeof phpHandler !== `undefined` ) ? phpHandler.url : `http://test9.fsfamily.ru/wp-content/themes/sdp/lib/mail_handler.php`;
const FORM_FIELD_DEFAULT_VALUE = ``;
const FORM_SUBMIT = `.js-submit`;
const FORM_AGREE = `.js-agree`;

const VALIDATE_FIELD = `[data-validate='true']`;
const TEST_REQUERED = `required`;
const TEST_PHONE = `phone`;
const TEST_EMAIL = `email`;
const TEST_VALIDATE = `validate`;
const VALIDATE_TRUE_CLASS = `form__input--success`;
const VALIDATE_FALSE_CLASS = `form__input--error`;

const MAP = `#map`;
const MAP_HINT = `SD & Partners`;
const MAP_BALLOON_CONTENT = `SD & Partners`;
const MAP_MARKER_PATH = `img/marker.svg`;

const SLIDER_SLIDE_CLASS = `latest-slider__slide`;

const SlidersSettings = {
  speed: 250,
  touchSpeed: 250,
  stopSlideshowAfterInteraction: true,
  dots: true,
  isResponsive: false,
};

const Resolution = {
  PC: 1200,
  TABLET: 560,
  MOBILE: 0,
};

const SliderItem = {
  PC: 4,
  TABLET: 2,
  MOBILE: 1,
};

const switchModalClasses = (element, classes) => {
  const {active, closed} = classes;
  element = element.classList;

  element.remove(active);
  element.add(closed);

  setTimeout(() => {
    element.remove(closed);
  }, CLASS_REMOVING_TIME);
};

document.addEventListener(`DOMContentLoaded`, function() {

  setTimeout(() => {
    document.querySelector(LOADING).classList.add(LOADING_HIDDEN_CLASS);
  }, 300);

  /* menu */

  const menuWrapper = document.querySelector(`.js-menu`);
  const menuButton = menuWrapper.querySelector(`.js-menu-button`);

  const openMenu = () => {
    menuWrapper.classList.add(MENU_ACTIVE_CLASS);
  };

  const closeMenu = () => {
    switchModalClasses(menuWrapper, {active: MENU_ACTIVE_CLASS, closed: MENU_CLOSED_CLASS,});
  };

  const isMenuOpen = (menu) => menu.classList.contains(MENU_ACTIVE_CLASS);

  menuButton.addEventListener(`click`, () => {
    (!isMenuOpen(menuWrapper)) ? openMenu() : closeMenu();
  });

  /* menu */

  /* scroll */

  const scrollButtons = Array.from(document.querySelectorAll(SCROLL_BUTTON_CLASS));

  if (scrollButtons.length) {
    scrollButtons.map((scrollButton) => {
      scrollButton.addEventListener(`click`, (evt) => {
        evt.preventDefault();

        const target = document.querySelector(evt.target.dataset.target);
        const position = target.getBoundingClientRect().top;

        if (isMenuOpen(menuWrapper)) {
          closeMenu();
        }

        window.scrollBy({
          top: position,
          behavior: `smooth`,
        });

      });
    });
  }

  /* scroll */

  /* sliders */

  const createContainers = (slides, parentElement) => {
    parentElement.innerHTML = ``;

    const currentWindowWidth = document.documentElement.clientWidth;
    let itemsNumb = SliderItem.PC;

    if (currentWindowWidth >= Resolution.PC) {
      itemsNumb = SliderItem.PC;
    } else if (currentWindowWidth >= Resolution.TABLET && currentWindowWidth < Resolution.PC) {
      itemsNumb = SliderItem.TABLET;
    } else {
      itemsNumb = SliderItem.MOBILE;
    }

    const containersNumb = Math.ceil(slides.length / itemsNumb);
    let slidesIndex = 0;

    for (let i = 0; i < containersNumb; i++) {
      let slideElement = document.createElement(`div`);
      slideElement.classList.add(SLIDER_SLIDE_CLASS);

      for (let j = slidesIndex, k = 0; k < itemsNumb; j++, k++) {
        let clone = slides[j].cloneNode(true);

        slideElement.insertAdjacentElement(`beforeend`, clone);

        if (j === slides.length - 1) {
          break;
        }
      }

      slidesIndex += itemsNumb;

      parentElement.appendChild(slideElement);
    }
  };

  const handleWindowResize = (slides, sliderContainer, dotsContainer, sliderSettings) => {
    const sliderWrapper = sliderContainer.querySelector(SLIDER);
    const sliderNavigation = sliderContainer.querySelector(SLIDER_NAV);

    createContainers(slides, sliderWrapper);

    dotsContainer.innerHTML = ``;

    const slider = Peppermint(
      sliderWrapper, {
        ...sliderSettings,
        dotsContainer: dotsContainer,
    });

    sliderNavigation.addEventListener(`click`, handleSliderControlClick.bind(null, slider, sliderContainer));
  };

  const handleSliderControlClick = (slider, sliderContainer, evt) => {
    const sliderPrev = sliderContainer.querySelector(SLIDER_PREV);
    const sliderNext = sliderContainer.querySelector(SLIDER_NEXT);

    if (evt.target === sliderPrev ) {
      slider.prev();
    }

    if (evt.target === sliderNext ) {
      slider.next();
    }
  };

  const initSlider = (sliderContainer, sliderSettings = SlidersSettings) => {
    if (sliderContainer) {
      const sliderWrapper = sliderContainer.querySelector(SLIDER);
      const sliderNavigation = sliderContainer.querySelector(SLIDER_NAV);
      const sliderDots = sliderContainer.querySelector(SLIDER_DOTS);
      let sourceSlides = null;

      sliderWrapper.classList.add(...SLIDER_CLASSES);

      if (sliderSettings.isResponsive) {
        sourceSlides = sliderContainer.querySelectorAll(`.latest__source .latest-slider__item`);

        createContainers(sourceSlides, sliderWrapper);
      }

      const slider = Peppermint(
        sliderWrapper, {
          ...sliderSettings,
          dotsContainer: sliderDots,
      });

      sliderNavigation.addEventListener(`click`, handleSliderControlClick.bind(null, slider, sliderContainer));

      if (sliderSettings.isResponsive) {
        window.addEventListener(`resize`, handleWindowResize.bind(null, sourceSlides, sliderContainer, sliderDots, sliderSettings));
      }
    }
  };

  initSlider(document.querySelector(`.js-slider-first-screen`), {
    ...SlidersSettings,
    slideshow: true,
    slideshowInterval: 5000,
  });

  initSlider(document.querySelector(`.js-slider-services`));

  initSlider(document.querySelector(`.js-slider-latest-news`), {
    ...SlidersSettings,
    isResponsive: true,
  });

  initSlider(document.querySelector(`.js-slider-cases`), {
    ...SlidersSettings,
    isResponsive: true,
  });

  /* sliders */

  /* map */

  const MARKER_MOBILE_SIZE = {
    width: 60,
    height: 96,
  };

  const defaultCoords = [55.765022, 37.598762];
  const coords = (typeof mapMarker !== `undefined`) ? (mapMarker.coords).replace(` `, ``).split(`,`) : defaultCoords;
  const markerUrl = (typeof mapMarker !== `undefined`) ? mapMarker.url : MAP_MARKER_PATH;
  console.log(coords);
  const currentMarkerSize = MARKER_MOBILE_SIZE;

  const mapContainer = document.querySelector(MAP);

  if (mapContainer) {
    ymaps.ready(function () {
      const mZoom = 17;
      const map = new ymaps.Map(`map`, {
          center: coords,
          zoom: mZoom,
        }, {
          searchControlProvider: `yandex#search`,
        }
      ),
      marker = new ymaps.Placemark(coords, {
          hintContent: MAP_HINT,
          balloonContent: MAP_BALLOON_CONTENT,
        }, {
          iconLayout: `default#image`,
          iconImageHref: markerUrl,
          iconImageSize: [currentMarkerSize.width, currentMarkerSize.height],
          iconImageOffset: [-1 * currentMarkerSize.width / 2, -1 * currentMarkerSize.height ],
        }
      );

      map.behaviors.disable(`scrollZoom`);
      map.geoObjects.add(marker);
    });
  }

  /* map */

  /* __ form sending */

  const clearForm = (form) => {
    const fields = Array.from(form.querySelectorAll(FORM_INPUT));
    const resultField = form.querySelector(FORM_RESULT);

    fields.map((field) => {
      field.value = FORM_FIELD_DEFAULT_VALUE;

      changeLabelClass(field, true);
    });

    resultField.classList.remove(FORM_RESULT_ACTIVE_CLASS);
  };

  const handleDataLoaded = (form) => {
    const resultField = form.querySelector(FORM_RESULT);

    resultField.textContent = FORM_ALERT_SUCCESS;
    resultField.classList.add(FORM_RESULT_ACTIVE_CLASS);

    setTimeout(clearForm.bind(null, form), 2000);
  };

  const handleDataFailed = (form) => {
    const resultField = form.querySelector(FORM_RESULT);

    resultField.textContent = FORM_ALERT_ERROR;
  };

  const sendFormData = (form) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData(form);

    xhr.addEventListener(`load`, handleDataLoaded.bind(null, form));
    xhr.addEventListener(`error`, handleDataFailed.bind(null, form));

    xhr.open(FORM_METHOD, FORM_SERVER_URL);
    xhr.send(formData);
  };

  /* __ form sending */

  /* __ form check */

  const testRequired = (valueToTest) => {
    return valueToTest !== ``;
  };

  const testPhone = (valueToTest) => {
    const phoneRegExp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

    return phoneRegExp.test(valueToTest);
  };

  const testEmail = (valueToTest) => {
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegExp.test(valueToTest);
  };

  const checkField = (field) => {
    const tests = Object.keys(field.dataset);
    const fieldValue = field.value;

    const testingResult = tests.every((test) => {
      let singleTestResult = true;

      switch (test) {
        case TEST_REQUERED:
          singleTestResult = testRequired(fieldValue);
          break;

        case TEST_PHONE:
          singleTestResult = testPhone(fieldValue);
          break;

        case TEST_EMAIL:
          singleTestResult = testEmail(fieldValue);
          break;
      }

      return singleTestResult;
    });

    field.classList.remove(VALIDATE_TRUE_CLASS, VALIDATE_FALSE_CLASS);
    testingResult ? field.classList.add(VALIDATE_TRUE_CLASS) : field.classList.add(VALIDATE_FALSE_CLASS);

    return testingResult;
  };

  const checkForm = (formToCheck) => {
    const fieldsToCheck = Array.from(formToCheck.querySelectorAll(VALIDATE_FIELD));

    const checkPromise = new Promise((resolve, reject) => {
      const validationResult = fieldsToCheck.every((field) => {
        return checkField(field);
      });

      validationResult ? resolve(validationResult) : reject(validationResult);
    });

    checkPromise.then(
      result => result
    ).then(
      result => sendFormData(formToCheck),
      error => console.log(`no`)
    );
  };

  const handleFormSubmit = (form, evt) => {
    evt.preventDefault();

    checkForm(form);
  };

  const form = document.querySelector(`.js-form`);

  if (form) {
    form.addEventListener(`submit`, handleFormSubmit.bind(null, form));
  }

  /* __ form check */

  /* form labels */

  const changeLabelClass = (field, isHide = false) => {
    const label = document.querySelector(`[for='${field.getAttribute(`id`)}']`);
    const isFill = field.value !== ``;

    if (isHide && !isFill) {
      label.classList.remove(`form__label--transparent`);
    } else {
      label.classList.add(`form__label--transparent`);
    }
  };

  const handleFormFieldFocus = (evt) => {
    changeLabelClass(evt.target);
  };

  const handleFormFieldBlur = (evt) => {
    changeLabelClass(evt.target, true);
  };

  const handleWindowLoad = (formFields) => {
    formFields.forEach((field) => {
      changeLabelClass(field, true);
    });
  };

  if (form) {
    const formFields = form.querySelectorAll(`[type='text'], [type='email'], [type='tel'], textarea`);

    formFields.forEach((field) => {
      field.addEventListener(`focus`, handleFormFieldFocus);
      field.addEventListener(`blur`, handleFormFieldBlur);
    });

    window.addEventListener(`load`, handleWindowLoad.bind(null, formFields));
  }

  /* form labels */

  /* form agree */

  const changeSubmitAvailability = (checkbox) => {
    const formSubmit = document.querySelector(FORM_SUBMIT);

    formSubmit.disabled = !checkbox.checked;
  };

  const handleFormAgreeClick = (evt) => {
    changeSubmitAvailability(evt.target);
  };

  if (form) {
    const formAgreeField = form.querySelector(FORM_AGREE);

    formAgreeField.addEventListener(`click`, handleFormAgreeClick);
  }

  /* form agree */

  /* scrollspy */

  const changeHeaderClass = (offsets) => {
    const header = document.querySelector(HEADER);
    const windowScroll = window.pageYOffset - SCROLL_OFFSET;
    let isInverse = false;

    for (let i = 0; i < offsets.length; i++) {
      isInverse = offsets[i][0] <= windowScroll && windowScroll <= offsets[i][1];

      if (isInverse) {
        break;
      }
    }

    if (isInverse) {
      header.classList.add(HEADER_INVERSE_CLASS);
    } else {
      header.classList.remove(HEADER_INVERSE_CLASS);
    }
  };

  const onWindowScroll = (offsets) => {
    changeHeaderClass(offsets);
  };

  const sectionsForInverse = Array.from(document.querySelectorAll(INVERSE_CLASS));

  const addMultipleEventListeners = (element, events, handler) => {
    events.forEach((action) => {
      element.addEventListener(action, handler);
    });
  };

  if (sectionsForInverse) {
    const sectionsOffsets = sectionsForInverse.map((section) => ([section.offsetTop, section.offsetTop + section.offsetHeight]));

    addMultipleEventListeners(
      window,
      [`scroll`, `resize`, `load`,],
      onWindowScroll.bind(null, sectionsOffsets)
    );
  }

  /* scrollspy */

});
