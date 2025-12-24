// --------- Navbar theme switch --------- //
document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const sections = document.querySelectorAll("[data-theme]");
  const navbarCta = document.querySelector(".navbar__cta");
  const navbarCtaTextCont = document.querySelectorAll(".navbar__cta-text");

  const followMarkup = `
    <span class="cta-text">Follow us</span>
  <span class="cta-sep">&nbsp;</span>
  <a href="https://linkedin.com" target="_blank" rel="noopener" class="cta-link">( LI )</a>
  <span class="cta-sep">&nbsp;&amp;&nbsp;</span>
  <a href="https://x.com" target="_blank" rel="noopener" class="cta-link">( x )</a>
`;

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;

      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        const currentTheme = section.getAttribute("data-theme");
        navbar.classList.remove("light-theme", "dark-theme");
        navbar.classList.add(`${currentTheme}-theme`);

        if (section.id === "waitlist") {
          // Disable CTA click but keep layout + animation
          navbarCta.dataset.disabled = "true";
          navbarCta.removeAttribute("href");

          navbarCtaTextCont.forEach((el) => {
            el.innerHTML = followMarkup;
          });
        } else {
          // Restore CTA behavior
          navbarCta.dataset.disabled = "false";
          navbarCta.href = "#waitlist";

          navbarCtaTextCont.forEach((el) => {
            el.textContent = "JOIN THE WAITLIST";
          });
        }
      }
    });
  });
});

// Initialize Features Swiper
const featuresSwiper = new Swiper(".features__slider", {
  slidesPerView: 1,
  spaceBetween: 16,
  centeredSlides: false,
  pagination: {
    el: ".features__pagination",
    clickable: true,
  },

  breakpoints: {
    768: {
      slidesPerView: 3,
      spaceBetween: 12,
      centeredSlides: false,
      grid: {
        fill: "row",
        rows: 2,
      },
    },
  },
});

// Features Popup Functionality
const featuresPopup = document.querySelector(".features__popup");
const featuresCards = document.querySelectorAll(".features__card");
const popupClose = document.querySelector(".features__popup-close");

const popupIconContainer = document.querySelector(".features__popup-icon");
const popupTitle = document.querySelector(".features__popup-title");
const popupDescription = document.querySelector(".features__popup-description");
const popupTag = document.querySelector(".features__popup-tag");

function openPopup(icon, title, description, tag) {
  // Clone the SVG from the card and inject into popup
  popupIconContainer.innerHTML = "";
  if (icon) {
    popupIconContainer.appendChild(icon.cloneNode(true));
  }
  popupTitle.textContent = title;
  popupDescription.textContent = description;
  if (tag) {
    popupTag.textContent = tag.textContent;
    popupTag.style.display = "block";
  }
  featuresPopup.hidden = false;
  // Force reflow
  featuresPopup.offsetHeight;
  featuresPopup.classList.add("is-visible");
  document.body.style.overflow = "clip";
}

function closePopup() {
  featuresPopup.classList.remove("is-visible");
  document.body.style.overflow = "";
  setTimeout(() => {
    featuresPopup.hidden = true;
  }, 300);
}

featuresCards.forEach((card) => {
  card.addEventListener("click", () => {
    const iconSvg = card.querySelector(".features__icon svg");
    const title = card.querySelector(".h9, h3").textContent;
    const description = card.querySelector(
      ".features__card-description"
    ).textContent;
    const tag = card.querySelector(".tag");
    openPopup(iconSvg, title, description, tag);
  });
});

popupClose.addEventListener("click", closePopup);

featuresPopup.addEventListener("click", (e) => {
  if (e.target === featuresPopup) {
    closePopup();
  }
});

// Waitlist Form Handling
const waitlistForm = document.getElementById("waitlistForm");

// Validation functions
const validators = {
  firstName: (value) => ({
    isValid: value.trim().length >= 2 && value.trim().length <= 40,
    message: "Please enter your first name",
  }),
  lastName: (value) => ({
    isValid: value.trim().length >= 2 && value.trim().length <= 40,
    message: "Please enter your last name",
  }),
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: "Please enter a valid email address",
    };
  },
  bmsName: (value) => ({
    isValid:
      (value !== "" && value !== "Other") ||
      document
        .getElementById("otherBmsField")
        .querySelector("input")
        .value.trim() !== "",
    message: "Please select BMS you are using or specify your BMS",
  }),
};

// Show error for a field
function showError(input, message) {
  const field = input.parentElement;
  field.classList.add("form__field--error");

  // Remove any existing error message
  const existingError = field.querySelector(".form__field__error");
  if (existingError) {
    existingError.remove();
  }

  // Add error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "form__field__error";
  errorDiv.textContent = message;
  field.appendChild(errorDiv);
}

