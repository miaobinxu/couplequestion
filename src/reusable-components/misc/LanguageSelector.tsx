import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { scaleFont } from '@/src/utilities/responsive-design';
import { useTranslation } from '@/src/hooks/use-translation';
import { LanguageCode } from '@/src/localization/i18n';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ visible, onClose }) => {
  const { currentLanguage, availableLanguages, changeLanguage, t } = useTranslation();

  const handleLanguageSelect = async (languageCode: LanguageCode) => {
    await changeLanguage(languageCode);
    onClose();
  };

  const renderLanguageItem = ({ item }: { item: { code: LanguageCode; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        currentLanguage === item.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageSelect(item.code)}
    >
      <Text
        style={[
          styles.languageText,
          currentLanguage === item.code && styles.selectedLanguageText,
        ]}
      >
        {item.name}
      </Text>
      {currentLanguage === item.code && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Language</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={availableLanguages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.code}
          style={styles.list}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: scaleFont(18),
    fontFamily: 'HelveticaBold',
    color: '#1C1C1C',
  },
  closeButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  closeButtonText: {
    fontSize: scaleFont(16),
    fontFamily: 'HelveticaMedium',
    color: '#698D5F',
  },
  list: {
    flex: 1,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedLanguageItem: {
    backgroundColor: '#F8FCF8',
  },
  languageText: {
    fontSize: scaleFont(16),
    fontFamily: 'HelveticaRegular',
    color: '#1C1C1C',
  },
  selectedLanguageText: {
    fontFamily: 'HelveticaMedium',
    color: '#698D5F',
  },
  checkmark: {
    fontSize: scaleFont(18),
    color: '#698D5F',
    fontWeight: 'bold',
  },
});

export default LanguageSelector;
