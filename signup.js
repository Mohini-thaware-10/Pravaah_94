/* PRAVAAH - Create account page behaviour
 *
 * REGISTRATION INTEGRATION
 * ----------------------------------------------------------------------------
 * This project has no authentication or registration provider configured. The
 * page therefore runs in `demo` mode: the form validates on the client and an
 * explicit notice explains that no account was created and no email was sent.
 *
 * To connect a real registration service:
 *   1. Set `mode` to 'api'.
 *   2. Set `api.registerEndpoint` to your backend route. The form POSTs JSON
 *      with `credentials: 'include'`; the payload contains fullName, email,
 *      requestedRole ('authorized_official' or 'compliance_reviewer'),
 *      organization, optional institutionType/department, and password.
 *      Confirmation passwords are never transmitted.
 *   3. A successful registration must return HTTP 2xx with JSON:
 *          { "ok": true, "verificationRequired": true | false }
 *      `verificationRequired` is optional; when omitted the page shows a plain
 *      success state without claiming an email was sent.
 *   4. The backend must ignore any client-suggested privilege and assign roles
 *      server-side after verification/administrator approval. A role selected
 *      in this form is only a request.
 *   5. Set `api.resendVerificationEndpoint` only if the backend supports
 *      resending a verification email. The page shows the resend action only
 *      when that route is configured and the server asked for verification.
 *   6. The page never signs the user in automatically and never routes to a
 *      protected page. It links back to `signInUrl` after success.
 *
 * Never place secrets, API keys, or passwords in this file. Passwords are never
 * logged, stored, placed in URLs, or persisted in browser storage.
 */

