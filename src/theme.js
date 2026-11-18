 div class="theme-switcher"
    for each theme, add a dot like this:
    button class="theme-dot" style="background:#C9A44C" data-key="classic" /button
    button class="theme-dot" style="background:#1B4332" data-key="luxury" /button
    button class="theme-dot" style="background:#4F46E5" data-key="startup" /button
    button class="theme-dot" style="background:#C2410C" data-key="warm" /button
    button class="theme-dot" style="background:#5B8DEF" data-key="dark" /button
  /div

Then wire up the dots with this script:

  import { setTheme, getTheme } from './src/theme.js';
  document.querySelectorAll('.theme-dot').forEach(btn => {
    if (btn.dataset.key === getTheme()) btn.classList.add('active');
    btn.addEventListener('click', () => {
      setTheme(btn.dataset.key);
      document.querySelectorAll('.theme-dot').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
