/* PRAVAAH - Sign-in page behaviour
 *
 * AUTHENTICATION INTEGRATION
 * ----------------------------------------------------------------------------
 * This project has no authentication provider configured. The page therefore
 * runs in `demo` mode: input is validated on the client, and an explicit notice
 * is shown. No session is created and no credentials are transmitted.
 *
 * To connect a real provider:
 *   1. Set `mode` to 'api'.
 *   2. Set `api.signInEndpoint`, `api.requestResetEndpoint` and `afterSignInUrl`
 *      to your backend routes. The sign-in request is POSTed as JSON with
 *      `credentials: 'include'`.
 *   3. The backend must verify credentials and set a secure, httpOnly,
 *      SameSite session cookie. A successful sign-in must return HTTP 2xx with
 *      JSON { "ok": true }. The browser only navigates after that response.
 *   4. Enable Google by setting `google.enabled = true` and `google.startUrl`
 *      to your OAuth start route once the provider and credentials exist.
 *   5. Set `registrationUrl` to the registration page. It defaults to
 *      `signup.html`, which exists in this project.
 *
 * Never place OAuth client secrets, API keys, or passwords in this file.
 * Passwords are never logged, stored, or placed in URLs.
 */

(function () {
    'use strict';

    var DEFAULT_CONFIG = {
        mode: 'demo', // 'demo' | 'api'
        afterSignInUrl: 'app.html',
        demoEntryUrl: 'app.html',
        registrationUrl: 'signup.html',
        api: {
            signInEndpoint: '/api/auth/signin',
            requestResetEndpoint: '/api/auth/password/request-reset'
        },
        google: {
            enabled: false,
            startUrl: '/api/auth/google/start'
        },
        messages: {
            missingEmail: 'Please enter your email address.',
            invalidEmail: 'Please enter a valid email address.',
            missingPassword: 'Please enter your password.',
            badCredentials: "We couldn't sign you in. Check your credentials and try again.",
            network: 'Something went wrong. Please try again.',
            tooMany: 'Too many attempts. Please wait a moment and try again.',
            resetSent: 'If an account exists for that address, password reset instructions would be sent.',
            resetUnavailable: ' If email delivery is not configured, no message will be sent.'
        }
    };

    function mergeConfig(base, override) {
        if (!override || typeof override !== 'object') return base;
        var merged = {};
        Object.keys(base).forEach(function (key) {
            merged[key] = base[key];
        });
        Object.keys(override).forEach(function (key) {
            var value = override[key];
            if (value && typeof value === 'object' && !Array.isArray(value) &&
                base[key] && typeof base[key] === 'object' && !Array.isArray(base[key])) {
                merged[key] = mergeConfig(base[key], value);
            } else {
                merged[key] = value;
            }
        });
        return merged;
    }

    var CONFIG = mergeConfig(DEFAULT_CONFIG, window.PRAVAAH_AUTH_CONFIG);

    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var REMEMBER_KEY = 'pravaah.rememberedEmail';

    document.addEventListener('DOMContentLoaded', function () {
        var signinView = document.getElementById('signinView');
        var recoveryView = document.getElementById('recoveryView');
        var signinForm = document.getElementById('signinForm');
        var recoveryForm = document.getElementById('recoveryForm');

        var emailInput = document.getElementById('email');
        var passwordInput = document.getElementById('password');
        var rememberInput = document.getElementById('remember');
        var recoveryEmailInput = document.getElementById('recoveryEmail');

        var emailError = document.getElementById('emailError');
        var passwordError = document.getElementById('passwordError');
        var recoveryEmailError = document.getElementById('recoveryEmailError');

        var formNotice = document.getElementById('formNotice');
        var formNoticeText = document.getElementById('formNoticeText');
        var formError = document.getElementById('formError');
        var formErrorText = document.getElementById('formErrorText');
        var recoveryNotice = document.getElementById('recoveryNotice');
        var recoveryNoticeText = document.getElementById('recoveryNoticeText');
        var recoveryError = document.getElementById('recoveryError');
        var recoveryErrorText = document.getElementById('recoveryErrorText');

        var signinBtn = document.getElementById('signinBtn');
        var signinBtnLabel = document.getElementById('signinBtnLabel');
        var googleBtn = document.getElementById('googleBtn');
        var googleBtnLabel = document.getElementById('googleBtnLabel');
        var recoveryBtn = document.getElementById('recoveryBtn');
        var recoveryBtnLabel = document.getElementById('recoveryBtnLabel');

        var demoEntry = document.getElementById('demoEntry');
        var togglePassword = document.getElementById('togglePassword');
        var eyeOn = document.querySelector('.icon-eye');
        var eyeOff = document.querySelector('.icon-eye-off');
        var forgotBtn = document.getElementById('forgotBtn');
        var backToSignin = document.getElementById('backToSignin');
        var registerBtn = document.getElementById('registerBtn');

        if (!signinForm || !emailInput || !passwordInput) {
            return;
        }

        var submitting = false;

        if (demoEntry && CONFIG.demoEntryUrl) {
            demoEntry.setAttribute('href', CONFIG.demoEntryUrl);
        }

        /* ---------- Restore remembered email (email only) ---------- */
        try {
            var rememberedEmail = window.localStorage.getItem(REMEMBER_KEY);
            if (rememberedEmail) {
                emailInput.value = rememberedEmail;
                if (rememberInput) rememberInput.checked = true;
            }
        } catch (err) {
            /* Storage can be unavailable (privacy mode); ignore. */
        }

        /* ---------- Helpers ---------- */
        function setFieldError(input, errorEl, message) {
            if (!input || !errorEl) return;
            if (message) {
                errorEl.textContent = message;
                errorEl.hidden = false;
                input.setAttribute('aria-invalid', 'true');
            } else {
                errorEl.textContent = '';
                errorEl.hidden = true;
                input.removeAttribute('aria-invalid');
            }
        }

        function clearFieldError(input, errorEl) {
            setFieldError(input, errorEl, '');
        }

        function showBox(box, textEl, message) {
            if (!box || !textEl) return;
            // Unhide first so assistive technology observes the content change
            // inside an already-visible live region.
            box.hidden = false;
            textEl.textContent = message;
        }

        function hideBox(box, textEl) {
            if (!box || !textEl) return;
            box.hidden = true;
            textEl.textContent = '';
        }

        function clearSigninMessages() {
            hideBox(formNotice, formNoticeText);
            hideBox(formError, formErrorText);
        }

        function clearRecoveryMessages() {
            hideBox(recoveryNotice, recoveryNoticeText);
            hideBox(recoveryError, recoveryErrorText);
        }

        function setButtonLoading(button, labelEl, isLoading, loadingText, idleText) {
            if (!button) return;
            button.disabled = isLoading;
            button.classList.toggle('is-loading', isLoading);
            button.setAttribute('aria-busy', isLoading ? 'true' : 'false');
            if (labelEl) labelEl.textContent = isLoading ? loadingText : idleText;
        }

        function isValidEmail(value) {
            return EMAIL_PATTERN.test(value);
        }

        function persistRememberedEmail(email) {
            try {
                if (rememberInput && rememberInput.checked) {
                    window.localStorage.setItem(REMEMBER_KEY, email);
                } else {
                    window.localStorage.removeItem(REMEMBER_KEY);
                }
            } catch (err) {
                /* Ignore storage failures. */
            }
        }

        function revealDemoEntry() {
            if (demoEntry) demoEntry.hidden = false;
        }

        /* ---------- Sign-in validation ---------- */
        function validateSignin() {
            var email = emailInput.value.trim();
            var password = passwordInput.value;
            var firstInvalid = null;

            clearFieldError(emailInput, emailError);
            clearFieldError(passwordInput, passwordError);

            if (!email) {
                setFieldError(emailInput, emailError, CONFIG.messages.missingEmail);
                firstInvalid = emailInput;
            } else if (!isValidEmail(email)) {
                setFieldError(emailInput, emailError, CONFIG.messages.invalidEmail);
                firstInvalid = emailInput;
            }

            if (!password) {
                setFieldError(passwordInput, passwordError, CONFIG.messages.missingPassword);
                if (!firstInvalid) firstInvalid = passwordInput;
            }

            if (firstInvalid) {
                firstInvalid.focus();
                return null;
            }

            return { email: email, password: password };
        }

        /* ---------- Sign-in submission ---------- */
        async function handleSignin(event) {
            event.preventDefault();
            if (submitting) return;

            clearSigninMessages();

            var values = validateSignin();
            if (!values) {
                if (demoEntry) demoEntry.hidden = true;
                return;
            }

            persistRememberedEmail(values.email);

            if (CONFIG.mode !== 'api' || !CONFIG.api.signInEndpoint) {
                showBox(
                    formNotice,
                    formNoticeText,
                    'Authentication is not configured in this preview, so no session was created. ' +
                    'You can open the demo workspace below to explore the interface.'
                );
                revealDemoEntry();
                return;
            }

            submitting = true;
            setButtonLoading(signinBtn, signinBtnLabel, true, 'Signing in\u2026', 'Sign in');
            if (googleBtn) googleBtn.disabled = true;

            try {
                var response = await fetch(CONFIG.api.signInEndpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password
                    })
                });

                if (response.ok) {
                    var payload = null;
                    try {
                        payload = await response.json();
                    } catch (err) {
                        payload = null;
                    }

                    if (!payload || payload.ok !== false) {
                        window.location.assign(CONFIG.afterSignInUrl || 'app.html');
                        return;
                    }
                }

                if (response.status === 401 || response.status === 403) {
                    showBox(formError, formErrorText, CONFIG.messages.badCredentials);
                } else if (response.status === 429) {
                    showBox(formError, formErrorText, CONFIG.messages.tooMany);
                } else {
                    showBox(formError, formErrorText, CONFIG.messages.network);
                }
            } catch (err) {
                showBox(formError, formErrorText, CONFIG.messages.network);
            } finally {
                submitting = false;
                setButtonLoading(signinBtn, signinBtnLabel, false, 'Signing in\u2026', 'Sign in');
                if (googleBtn) googleBtn.disabled = false;
            }
        }

        /* ---------- Google ---------- */
        function handleGoogle() {
            clearSigninMessages();
            hideBox(formNotice, formNoticeText);

            if (CONFIG.google && CONFIG.google.enabled && CONFIG.google.startUrl) {
                window.location.assign(CONFIG.google.startUrl);
                return;
            }

            showBox(
                formNotice,
                formNoticeText,
                'Google sign-in is not configured in this preview. Continue with email, ' +
                'or ask your administrator to enable Google OAuth.'
            );
        }

        /* ---------- Password visibility ---------- */
        function handleTogglePassword() {
            var shouldShow = passwordInput.type === 'password';
            passwordInput.type = shouldShow ? 'text' : 'password';
            togglePassword.setAttribute('aria-pressed', shouldShow ? 'true' : 'false');
            togglePassword.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
            if (eyeOn) eyeOn.hidden = shouldShow;
            if (eyeOff) eyeOff.hidden = !shouldShow;

            passwordInput.focus();
            var end = passwordInput.value.length;
            try {
                passwordInput.setSelectionRange(end, end);
            } catch (err) {
                /* Some inputs do not support selection; ignore. */
            }
        }

        /* ---------- Recovery view ---------- */
        function showRecovery() {
            clearSigninMessages();
            clearRecoveryMessages();
            clearFieldError(recoveryEmailInput, recoveryEmailError);

            if (signinView) signinView.hidden = true;
            if (recoveryView) recoveryView.hidden = false;

            var existingEmail = emailInput.value.trim();
            if (existingEmail && !recoveryEmailInput.value) {
                recoveryEmailInput.value = existingEmail;
            }

            recoveryEmailInput.focus();
        }

        function showSignin() {
            clearRecoveryMessages();
            if (recoveryView) recoveryView.hidden = true;
            if (signinView) signinView.hidden = false;
            emailInput.focus();
        }

        async function handleRecovery(event) {
            event.preventDefault();
            if (submitting) return;
            clearRecoveryMessages();

            var email = recoveryEmailInput.value.trim();
            clearFieldError(recoveryEmailInput, recoveryEmailError);

            if (!email) {
                setFieldError(recoveryEmailInput, recoveryEmailError, CONFIG.messages.missingEmail);
                recoveryEmailInput.focus();
                return;
            }

            if (!isValidEmail(email)) {
                setFieldError(recoveryEmailInput, recoveryEmailError, CONFIG.messages.invalidEmail);
                recoveryEmailInput.focus();
                return;
            }

            var genericMessage = CONFIG.messages.resetSent;

            if (CONFIG.mode !== 'api' || !CONFIG.api.requestResetEndpoint) {
                showBox(
                    recoveryNotice,
                    recoveryNoticeText,
                    genericMessage + CONFIG.messages.resetUnavailable
                );
                return;
            }

            submitting = true;
            setButtonLoading(recoveryBtn, recoveryBtnLabel, true, 'Sending\u2026', 'Send reset link');

            try {
                await fetch(CONFIG.api.requestResetEndpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                /* Always show the same message to avoid revealing whether an
                   account exists for the address. */
                showBox(recoveryNotice, recoveryNoticeText, genericMessage);
            } catch (err) {
                showBox(recoveryError, recoveryErrorText, CONFIG.messages.network);
            } finally {
                submitting = false;
                setButtonLoading(recoveryBtn, recoveryBtnLabel, false, 'Sending\u2026', 'Send reset link');
            }
        }

        /* ---------- Registration ---------- */
        function handleRegister() {
            if (CONFIG.registrationUrl) {
                window.location.assign(CONFIG.registrationUrl);
                return;
            }

            showBox(
                formNotice,
                formNoticeText,
                "Account creation isn't available in this preview. " +
                'Ask your administrator to request access.'
            );
        }

        /* ---------- Field-level error clearing ---------- */
        emailInput.addEventListener('input', function () {
            clearFieldError(emailInput, emailError);
        });

        passwordInput.addEventListener('input', function () {
            clearFieldError(passwordInput, passwordError);
        });

        recoveryEmailInput.addEventListener('input', function () {
            clearFieldError(recoveryEmailInput, recoveryEmailError);
        });

        /* ---------- Wiring ---------- */
        signinForm.addEventListener('submit', handleSignin);
        recoveryForm.addEventListener('submit', handleRecovery);

        if (googleBtn) googleBtn.addEventListener('click', handleGoogle);
        if (togglePassword) togglePassword.addEventListener('click', handleTogglePassword);
        if (forgotBtn) forgotBtn.addEventListener('click', showRecovery);
        if (backToSignin) backToSignin.addEventListener('click', showSignin);
        if (registerBtn) registerBtn.addEventListener('click', handleRegister);

        if (window.location.hash === '#recovery') {
            showRecovery();
        }
    });
})();