// Clear error for a field
function clearError(input) {
  const field = input.parentElement;
  field.classList.remove("form__field--error");
  const errorDiv = field.querySelector(".form__field__error");
  if (errorDiv) {
    errorDiv.remove();
  }
}

// Validate a single field
function validateField(input) {
  const value = input.value;
  const validatorName = input.name || input.getAttribute("data-validate");

  if (validators[validatorName]) {
    const { isValid, message } = validators[validatorName](value);
    if (!isValid) {
      showError(input, message);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }
  return true;
}

// Setup real-time validation
waitlistForm.querySelectorAll(".form__field__input").forEach((input) => {
  // Clear error on input
  input.addEventListener("input", () => {
    clearError(input);
  });
});

// Handle BMS "Other" option
const bmsSelect = document.getElementById("bmsSelect");
const otherBmsField = document.getElementById("otherBmsField");

bmsSelect.addEventListener("change", () => {
  if (bmsSelect.value === "Other") {
    otherBmsField.style.display = "block";
    otherBmsField.querySelector("input").required = true;
    // Trigger validation on the BMS select when other input changes
    otherBmsField.querySelector("input").addEventListener("input", () => {
      validateField(bmsSelect);
    });
  } else {
    otherBmsField.style.display = "none";
    otherBmsField.querySelector("input").required = false;
    otherBmsField.querySelector("input").value = "";
    clearError(bmsSelect);
  }
});

// Form submission
waitlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  let isValid = true;
  const formFields = waitlistForm.querySelector(".form__fields");
  const successMessage = waitlistForm.querySelector(".success__message");
  const submitButton = waitlistForm.querySelector(".waitlist__form__submit");

  // Validate all fields
  waitlistForm.querySelectorAll(".form__field__input").forEach((input) => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return;
  }

  try {
    submitButton.textContent = "Submitting...";
    submitButton.disabled = true;

    // Simulate API call - Replace with actual API endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success state
    waitlistForm.classList.add("waitlist__form--success");
    submitButton.textContent = "Successfully registered";
  } catch (error) {
    submitButton.disabled = false;
    submitButton.textContent = "Join the Waitlist";
    console.error("Form submission error:", error);
  }
});

/* Footer height calculate for linear gradient background */

const footer = document.querySelector("footer");
const root = document.documentElement;

function updateFooterHeight() {
  root.style.setProperty("--footer-height", `${footer.offsetHeight}px`);
}

updateFooterHeight();
window.addEventListener("resize", updateFooterHeight);

/* Animations */

import {
  animate,
  scroll,
  stagger,
  inView,
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

import { splitText } from "https://cdn.jsdelivr.net/npm/motion-plus@0.1.1/+esm";

const EASE_IMAGE = [0.16, 0.7, 0.3, 1];
const EASE_TEXT = [0.25, 0.55, 0.25, 1];
const EASE_LONG = [0.22, 0.61, 0.36, 1];
const EASE_CARD = [0.23, 0.98, 0.56, 1];

// 1. Navbar
animate(
  ".navbar",
  { y: [-90, 0], opacity: [0, 1] },
  { delay: 0, duration: 1, easing: EASE_LONG }
);

// 2. Nav links
animate(
  ".navbar__menu",
  { y: [-70, 0] },
  { delay: 0, duration: 1, easing: EASE_LONG }
);

// 3. CTA (appears last)
animate(
  ".navbar__cta",
  { y: [-140, 0] },
  { delay: 0, duration: 1, easing: EASE_LONG }
);

inView(".hero", () => {
  animate(
    ".hero__image",
    {
      opacity: [0, 1],
    },
    {
      delay: 0.45,
      duration: 1.15,
      easing: EASE_IMAGE,
    }
  );

  animate(
    ".hero__label",
    {
      opacity: [0, 1],
      y: [8, 0],
    },
    {
      delay: 0.55,
      duration: 1.2,
      easing: EASE_TEXT,
    }
  );

  animate(
    ".hero__title",
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: 0.8,
      duration: 1.2,
      easing: EASE_LONG,
    }
  );

  animate(
    ".hero__description",
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: 1.05,
      duration: 1.15,
      easing: EASE_TEXT,
    }
  );

  animate(
    ".hero__feature",
    {
      opacity: [0, 1],
      y: [8, 0],
    },
    {
      delay: 1.25,
      duration: 1,
      easing: EASE_TEXT,
    }
  );
});
inView(".compare__card", () => {
  animate(
    ".compare__card--new",
    { opacity: [0, 1], scale: [0.99, 1], y: [70, 0] },
    { delay: 0.7, duration: 1.2, easing: EASE_CARD }
  );
  animate(
    ".compare__card--old",
    { opacity: [0, 1], scale: [0.99, 1], y: [70, 0] },
    { delay: 0.4, duration: 1.2, easing: EASE_CARD }
  );
});

