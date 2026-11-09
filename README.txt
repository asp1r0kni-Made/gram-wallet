GRAM WALLET — проект для сборки APK

Вариант А (без установки программ, через GitHub):
1. Зарегистрируйтесь на github.com, нажмите New repository, назовите gram-wallet, создайте.
2. Нажмите "uploading an existing file" и перетащите ВСЁ из этой папки (www, package.json, capacitor.config.json, .gitignore). Commit changes.
3. Папку .github может не перетащиться. Тогда: Add file -> Create new file, в имени файла напишите
   .github/workflows/build-apk.yml  и вставьте туда содержимое файла build-apk.yml из архива. Commit.
4. Вкладка Actions -> Build APK -> дождитесь зелёной галочки (5-10 минут).
   Откройте запуск, внизу в Artifacts скачайте GramWallet-APK (zip, внутри app-debug.apk).
5. Перекиньте app-debug.apk на телефон и установите (разрешите установку из неизвестных источников).

Вариант Б (на компьютере, нужны Node.js 18+, JDK 17 и Android Studio):
  npm install
  npx cap add android
  npx cap sync android
  npx cap open android
В Android Studio: Build -> Build Bundle(s)/APK(s) -> Build APK(s).
Файл: android/app/build/outputs/apk/debug/app-debug.apk

Админ внутри приложения: логин admin, пароль admin12345 -> аватар -> Админ-панель.
Все данные (аккаунты, иконки TGS) хранятся на самом телефоне.