(function () {
    'use strict';

    var DEFAULT_CONFIG = {
        mode: 'demo', // 'demo' | 'api'
        signInUrl: 'signin.html',
        api: {
            registerEndpoint: '/api/auth/register',
            resendVerificationEndpoint: ''
        },
        messages: {
            roleRequired: 'Select the type of account you need.',
            nameRequired: 'Please enter your full name.',
            emailRequired: 'Please enter your official email address.',
            emailInvalid: 'Please enter a valid email address.',
            organizationRequired: 'Please enter your organization or institution.',
            institutionRequired: 'Please enter your institution name.',
            officerOrganizationRequired: 'Please enter your government body or organization.',
            institutionTypeRequired: 'Please select your institution type.',
            departmentRequired: 'Please enter your department or office.',
            passwordRequired: 'Please create a password.',
            passwordWeak: 'Your password does not meet the requirements below.',
            confirmRequired: 'Please confirm your password.',
            confirmMismatch: 'Passwords do not match.',
            conflict: 'An account with this email already exists. Try signing in instead.',
            invalidDetails: 'Some details could not be accepted. Check your information and try again.',
            forbidden: 'Registration is not available for this account type. Contact your administrator.',
            tooMany: 'Too many attempts. Please wait a moment and try again.',
            generic: 'Something went wrong. Please try again.',
            confirmFailed: "We couldn't confirm your registration. Please contact your PRAVAAH administrator."
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
    var PASSWORD_MIN_LENGTH = 8;

    var ROLE_META = {
        authorized_official: {
            label: 'Authorized Official',
            organizationLabel: 'Institution name',
            organizationPlaceholder: 'e.g. Western Institute of Technology'
        },
        compliance_reviewer: {
            label: 'Compliance Reviewer',
            organizationLabel: 'Government body / organization',
            organizationPlaceholder: 'e.g. Department of Technical Education'
        }
    };

    document.addEventListener('DOMContentLoaded', function () {
        var signupView = document.getElementById('signupView');
        var resultView = document.getElementById('resultView');
        var form = document.getElementById('signupForm');

        var roleGroup = document.getElementById('roleGroup');
        var roleRadios = Array.prototype.slice.call(
            document.querySelectorAll('input[name="role"]')
        );

        var fullNameInput = document.getElementById('fullName');
        var emailInput = document.getElementById('email');
        var organizationInput = document.getElementById('organization');
        var organizationLabel = document.getElementById('organizationLabel');
        var institutionFields = document.getElementById('institutionFields');
        var institutionTypeInput = document.getElementById('institutionType');
        var officerFields = document.getElementById('officerFields');
        var departmentInput = document.getElementById('department');

        var passwordInput = document.getElementById('password');
        var confirmInput = document.getElementById('confirmPassword');

        var fullNameError = document.getElementById('fullNameError');
        var emailError = document.getElementById('emailError');
        var organizationError = document.getElementById('organizationError');
        var institutionTypeError = document.getElementById('institutionTypeError');
        var departmentError = document.getElementById('departmentError');
        var passwordError = document.getElementById('passwordError');
        var confirmPasswordError = document.getElementById('confirmPasswordError');
        var roleError = document.getElementById('roleError');

        var formNotice = document.getElementById('formNotice');
        var formNoticeText = document.getElementById('formNoticeText');
        var formError = document.getElementById('formError');
        var formErrorText = document.getElementById('formErrorText');

        var signupBtn = document.getElementById('signupBtn');
        var signupBtnLabel = document.getElementById('signupBtnLabel');
        var togglePassword = document.getElementById('togglePassword');
        var toggleConfirmPassword = document.getElementById('toggleConfirmPassword');

        var pwReqLength = document.querySelector('[data-req="length"]');
        var pwReqMix = document.querySelector('[data-req="mix"]');
        var pwStrength = document.getElementById('pwStrength');
        var pwStrengthLabel = document.getElementById('pwStrengthLabel');

        var resultTitle = document.getElementById('resultTitle');
        var resultText = document.getElementById('resultText');
        var resultSignin = document.getElementById('resultSignin');
        var resultIconSuccess = document.getElementById('resultIconSuccess');
        var resultIconMail = document.getElementById('resultIconMail');
        var resendBtn = document.getElementById('resendBtn');
        var resendBtnLabel = document.getElementById('resendBtnLabel');
        var resendNotice = document.getElementById('resendNotice');
        var resendNoticeText = document.getElementById('resendNoticeText');

        if (!form || !fullNameInput || !emailInput || !passwordInput) {
            return;
        }

        var submitting = false;
        var resending = false;
        var pendingEmail = '';

        if (resultSignin && CONFIG.signInUrl) {
            resultSignin.setAttribute('href', CONFIG.signInUrl);
        }

        /* ---------- Helpers ---------- */
        function setFieldError(input, errorEl, message) {
            if (!errorEl) return;
            errorEl.textContent = message || '';
            if (!input) return;
            if (message) {
                input.setAttribute('aria-invalid', 'true');
            } else {
                input.removeAttribute('aria-invalid');
            }
        }

        function clearFieldError(input, errorEl) {
            setFieldError(input, errorEl, '');
        }

        function setRoleError(message) {
            if (roleError) roleError.textContent = message || '';
            if (!roleGroup) return;
            if (message) {
                roleGroup.setAttribute('aria-invalid', 'true');
            } else {
                roleGroup.removeAttribute('aria-invalid');
            }
        }

        function showBox(box, textEl, message) {
            if (!box || !textEl) return;
            box.hidden = false;
            textEl.textContent = message;
        }

        function hideBox(box, textEl) {
            if (!box || !textEl) return;
            box.hidden = true;
            textEl.textContent = '';
        }

        function setButtonLoading(button, labelEl, isLoading, loadingText, idleText) {
            if (!button) return;
            button.disabled = isLoading;
            button.classList.toggle('is-loading', isLoading);
            button.setAttribute('aria-busy', isLoading ? 'true' : 'false');
            if (labelEl) labelEl.textContent = isLoading ? loadingText : idleText;
        }

        function selectedRole() {
            var checked = form.querySelector('input[name="role"]:checked');
            return checked ? checked.value : '';
        }

        function isValidEmail(value) {
            return EMAIL_PATTERN.test(value);
        }

        function normalizeEmail(value) {
            return value.trim().toLowerCase();
        }

        function passwordChecks(value) {
            return {
                length: value.length >= PASSWORD_MIN_LENGTH,
                mix: /[A-Za-z]/.test(value) && /\d/.test(value)
            };
        }

        function passwordIsValid(value) {
            var checks = passwordChecks(value);
            return checks.length && checks.mix;
        }

        function toggleRequirement(el, met) {
            if (!el) return;
            el.classList.toggle('is-met', met);
        }

        function renderPasswordState() {
            var value = passwordInput.value;
            var checks = passwordChecks(value);

            toggleRequirement(pwReqLength, checks.length);
            toggleRequirement(pwReqMix, checks.mix);

            if (!value) {
                if (pwStrength) pwStrength.hidden = true;
                return;
            }

            var score = 0;
            if (checks.length) score += 1;
            if (value.length >= 12) score += 1;
            if (checks.mix) score += 1;
            if (/[^A-Za-z0-9]/.test(value)) score += 1;

            var strength = score <= 2 ? 'weak' : (score === 3 ? 'fair' : 'strong');
            var label = strength.charAt(0).toUpperCase() + strength.slice(1);

            if (pwStrength) {
                pwStrength.hidden = false;
                pwStrength.setAttribute('data-strength', strength);
            }
            if (pwStrengthLabel) {
                pwStrengthLabel.textContent = 'Password strength: ' + label;
            }
        }

        function updateOrganizationField() {
            var role = selectedRole();
            var meta = ROLE_META[role];
            if (organizationLabel) {
                organizationLabel.textContent = meta ? meta.organizationLabel : 'Organization / Institution';
            }
            if (organizationInput) {
                organizationInput.placeholder = meta
                    ? meta.organizationPlaceholder
                    : 'e.g. Your institution or department';
            }
        }

        function setConditionalRequired(input, required) {
            if (!input) return;
            input.required = required;
            if (required) {
                input.setAttribute('aria-required', 'true');
            } else {
                input.removeAttribute('aria-required');
            }
        }

        function updateRoleUi() {
            var role = selectedRole();
            var isInstitution = role === 'authorized_official';
            var isOfficer = role === 'compliance_reviewer';

            if (institutionFields) institutionFields.hidden = !isInstitution;
            if (officerFields) officerFields.hidden = !isOfficer;

            if (institutionTypeInput) {
                institutionTypeInput.disabled = !isInstitution;
                setConditionalRequired(institutionTypeInput, isInstitution);
                if (!isInstitution) {
                    institutionTypeInput.value = '';
                    clearFieldError(institutionTypeInput, institutionTypeError);
                }
            }

            if (departmentInput) {
                departmentInput.disabled = !isOfficer;
                setConditionalRequired(departmentInput, isOfficer);
                if (!isOfficer) {
                    departmentInput.value = '';
                    clearFieldError(departmentInput, departmentError);
                }
            }

            updateOrganizationField();
        }

        /* ---------- Validation ---------- */
        function validate() {
            var firstInvalid = null;
            var role = selectedRole();

            clearFieldError(fullNameInput, fullNameError);
            clearFieldError(emailInput, emailError);
            clearFieldError(organizationInput, organizationError);
            clearFieldError(institutionTypeInput, institutionTypeError);
            clearFieldError(departmentInput, departmentError);
            clearFieldError(passwordInput, passwordError);
            clearFieldError(confirmInput, confirmPasswordError);
            setRoleError('');

            if (!role) {
                setRoleError(CONFIG.messages.roleRequired);
                firstInvalid = roleRadios[0] || null;
            }

            var fullName = fullNameInput.value.trim();
            if (!fullName) {
                setFieldError(fullNameInput, fullNameError, CONFIG.messages.nameRequired);
                if (!firstInvalid) firstInvalid = fullNameInput;
            }

            var email = normalizeEmail(emailInput.value);
            if (!email) {
                setFieldError(emailInput, emailError, CONFIG.messages.emailRequired);
                if (!firstInvalid) firstInvalid = emailInput;
            } else if (!isValidEmail(email)) {
                setFieldError(emailInput, emailError, CONFIG.messages.emailInvalid);
                if (!firstInvalid) firstInvalid = emailInput;
            }

            var organization = organizationInput.value.trim();
            if (!organization) {
                var organizationMessage = CONFIG.messages.organizationRequired;
                if (role === 'authorized_official') {
                    organizationMessage = CONFIG.messages.institutionRequired;
                } else if (role === 'compliance_reviewer') {
                    organizationMessage = CONFIG.messages.officerOrganizationRequired;
                }
                setFieldError(organizationInput, organizationError, organizationMessage);
                if (!firstInvalid) firstInvalid = organizationInput;
            }

            var institutionType = '';
            if (role === 'authorized_official') {
                institutionType = institutionTypeInput.value;
                if (!institutionType) {
                    setFieldError(institutionTypeInput, institutionTypeError, CONFIG.messages.institutionTypeRequired);
                    if (!firstInvalid) firstInvalid = institutionTypeInput;
                }
            }

            var department = '';
            if (role === 'compliance_reviewer') {
                department = departmentInput.value.trim();
                if (!department) {
                    setFieldError(departmentInput, departmentError, CONFIG.messages.departmentRequired);
                    if (!firstInvalid) firstInvalid = departmentInput;
                }
            }

            var password = passwordInput.value;
            if (!password) {
                setFieldError(passwordInput, passwordError, CONFIG.messages.passwordRequired);
                if (!firstInvalid) firstInvalid = passwordInput;
            } else if (!passwordIsValid(password)) {
                setFieldError(passwordInput, passwordError, CONFIG.messages.passwordWeak);
                if (!firstInvalid) firstInvalid = passwordInput;
            }

            var confirmation = confirmInput.value;
            if (!confirmation) {
                setFieldError(confirmInput, confirmPasswordError, CONFIG.messages.confirmRequired);
                if (!firstInvalid) firstInvalid = confirmInput;
            } else if (confirmation !== password) {
                setFieldError(confirmInput, confirmPasswordError, CONFIG.messages.confirmMismatch);
                if (!firstInvalid) firstInvalid = confirmInput;
            }

            if (firstInvalid) {
                firstInvalid.focus();
                return null;
            }

            return {
                role: role,
                fullName: fullName,
                email: email,
                organization: organization,
                institutionType: institutionType,
                department: department,
                password: password
            };
        }

        /* ---------- Submission ---------- */
        function buildPayload(values) {
            var payload = {
                fullName: values.fullName,
                email: values.email,
                requestedRole: values.role,
                organization: values.organization,
                password: values.password
            };
            if (values.role === 'authorized_official') {
                payload.institutionType = values.institutionType;
            }
            if (values.role === 'compliance_reviewer') {
                payload.department = values.department;
            }
            return payload;
        }

        function showResult(needsVerification, values) {
            pendingEmail = values.email;
            hideBox(formNotice, formNoticeText);
            hideBox(formError, formErrorText);

            if (signupView) signupView.hidden = true;
            if (resultView) resultView.hidden = false;

            if (resultIconSuccess) resultIconSuccess.hidden = needsVerification;
            if (resultIconMail) resultIconMail.hidden = !needsVerification;

            var roleLabel = ROLE_META[values.role] ? ROLE_META[values.role].label : 'PRAVAAH';

            if (needsVerification) {
                if (resultTitle) resultTitle.textContent = 'Check your email';
                if (resultText) {
                    resultText.textContent = 'We created your ' + roleLabel.toLowerCase() +
                        ' account request and sent a verification link to ' + values.email +
                        '. Verify your email address to continue.';
                }
                if (resendBtn) {
                    resendBtn.hidden = !(CONFIG.api.resendVerificationEndpoint);
                }
            } else {
                if (resultTitle) resultTitle.textContent = 'Account created';
                if (resultText) {
                    resultText.textContent = 'Your account has been created. Sign in to continue to your PRAVAAH workspace.';
                }
                if (resendBtn) resendBtn.hidden = true;
            }

            if (resultSignin) {
                resultSignin.textContent = 'Continue to sign in';
            }

            if (resultTitle) resultTitle.focus();
        }

        async function handleSubmit(event) {
            event.preventDefault();
            if (submitting) return;

            hideBox(formNotice, formNoticeText);
            hideBox(formError, formErrorText);

            var values = validate();
            if (!values) return;

            if (CONFIG.mode !== 'api' || !CONFIG.api.registerEndpoint) {
                showBox(
                    formNotice,
                    formNoticeText,
                    'Registration is not configured in this preview, so no account was created and no email was sent. ' +
                    'The form is ready to connect to your account service.'
                );
                return;
            }

            submitting = true;
            setButtonLoading(signupBtn, signupBtnLabel, true, 'Creating account\u2026', 'Create account');
            if (form) form.setAttribute('aria-busy', 'true');

            try {
                var response = await fetch(CONFIG.api.registerEndpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(buildPayload(values))
                });

                var payload = null;
                try {
                    payload = await response.json();
                } catch (err) {
                    payload = null;
                }

                if (response.ok) {
                    if (payload && payload.ok === true) {
                        showResult(payload.verificationRequired === true, values);
                    } else {
                        showBox(formError, formErrorText, CONFIG.messages.confirmFailed);
                    }
                } else if (response.status === 409) {
                    showBox(formError, formErrorText, CONFIG.messages.conflict);
                } else if (response.status === 422) {
                    showBox(formError, formErrorText, CONFIG.messages.invalidDetails);
                } else if (response.status === 403) {
                    showBox(formError, formErrorText, CONFIG.messages.forbidden);
                } else if (response.status === 429) {
                    showBox(formError, formErrorText, CONFIG.messages.tooMany);
                } else {
                    showBox(formError, formErrorText, CONFIG.messages.generic);
                }
            } catch (err) {
                showBox(formError, formErrorText, CONFIG.messages.generic);
            } finally {
                submitting = false;
                setButtonLoading(signupBtn, signupBtnLabel, false, 'Creating account\u2026', 'Create account');
                if (form) form.removeAttribute('aria-busy');
            }
        }

        /* ---------- Password visibility ---------- */
        function toggleVisibility(input, button) {
            if (!input || !button) return;
            var shouldShow = input.type === 'password';
            input.type = shouldShow ? 'text' : 'password';
            button.setAttribute('aria-pressed', shouldShow ? 'true' : 'false');
            button.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');

            var eyeOn = button.querySelector('.icon-eye');
            var eyeOff = button.querySelector('.icon-eye-off');
            if (eyeOn) eyeOn.hidden = shouldShow;
            if (eyeOff) eyeOff.hidden = !shouldShow;

            input.focus();
            var end = input.value.length;
            try {
                input.setSelectionRange(end, end);
            } catch (err) {
                /* Ignore inputs that do not support selection. */
            }
        }

        /* ---------- Resend verification ---------- */
        async function handleResend() {
            if (resending || !CONFIG.api.resendVerificationEndpoint) return;
            resending = true;
            hideBox(resendNotice, resendNoticeText);
            setButtonLoading(resendBtn, resendBtnLabel, true, 'Sending\u2026', 'Resend verification email');

            try {
                var response = await fetch(CONFIG.api.resendVerificationEndpoint, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email: pendingEmail })
                });

                if (response.ok) {
                    showBox(resendNotice, resendNoticeText, 'Verification email requested. Check your inbox, including the spam folder.');
                } else {
                    showBox(resendNotice, resendNoticeText, CONFIG.messages.generic);
                }
            } catch (err) {
                showBox(resendNotice, resendNoticeText, CONFIG.messages.generic);
            } finally {
                resending = false;
                setButtonLoading(resendBtn, resendBtnLabel, false, 'Sending\u2026', 'Resend verification email');
            }
        }

        /* ---------- Wiring ---------- */
        form.addEventListener('submit', handleSubmit);

        roleRadios.forEach(function (radio) {
            radio.addEventListener('change', function () {
                setRoleError('');
                updateRoleUi();
            });
        });

        fullNameInput.addEventListener('input', function () {
            clearFieldError(fullNameInput, fullNameError);
        });

        emailInput.addEventListener('input', function () {
            clearFieldError(emailInput, emailError);
        });

        organizationInput.addEventListener('input', function () {
            clearFieldError(organizationInput, organizationError);
        });

        institutionTypeInput.addEventListener('change', function () {
            clearFieldError(institutionTypeInput, institutionTypeError);
        });

        departmentInput.addEventListener('input', function () {
            clearFieldError(departmentInput, departmentError);
        });

        passwordInput.addEventListener('input', function () {
            clearFieldError(passwordInput, passwordError);
            if (confirmInput.value) {
                clearFieldError(confirmInput, confirmPasswordError);
            }
            renderPasswordState();
        });

        confirmInput.addEventListener('input', function () {
            clearFieldError(confirmInput, confirmPasswordError);
        });

        if (togglePassword) {
            togglePassword.addEventListener('click', function () {
                toggleVisibility(passwordInput, togglePassword);
            });
        }

        if (toggleConfirmPassword) {
            toggleConfirmPassword.addEventListener('click', function () {
                toggleVisibility(confirmInput, toggleConfirmPassword);
            });
        }

        if (resendBtn) {
            resendBtn.addEventListener('click', handleResend);
        }

        updateRoleUi();
        renderPasswordState();
    });
})();
