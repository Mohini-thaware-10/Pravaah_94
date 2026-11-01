// PRAVAAH Settings & Profile - Frontend only, illustrative demo data

const STG_DEFAULTS = {
    subtitle: 'Approval Management',
    landing: 'overview',
    period: 'Last 30 Days',
    pageSize: '10',
    confirm: true,
    density: 'comfortable',
    theme: 'light',
    sidebar: 'expanded',
    notif1: true, notif2: true, notif3: false, notif4: true, notif5: false,
    reminder: '3',
    lang: 'en', dateFmt: 'dd-mm-yyyy', timeFmt: '24h', tz: 'ist',
    a11y1: false, a11y2: false, a11y3: false, a11y4: true
};

let stgPrefs = Object.assign({}, STG_DEFAULTS);
let stgProfile = { name: 'Portal Administrator', role: 'Authorized Official — Demo', dept: 'Administration — Sample', email: 'administrator@example.com', status: 'Demo Account' };

function stgToast(msg) {
    const t = document.getElementById('stgToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('active');
    setTimeout(() => t.classList.remove('active'), 2400);
}

function stgSyncProfile() {
    document.getElementById('stgProfName').textContent = stgProfile.name;
    document.getElementById('stgProfRole').textContent = stgProfile.role;
    document.getElementById('stgProfDept').textContent = stgProfile.dept;
    document.getElementById('stgProfLand').textContent = stgPrefs.landing === 'approval-dashboard' ? 'Approval Dashboard' : 'Overview';
    document.getElementById('stgProfDensity').textContent = stgPrefs.density === 'compact' ? 'Compact' : 'Comfortable';
    document.getElementById('stgProfTheme').textContent = stgPrefs.theme === 'dark' ? 'Dark' : stgPrefs.theme === 'system' ? 'System/default' : 'Light';
}

function stgApplyPrefs() {
    const body = document.body;
    body.classList.toggle('stg-compact', stgPrefs.density === 'compact');
    body.classList.toggle('stg-reduced-anim', stgPrefs.a11y1);
    body.classList.toggle('stg-high-contrast', stgPrefs.a11y2);
    body.classList.toggle('stg-large-text', stgPrefs.a11y3);
    body.classList.toggle('stg-focus-enhance', stgPrefs.a11y4);
    stgSyncProfile();
}

document.addEventListener('DOMContentLoaded', function() {
    stgApplyPrefs();

    document.querySelectorAll('.stg-nav__item').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.stg-nav__item').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.stg-panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const key = this.getAttribute('data-stg');
            const panel = document.querySelector(`.stg-panel[data-stg-panel="${key}"]`);
            if (panel) panel.classList.add('active');
        });
    });

    document.getElementById('stgSaveGeneral')?.addEventListener('click', function(){
        stgPrefs.subtitle = document.getElementById('stgSubtitle').value;
        stgPrefs.landing = document.getElementById('stgLanding').value;
        stgPrefs.period = document.getElementById('stgPeriod').value;
        stgPrefs.pageSize = document.getElementById('stgPageSize').value;
        stgPrefs.confirm = document.getElementById('stgConfirm').checked;
        stgPrefs.density = document.getElementById('stgDensity').value;
        stgApplyPrefs();
        stgToast('Demo preferences saved locally.');
    });
    document.getElementById('stgResetGeneral')?.addEventListener('click', function(){
        if (confirm('Reset general preferences to defaults?')) {
            stgPrefs = Object.assign({}, STG_DEFAULTS);
            document.getElementById('stgSubtitle').value = stgPrefs.subtitle;
            document.getElementById('stgLanding').value = stgPrefs.landing;
            document.getElementById('stgPeriod').value = stgPrefs.period;
            document.getElementById('stgPageSize').value = stgPrefs.pageSize;
            document.getElementById('stgConfirm').checked = stgPrefs.confirm;
            document.getElementById('stgDensity').value = stgPrefs.density;
            stgApplyPrefs();
            stgToast('General preferences reset.');
        }
    });

    document.getElementById('stgSaveAppearance')?.addEventListener('click', function(){
        stgPrefs.theme = document.getElementById('stgTheme').value;
        stgPrefs.sidebar = document.getElementById('stgSidebar').value;
        stgApplyPrefs();
        stgToast('Appearance preferences saved (demo).');
    });
    document.getElementById('stgResetAppearance')?.addEventListener('click', function(){
        if (confirm('Reset appearance preferences to defaults?')) {
            stgPrefs.theme = STG_DEFAULTS.theme;
            stgPrefs.sidebar = STG_DEFAULTS.sidebar;
            document.getElementById('stgTheme').value = stgPrefs.theme;
            document.getElementById('stgSidebar').value = stgPrefs.sidebar;
            stgApplyPrefs();
            stgToast('Appearance preferences reset.');
        }
    });

    document.getElementById('stgSaveNotif')?.addEventListener('click', function(){
        stgPrefs.notif1 = document.getElementById('stgNotif1').checked;
        stgPrefs.notif2 = document.getElementById('stgNotif2').checked;
        stgPrefs.notif3 = document.getElementById('stgNotif3').checked;
        stgPrefs.notif4 = document.getElementById('stgNotif4').checked;
        stgPrefs.notif5 = document.getElementById('stgNotif5').checked;
        stgPrefs.reminder = document.getElementById('stgReminder').value;
        stgToast('Notification preferences saved locally.');
    });
    document.getElementById('stgResetNotif')?.addEventListener('click', function(){
        if (confirm('Reset notification preferences to defaults?')) {
            stgPrefs.notif1 = STG_DEFAULTS.notif1; stgPrefs.notif2 = STG_DEFAULTS.notif2; stgPrefs.notif3 = STG_DEFAULTS.notif3; stgPrefs.notif4 = STG_DEFAULTS.notif4; stgPrefs.notif5 = STG_DEFAULTS.notif5; stgPrefs.reminder = STG_DEFAULTS.reminder;
            document.getElementById('stgNotif1').checked = stgPrefs.notif1;
            document.getElementById('stgNotif2').checked = stgPrefs.notif2;
            document.getElementById('stgNotif3').checked = stgPrefs.notif3;
            document.getElementById('stgNotif4').checked = stgPrefs.notif4;
            document.getElementById('stgNotif5').checked = stgPrefs.notif5;
            document.getElementById('stgReminder').value = stgPrefs.reminder;
            stgToast('Notification preferences reset.');
        }
    });

    document.getElementById('stgSaveLang')?.addEventListener('click', function(){
        stgPrefs.lang = document.getElementById('stgLang').value;
        stgPrefs.dateFmt = document.getElementById('stgDateFmt').value;
        stgPrefs.timeFmt = document.getElementById('stgTimeFmt').value;
        stgPrefs.tz = document.getElementById('stgTz').value;
        stgToast('Language & region preferences saved (preview).');
    });
    document.getElementById('stgResetLang')?.addEventListener('click', function(){
        if (confirm('Reset language/region preferences to defaults?')) {
            stgPrefs.lang = STG_DEFAULTS.lang; stgPrefs.dateFmt = STG_DEFAULTS.dateFmt; stgPrefs.timeFmt = STG_DEFAULTS.timeFmt; stgPrefs.tz = STG_DEFAULTS.tz;
            document.getElementById('stgLang').value = stgPrefs.lang;
            document.getElementById('stgDateFmt').value = stgPrefs.dateFmt;
            document.getElementById('stgTimeFmt').value = stgPrefs.timeFmt;
            document.getElementById('stgTz').value = stgPrefs.tz;
            stgToast('Preferences reset.');
        }
    });

    document.getElementById('stgSaveA11y')?.addEventListener('click', function(){
        stgPrefs.a11y1 = document.getElementById('stgA11y1').checked;
        stgPrefs.a11y2 = document.getElementById('stgA11y2').checked;
        stgPrefs.a11y3 = document.getElementById('stgA11y3').checked;
        stgPrefs.a11y4 = document.getElementById('stgA11y4').checked;
        stgApplyPrefs();
        stgToast('Accessibility preferences saved locally.');
    });
    document.getElementById('stgResetA11y')?.addEventListener('click', function(){
        if (confirm('Reset accessibility preferences to defaults?')) {
            stgPrefs.a11y1 = STG_DEFAULTS.a11y1; stgPrefs.a11y2 = STG_DEFAULTS.a11y2; stgPrefs.a11y3 = STG_DEFAULTS.a11y3; stgPrefs.a11y4 = STG_DEFAULTS.a11y4;
            document.getElementById('stgA11y1').checked = stgPrefs.a11y1;
            document.getElementById('stgA11y2').checked = stgPrefs.a11y2;
            document.getElementById('stgA11y3').checked = stgPrefs.a11y3;
            document.getElementById('stgA11y4').checked = stgPrefs.a11y4;
            stgApplyPrefs();
            stgToast('Accessibility preferences reset.');
        }
    });

    document.getElementById('stgEditProfile')?.addEventListener('click', function(){
        document.getElementById('stgProfileModal').classList.add('active');
        document.getElementById('stgEditName').value = stgProfile.name;
        document.getElementById('stgEditDept').value = stgProfile.dept;
    });
    document.getElementById('stgProfileModalClose')?.addEventListener('click', function(){ document.getElementById('stgProfileModal').classList.remove('active'); });
    document.getElementById('stgProfileCancel')?.addEventListener('click', function(){ document.getElementById('stgProfileModal').classList.remove('active'); });
    document.querySelector('#stgProfileModal .stg-modal__backdrop')?.addEventListener('click', function(){ document.getElementById('stgProfileModal').classList.remove('active'); });
    document.getElementById('stgProfileSave')?.addEventListener('click', function(){
        stgProfile.name = document.getElementById('stgEditName').value.trim() || stgProfile.name;
        stgProfile.dept = document.getElementById('stgEditDept').value.trim() || stgProfile.dept;
        document.getElementById('stgProfileModal').classList.remove('active');
        stgSyncProfile();
        stgToast('Demo profile updated locally.');
    });

    document.getElementById('stgSignOut')?.addEventListener('click', function(){
        alert('Sign out - UI only placeholder. No actual sign out implemented.');
    });

    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { document.getElementById('stgProfileModal').classList.remove('active'); } });
});
