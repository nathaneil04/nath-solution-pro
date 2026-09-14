/* =========================================================
   NATH SOLUTION
   Portfolio JavaScript
   - Theme
   - Navigation
   - Package Carousel
   - Before / After Slider
   - WebGL / Three.js
   - Google Sheets / Apps Script Forms
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     GOOGLE APPS SCRIPT
     Replace this with your REAL deployed Web App URL.
     Example:
     https://script.google.com/macros/s/XXXXXXXX/exec
     ========================================================= */

  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw1eXJTpSNcyUzO0qkG1I3rQOIYOFH3q5_FZwrw8VClhKx5D2oM1rBv5WhD5jHq4nA8Jg/exec";


  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =========================================================
     TOAST
     ========================================================= */

  const toast = $("#toast");

  let toastTimer = null;

  function showToast(message, duration = 3500) {
    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, duration);
  }


  /* =========================================================
     THEME
     ========================================================= */

  const root = document.documentElement;

  const savedTheme =
    localStorage.getItem("nath-theme");

  if (
    savedTheme === "dark" ||
    savedTheme === "light"
  ) {
    root.setAttribute(
      "data-theme",
      savedTheme
    );
  }

  const themeToggle =
    $("#themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener(
      "click",
      () => {
        const current =
          root.getAttribute("data-theme") ===
          "dark"
            ? "dark"
            : "light";

        const next =
          current === "dark"
            ? "light"
            : "dark";

        root.setAttribute(
          "data-theme",
          next
        );

        localStorage.setItem(
          "nath-theme",
          next
        );
      }
    );
  }


  /* =========================================================
     PAGE NAVIGATION
     ========================================================= */

  const pages =
    $$(".page");

  const navItems =
    $$(".nav-item");

  const sidebar =
    $("#sidebar");

  const mobileNavToggle =
    $("#mobileNavToggle");


  function openPage(
    pageName,
    updateHash = true
  ) {
    const target =
      document.getElementById(
        `view-${pageName}`
      );

    if (!target) {
      return;
    }

    pages.forEach((page) => {
      page.classList.toggle(
        "active",
        page.id === `view-${pageName}`
      );
    });

    navItems.forEach((item) => {
      item.classList.toggle(
        "active",
        item.dataset.page === pageName
      );
    });

    if (updateHash) {
      history.replaceState(
        null,
        "",
        `#${pageName}`
      );
    }

    sidebar?.classList.remove("open");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  document.addEventListener(
    "click",
    (event) => {
      const trigger =
        event.target.closest(
          "[data-page]"
        );

      if (!trigger) {
        return;
      }

      event.preventDefault();

      openPage(
        trigger.dataset.page
      );
    }
  );


  const initialPage =
    (
      window.location.hash ||
      "#work"
    ).replace("#", "");


  openPage(
    document.getElementById(
      `view-${initialPage}`
    )
      ? initialPage
      : "work",
    false
  );


  if (mobileNavToggle) {
    mobileNavToggle.addEventListener(
      "click",
      () => {
        sidebar?.classList.toggle(
          "open"
        );
      }
    );
  }


  /* =========================================================
     PACKAGE CAROUSEL
     ========================================================= */

  const slides =
    $$(".package-slide");

  const carouselDots =
    $$("#carouselDots button");

  let slideIndex = 0;
  let slideTimer = null;


  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    const safeIndex =
      ((index % slides.length) +
        slides.length) %
      slides.length;

    slides.forEach(
      (slide, i) => {
        slide.classList.toggle(
          "active",
          i === safeIndex
        );
      }
    );

    carouselDots.forEach(
      (dot, i) => {
        dot.classList.toggle(
          "active",
          i === safeIndex
        );
      }
    );

    slideIndex =
      safeIndex;
  }


  function startCarousel() {
    if (slides.length < 2) {
      return;
    }

    clearInterval(slideTimer);

    slideTimer =
      setInterval(() => {
        showSlide(
          slideIndex + 1
        );
      }, 4000);
  }


  function stopCarousel() {
    clearInterval(slideTimer);
    slideTimer = null;
  }


  showSlide(0);
  startCarousel();


  carouselDots.forEach(
    (dot, index) => {
      dot.addEventListener(
        "click",
        () => {
          showSlide(index);
          startCarousel();
        }
      );
    }
  );


  /* =========================================================
     BEFORE / AFTER SLIDER
     ========================================================= */

  const baSlider =
    $("#baSlider");

  const baAfter =
    $("#baAfter");

  const baHandle =
    $("#baHandle");


  if (
    baSlider &&
    baAfter &&
    baHandle
  ) {
    let dragging = false;


    function updateBeforeAfter(
      clientX
    ) {
      const rect =
        baSlider.getBoundingClientRect();

      if (!rect.width) {
        return;
      }

      let percentage =
        (
          (clientX - rect.left) /
          rect.width
        ) * 100;

      percentage =
        Math.max(
          0,
          Math.min(
            100,
            percentage
          )
        );

      baAfter.style.width =
        `${percentage}%`;

      baHandle.style.left =
        `${percentage}%`;
    }


    baHandle.addEventListener(
      "pointerdown",
      (event) => {
        dragging = true;

        baHandle.setPointerCapture?.(
          event.pointerId
        );

        updateBeforeAfter(
          event.clientX
        );
      }
    );


    baSlider.addEventListener(
      "pointerdown",
      (event) => {
        dragging = true;

        updateBeforeAfter(
          event.clientX
        );
      }
    );


    baSlider.addEventListener(
      "pointermove",
      (event) => {
        if (!dragging) {
          return;
        }

        updateBeforeAfter(
          event.clientX
        );
      }
    );


    window.addEventListener(
      "pointerup",
      () => {
        dragging = false;
      }
    );


    window.addEventListener(
      "pointercancel",
      () => {
        dragging = false;
      }
    );
  }


  /* =========================================================
     WEBGL / THREE.JS
     ========================================================= */

  const canvas =
    $("#webglCanvas");


  if (canvas) {

    /* Check whether Three.js loaded. */

    if (!window.THREE) {

      console.error(
        "Three.js was not loaded."
      );

      canvas.style.display =
        "none";

      const webglWrap =
        canvas.parentElement;

      if (webglWrap) {
        webglWrap.classList.add(
          "webgl-unavailable"
        );
      }

    } else {

      initializeWebGL(
        canvas
      );

    }
  }


  function initializeWebGL(
    canvasElement
  ) {
    const wrap =
      canvasElement.parentElement;

    if (!wrap) {
      return;
    }


    /* =======================================================
       WEBGL SUPPORT CHECK
       ======================================================= */

    let testContext = null;

    try {
      testContext =
        canvasElement.getContext(
          "webgl"
        ) ||
        canvasElement.getContext(
          "experimental-webgl"
        );
    } catch (error) {
      console.error(
        "WebGL context test failed:",
        error
      );
    }


    if (!testContext) {

      console.warn(
        "WebGL is not supported by this browser."
      );

      showWebGLFallback(
        wrap
      );

      return;
    }


    /* =======================================================
       THREE SCENE
       ======================================================= */

    let renderer;
    let scene;
    let camera;
    let mesh;
    let ring;
    let ring2;
    let particles;

    let animationFrame = null;

    let resizeObserver = null;

    let destroyed = false;


    try {

      scene =
        new THREE.Scene();


      /* Camera */

      camera =
        new THREE.PerspectiveCamera(
          55,
          1,
          0.1,
          100
        );

      camera.position.set(
        0,
        0,
        6
      );


      /* Renderer */

      renderer =
        new THREE.WebGLRenderer({
          canvas:
            canvasElement,
          antialias: true,
          alpha: true,
          powerPreference:
            "high-performance"
        });


      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          2
        )
      );


      renderer.setClearColor(
        0x000000,
        0
      );


      /* =====================================================
         MAIN 3D OBJECT
         ===================================================== */

      const geometry =
        new THREE.IcosahedronGeometry(
          1.75,
          2
        );


      const material =
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.95
        });


      mesh =
        new THREE.Mesh(
          geometry,
          material
        );


      scene.add(mesh);


      /* =====================================================
         OUTER RING
         ===================================================== */

      const ringGeometry =
        new THREE.TorusGeometry(
          2.45,
          0.018,
          12,
          160
        );


      const ringMaterial =
        new THREE.MeshBasicMaterial({
          color: 0x818cf8,
          transparent: true,
          opacity: 0.9
        });


      ring =
        new THREE.Mesh(
          ringGeometry,
          ringMaterial
        );


      ring.rotation.x =
        Math.PI / 2.6;


      scene.add(ring);


      /* =====================================================
         SECOND RING
         ===================================================== */

      const ringGeometry2 =
        new THREE.TorusGeometry(
          2.05,
          0.012,
          10,
          120
        );


      const ringMaterial2 =
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.55
        });


      ring2 =
        new THREE.Mesh(
          ringGeometry2,
          ringMaterial2
        );


      ring2.rotation.y =
        Math.PI / 2;


      scene.add(ring2);


      /* =====================================================
         PARTICLES
         ===================================================== */

      const particleCount =
        350;

      const particleGeometry =
        new THREE.BufferGeometry();

      const particlePositions =
        new Float32Array(
          particleCount * 3
        );


      for (
        let i = 0;
        i < particleCount;
        i++
      ) {

        const radius =
          3.5 +
          Math.random() * 3.5;

        const theta =
          Math.random() *
          Math.PI *
          2;

        const phi =
          Math.acos(
            2 * Math.random() - 1
          );


        const x =
          radius *
          Math.sin(phi) *
          Math.cos(theta);

        const y =
          radius *
          Math.sin(phi) *
          Math.sin(theta);

        const z =
          radius *
          Math.cos(phi);


        particlePositions[
          i * 3
        ] = x;

        particlePositions[
          i * 3 + 1
        ] = y;

        particlePositions[
          i * 3 + 2
        ] = z;
      }


      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          particlePositions,
          3
        )
      );


      const particleMaterial =
        new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 0.025,
          transparent: true,
          opacity: 0.7,
          sizeAttenuation: true
        });


      particles =
        new THREE.Points(
          particleGeometry,
          particleMaterial
        );


      scene.add(
        particles
      );


      /* =====================================================
         RESPONSIVE RESIZE
         ===================================================== */

      function resizeRenderer() {

        if (
          !renderer ||
          !wrap
        ) {
          return;
        }


        const width =
          Math.max(
            wrap.clientWidth,
            1
          );


        const height =
          Math.max(
            wrap.clientHeight,
            260
          );


        const pixelRatio =
          Math.min(
            window.devicePixelRatio || 1,
            2
          );


        renderer.setPixelRatio(
          pixelRatio
        );


        renderer.setSize(
          width,
          height,
          false
        );


        camera.aspect =
          width / height;


        camera.updateProjectionMatrix();

      }


      resizeRenderer();


      window.addEventListener(
        "resize",
        resizeRenderer,
        {
          passive: true
        }
      );


      /*
        ResizeObserver is important because the canvas can
        change size when the user changes pages, opens mobile
        navigation, or the browser changes layout.
      */

      if (
        "ResizeObserver" in window
      ) {

        resizeObserver =
          new ResizeObserver(
            () => {
              resizeRenderer();
            }
          );


        resizeObserver.observe(
          wrap
        );
      }


      /* =====================================================
         MOUSE / POINTER INTERACTION
         ===================================================== */

      let mouseX = 0;
      let mouseY = 0;

      let targetRotationX = 0;
      let targetRotationY = 0;


      wrap.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            wrap.getBoundingClientRect();


          if (!rect.width || !rect.height) {
            return;
          }


          const x =
            (
              event.clientX -
              rect.left
            ) / rect.width;


          const y =
            (
              event.clientY -
              rect.top
            ) / rect.height;


          mouseX =
            (x - 0.5) * 2;

          mouseY =
            (y - 0.5) * 2;


          targetRotationY =
            mouseX * 0.35;

          targetRotationX =
            mouseY * 0.2;

        }
      );


      wrap.addEventListener(
        "pointerleave",
        () => {

          mouseX = 0;
          mouseY = 0;

          targetRotationX = 0;
          targetRotationY = 0;

        }
      );


      /* =====================================================
         ANIMATION
         ===================================================== */

      let time = 0;


      function animate() {

        if (
          destroyed
        ) {
          return;
        }


        animationFrame =
          requestAnimationFrame(
            animate
          );


        time += 0.01;


        /* Main object */

        mesh.rotation.x +=
          0.003;


        mesh.rotation.y +=
          0.006;


        mesh.rotation.x +=
          (
            targetRotationX -
            mesh.rotation.x
          ) * 0.015;


        mesh.rotation.y +=
          (
            targetRotationY -
            mesh.rotation.y
          ) * 0.015;


        /* Rings */

        ring.rotation.z =
          time * 0.35;


        ring.rotation.y =
          Math.sin(time * 0.7) *
          0.35;


        ring2.rotation.x =
          time * 0.5;


        ring2.rotation.z =
          time * 0.18;


        /* Particles */

        particles.rotation.y =
          time * 0.035;


        particles.rotation.x =
          Math.sin(time * 0.15) *
          0.08;


        /* Gentle floating motion */

        mesh.position.y =
          Math.sin(time) *
          0.08;


        ring.position.y =
          Math.sin(time * 0.8) *
          0.04;


        renderer.render(
          scene,
          camera
        );
      }


      animate();


      /* =====================================================
         PAGE VISIBILITY
         ===================================================== */

      document.addEventListener(
        "visibilitychange",
        () => {

          if (
            document.hidden
          ) {

            if (
              animationFrame
            ) {

              cancelAnimationFrame(
                animationFrame
              );

              animationFrame =
                null;
            }

          } else {

            if (
              !animationFrame &&
              !destroyed
            ) {

              animate();

            }

          }

        }
      );


      /* =====================================================
         CLEANUP
         ===================================================== */

      window.addEventListener(
        "beforeunload",
        () => {

          destroyed = true;


          if (
            animationFrame
          ) {

            cancelAnimationFrame(
              animationFrame
            );

          }


          resizeObserver?.disconnect();


          geometry.dispose();

          material.dispose();

          ringGeometry.dispose();

          ringMaterial.dispose();

          ringGeometry2.dispose();

          ringMaterial2.dispose();

          particleGeometry.dispose();

          particleMaterial.dispose();

          renderer.dispose();

        }
      );


      console.info(
        "NATH SOLUTION WebGL initialized successfully."
      );


    } catch (error) {

      console.error(
        "WebGL initialization failed:",
        error
      );


      showWebGLFallback(
        wrap
      );

    }
  }


  /* =========================================================
     WEBGL FALLBACK
     ========================================================= */

  function showWebGLFallback(
    container
  ) {

    container.classList.add(
      "webgl-unavailable"
    );


    const fallback =
      document.createElement(
        "div"
      );


    fallback.className =
      "webgl-fallback";


    fallback.innerHTML = `
      <div>
        <strong>3D Preview Unavailable</strong>
        <span>Your browser does not currently support WebGL.</span>
      </div>
    `;


    container.appendChild(
      fallback
    );

  }


  /* =========================================================
     GOOGLE SHEETS VALIDATION
     ========================================================= */

  function hasGoogleScriptURL() {

    return (
      GOOGLE_SCRIPT_URL &&
      !GOOGLE_SCRIPT_URL.includes(
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
      ) &&
      /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec/
        .test(
          GOOGLE_SCRIPT_URL
        )
    );
  }


  function isValidEmail(
    email
  ) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(
        String(email).trim()
      );

  }


  /* =========================================================
     FORM BUTTON STATE
     ========================================================= */

  function setFormLoading(
    form,
    loading,
    loadingText
  ) {

    const button =
      form.querySelector(
        "button[type='submit']"
      );


    if (!button) {
      return;
    }


    if (loading) {

      if (
        !button.dataset.originalText
      ) {

        button.dataset.originalText =
          button.innerHTML;

      }


      button.disabled =
        true;


      button.setAttribute(
        "aria-busy",
        "true"
      );


      button.innerHTML =
        loadingText;


    } else {

      button.disabled =
        false;


      button.removeAttribute(
        "aria-busy"
      );


      if (
        button.dataset.originalText
      ) {

        button.innerHTML =
          button.dataset.originalText;

      }

    }
  }


  /* =========================================================
     SUBMIT TO GOOGLE APPS SCRIPT
     ========================================================= */

  async function submitToGoogleSheets(
    formType,
    formData
  ) {

    if (
      !hasGoogleScriptURL()
    ) {

      throw new Error(
        "Google Apps Script URL is not configured."
      );

    }


    const payload =
      new URLSearchParams();


    formData.forEach(
      (value, key) => {

        payload.append(
          key,
          String(
            value ?? ""
          )
        );

      }
    );


    payload.append(
      "form_type",
      formType
    );


    /*
      Google Apps Script is cross-origin.
      no-cors allows the browser to send the POST.
    */

    await fetch(
      GOOGLE_SCRIPT_URL,
      {
        method: "POST",
        mode: "no-cors",
        body: payload,
        keepalive: true
      }
    );


    return true;
  }


  /* =========================================================
     BOOK A CALL FORM
     ========================================================= */

  const bookCallForm =
    $("#bookCallForm");


  if (bookCallForm) {

    bookCallForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        if (
          !bookCallForm.checkValidity()
        ) {

          bookCallForm.reportValidity();

          return;
        }


        const formData =
          new FormData(
            bookCallForm
          );


        const fullName =
          String(
            formData.get(
              "full_name"
            ) || ""
          ).trim();


        const email =
          String(
            formData.get(
              "email"
            ) || ""
          ).trim();


        const projectType =
          String(
            formData.get(
              "project_type"
            ) || ""
          ).trim();


        const timeline =
          String(
            formData.get(
              "target_timeline"
            ) || ""
          ).trim();


        const projectOverview =
          String(
            formData.get(
              "project_overview"
            ) || ""
          ).trim();


        if (!fullName) {

          showToast(
            "Please enter your full name."
          );

          return;
        }


        if (!isValidEmail(email)) {

          showToast(
            "Please enter a valid email address."
          );

          return;
        }


        setFormLoading(
          bookCallForm,
          true,
          "Submitting..."
        );


        try {

          await submitToGoogleSheets(
            "book_call",
            formData
          );


          bookCallForm.reset();


          showToast(
            "Your project request has been submitted successfully."
          );


          console.info(
            "Book Call submitted:",
            {
              fullName,
              email,
              projectType,
              timeline,
              projectOverview
            }
          );


        } catch (error) {

          console.error(
            "Book Call submission failed:",
            error
          );


          showToast(
            "Unable to submit your request. Please try again."
          );


        } finally {

          setFormLoading(
            bookCallForm,
            false
          );

        }

      }
    );
  }


  /* =========================================================
     CONTACT FORM
     ========================================================= */

  const contactForm =
    $("#contactForm");


  if (contactForm) {

    contactForm.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        if (
          !contactForm.checkValidity()
        ) {

          contactForm.reportValidity();

          return;
        }


        const formData =
          new FormData(
            contactForm
          );


        const name =
          String(
            formData.get(
              "name"
            ) || ""
          ).trim();


        const email =
          String(
            formData.get(
              "email"
            ) || ""
          ).trim();


        const message =
          String(
            formData.get(
              "message"
            ) || ""
          ).trim();


        if (!name) {

          showToast(
            "Please enter your name."
          );

          return;
        }


        if (!isValidEmail(email)) {

          showToast(
            "Please enter a valid email address."
          );

          return;
        }


        if (!message) {

          showToast(
            "Please enter your message."
          );

          return;
        }


        setFormLoading(
          contactForm,
          true,
          "Sending..."
        );


        try {

          await submitToGoogleSheets(
            "contact",
            formData
          );


          contactForm.reset();


          showToast(
            "Your message has been sent successfully."
          );


          console.info(
            "Contact message submitted:",
            {
              name,
              email,
              message
            }
          );


        } catch (error) {

          console.error(
            "Contact submission failed:",
            error
          );


          showToast(
            "Unable to send your message. Please try again."
          );


        } finally {

          setFormLoading(
            contactForm,
            false
          );

        }

      }
    );
  }


  /* =========================================================
     PAUSE CAROUSEL WHEN TAB IS HIDDEN
     ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        stopCarousel();

      } else {

        startCarousel();

      }

    }
  );


  /* =========================================================
     FINAL STATUS
     ========================================================= */

  console.info(
    "NATH SOLUTION portfolio JavaScript loaded."
  );


  if (
    !hasGoogleScriptURL()
  ) {

    console.warn(
      "Google Sheets is not connected yet. " +
      "Replace GOOGLE_SCRIPT_URL with your Apps Script /exec URL."
    );

  }

})();