inView(".stats__data__wrapper", () => {
  document.querySelectorAll(".stat__data").forEach((card, i) => {
    const value = card.querySelector(".stat__value");
    const afterSpan = value.querySelector("span"); // if ::after is actually a span
    const text = card.querySelector(".stat__text");

    // Animate value
    animate(
      value,
      { opacity: [0, 1], y: [20, 0] },
      { delay: i * 0.2, duration: 0.8, easing: EASE_TEXT }
    );

    // Animate inner span (or ::after replacement)
    if (afterSpan) {
      animate(
        afterSpan,
        { opacity: [0, 1], y: [10, 0] },
        { delay: 0.1 + i * 0.2, duration: 0.6, easing: EASE_IMAGE }
      );
    }

    // Animate text
    animate(
      text,
      { opacity: [0, 1], y: [20, 0] },
      { delay: 0.2 + i * 0.2, duration: 0.8, easing: EASE_LONG }
    );
  });
});

inView(".features__background", () => {
  animate(
    ".features__header .badge",
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: 0.3,
      duration: 1,
      easing: EASE_TEXT,
    }
  );

  animate(
    ".features__header .title",
    {
      opacity: [0, 1],
      y: [12, 1],
    },
    {
      delay: 0.6,
      duration: 1,
      easing: EASE_TEXT,
    }
  );

  animate(
    ".features__header .subtitle",
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: 0.9,
      duration: 1,
      easing: EASE_TEXT,
    }
  );
});

inView(".compliance__item", () => {
  animate(
    ".compliance__metric-title",
    { opacity: [0, 1], y: [30, 0] },
    { delay: stagger(0.25), duration: 1.2, easing: EASE_TEXT }
  );
  animate(
    ".compliance__metric-sub",
    { opacity: [0, 1], y: [30, 0] },
    { delay: stagger(0.3), duration: 1.2, easing: EASE_LONG }
  );
});

inView(".training__wrapper", () => {
  animate(
    ".training__visual img",
    {
      opacity: [0, 1],
    },
    {
      delay: 0.45,
      duration: 1.2,
      easing: EASE_IMAGE,
    }
  );

  animate(
    ".training__content .badge",
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: 0.15,
      duration: 1.2,
      easing: EASE_TEXT,
    }
  );

  animate(
    ".training__content h2",
    {
      opacity: [0, 1],
      y: [12, 0],
    },
    {
      delay: 0.3,
      duration: 1.2,
      easing: EASE_LONG,
    }
  );

  animate(
    ".training__list li",
    {
      opacity: [0, 1],
      y: [16, 0],
    },
    { duration: 1, delay: stagger(0.4), easing: EASE_CARD }
  );
});

inView(".perf__card", () => {
  animate(
    ".perf__card",
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.8, delay: stagger(0.25), easing: EASE_CARD }
  );
});

inView(".workflow__step--1 .workflow__step__content", () => {
  animate(
    ".workflow__step--1 .workflow__step-number",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.3, duration: 1, easing: EASE_CARD }
  );
  animate(
    ".workflow__step--1 .workflow__step-title",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.4, duration: 1, easing: EASE_TEXT }
  );
  animate(
    ".workflow__step--1 .workflow__step-description",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.5, duration: 1, easing: EASE_LONG }
  );
});

inView(".workflow__step--2 .workflow__step__content", () => {
  animate(
    ".workflow__step--2 .workflow__step-number",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.3, duration: 1, easing: EASE_CARD }
  );
  animate(
    ".workflow__step--2 .workflow__step-title",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.4, duration: 1, easing: EASE_TEXT }
  );
  animate(
    ".workflow__step--2 .workflow__step-description",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.5, duration: 1, easing: EASE_LONG }
  );
});

inView(".workflow__step--3 .workflow__step__content", () => {
  animate(
    ".workflow__step--3 .workflow__step-number",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.3, duration: 1, easing: EASE_CARD }
  );
  animate(
    ".workflow__step--3 .workflow__step-title",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.4, duration: 1, easing: EASE_TEXT }
  );
  animate(
    ".workflow__step--3 .workflow__step-description",
    { opacity: [0, 1], y: [20, 0] },
    { delay: 0.5, duration: 1, easing: EASE_LONG }
  );
});

inView(".priv__card", () => {
  animate(
    ".priv__card",
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.8, delay: stagger(0.25), easing: EASE_CARD }
  );
});

inView(".waitlist__form__submit", () => {
  animate(
    ".waitlist__form__submit",
    { y: [12, 0] },
    { delay: 0.2, duration: 1.2, easing: EASE_TEXT }
  );
});
