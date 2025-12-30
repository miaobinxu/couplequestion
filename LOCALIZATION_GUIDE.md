# Spanish Localization Guide for UpSkin App

This guide explains how Spanish localization has been implemented in your UpSkin React Native/Expo app and how to use it.

## 🚀 What's Been Implemented

### 1. **Internationalization Setup**
- **i18next** and **react-i18next** for React Native localization
- **react-native-localize** for device language detection
- Custom translation hook for easy usage throughout the app

### 2. **Translation Files**
- `src/localization/translations/en.json` - English translations
- `src/localization/translations/es.json` - Spanish translations
- Organized by feature/screen for easy maintenance

### 3. **Native Configuration**
- **iOS**: Configured `CFBundleLocalizations` in Info.plist
- **Android**: Created `values-es` directory with Spanish strings
- Both platforms support language switching

### 4. **Components Updated**
- Settings screen with language selector
- Foyer screen with translated testimonials
- Custom plan generation with translated progress messages
- NotScannedCard component with translated content

## 📁 File Structure

```
src/
├── localization/
│   ├── i18n.ts                    # i18n configuration
│   └── translations/
│       ├── en.json                # English translations
│       └── es.json                # Spanish translations
├── hooks/
│   └── use-translation.ts         # Custom translation hook
└── reusable-components/
    └── misc/
        └── LanguageSelector.tsx   # Language picker component
```

## 🔧 How to Use

### 1. **In React Components**

```tsx
import { useTranslation } from '@/src/hooks/use-translation';

function MyComponent() {
  const { t, currentLanguage, changeLanguage } = useTranslation();

  return (
    <View>
      <Text>{t('common.continue')}</Text>
      <Text>{t('settings.skinProfile')}</Text>
      <Text>{t('foyer.createBestVersion')}</Text>
    </View>
  );
}
```

### 2. **Available Translation Keys**

#### Common
- `common.continue` - "Continue" / "Continuar"
- `common.back` - "Back" / "Atrás"
- `common.loading` - "Loading..." / "Cargando..."

#### Settings
- `settings.title` - "Settings" / "Configuración"
- `settings.skinProfile` - "Skin Profile" / "Perfil de Piel"
- `settings.shareApp` - "Share our App" / "Compartir nuestra App"

#### Foyer
- `foyer.twoMillion` - "+2 million" / "+2 millones"
- `foyer.glowingUsers` - "Glowing Users" / "Usuarios Radiantes"
- `foyer.createBestVersion` - "Create the best version of your skin" / "Crea la mejor versión de tu piel"

### 3. **Language Switching**

Users can change language through:
- Settings > Language / Idioma
- The app automatically detects device language on first launch
- Language preference is persisted across app sessions

### 4. **Adding New Translations**

1. Add the key to both `en.json` and `es.json`:

```json
// en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}

// es.json
{
  "newFeature": {
    "title": "Nueva Función",
    "description": "Esta es una nueva función"
  }
}
```

2. Use in component:
```tsx
const { t } = useTranslation();
return <Text>{t('newFeature.title')}</Text>;
```

## 🛠 Development Commands

### Install Dependencies
```bash
npm install react-native-localize i18next react-i18next
```

### Rebuild Native Code
```bash
npx expo prebuild --clean
```

### Run on iOS/Android
```bash
npx expo run:ios
npx expo run:android
```

## 📱 Testing Localization

### On iOS Simulator
1. Go to Settings > General > Language & Region
2. Add Spanish and set as primary language
3. Restart the app to see Spanish content

### On Android Emulator
1. Go to Settings > System > Languages & input
2. Add Spanish and move to top
3. Restart the app to see Spanish content

### Manual Testing
- Use the in-app language selector in Settings
- Test all translated screens and components
- Verify text fits properly in both languages

## 🎯 Key Features

### Automatic Language Detection
- App detects device language on first launch
- Falls back to English if device language not supported
- Supports manual language switching

### Language Selector Component
- Modal-based language picker
- Shows current selection with checkmark
- Immediately applies language changes

### Translation Hook
- Easy-to-use `useTranslation()` hook
- Provides translation function `t()`
- Includes language switching capabilities
- Returns current language and available languages

## 🔍 Troubleshooting

### Common Issues

1. **Translations not showing**
   - Ensure i18n is imported in `app/_layout.tsx`
   - Check translation keys exist in both language files
   - Verify component is using `useTranslation()` hook

2. **Language not persisting**
   - i18next automatically persists language selection
   - Check device storage permissions

3. **Build issues**
   - Run `npx expo prebuild --clean` after changes
   - Ensure all translation files are valid JSON

### Adding More Languages

To add more languages (e.g., French):

1. Create `src/localization/translations/fr.json`
2. Add to `LANGUAGES` object in `i18n.ts`
3. Add to resources in i18n configuration
4. Update iOS `CFBundleLocalizations` in Info.plist
5. Create Android `values-fr` directory

## 📋 Next Steps

1. **Expand Translations**: Add more screens and components
2. **RTL Support**: Add Arabic/Hebrew support if needed
3. **Pluralization**: Implement plural forms for counts
4. **Date/Number Formatting**: Localize dates and numbers
5. **Testing**: Add automated tests for translations

## 🤝 Contributing

When adding new text content:
1. Always use translation keys instead of hardcoded strings
2. Add translations to both English and Spanish files
3. Use descriptive, hierarchical keys (e.g., `screen.section.element`)
4. Test in both languages before committing

---

Your UpSkin app now supports Spanish localization! Users can switch between English and Spanish seamlessly, and the app will remember their preference. The foundation is in place to easily add more languages in the future.
