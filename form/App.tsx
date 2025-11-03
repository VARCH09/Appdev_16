// App.tsx
import React, { useState } from 'react';
import Slider from '@react-native-community/slider';
import { Checkbox } from 'react-native-paper';
import {
  ScrollView,
  View,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  RadioButton,
  Text,
  Menu,
  Provider as PaperProvider,
} from 'react-native-paper';
import DatePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const App = () => {
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('male'); // 'male', 'female', 'other'
  const [country, setCountry] = useState('US');
  const [subjects, setSubjects] = useState({
    math: false,
    science: false,
    english: false,
    history: false,
  });
  const [satisfaction, setSatisfaction] = useState(5); // 0–10 scale
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleSubject = (key: keyof typeof subjects) => {
    setSubjects({ ...subjects, [key]: !subjects[key] });
  };

  const handleSubmit = () => {
    const selectedSubjects = Object.entries(subjects)
      .filter(([, selected]) => selected)
      .map(([subject]) => subject.charAt(0).toUpperCase() + subject.slice(1));

    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const message = `
Name: ${fullName}
Email: ${email}
DOB: ${dob.toDateString()}
Gender: ${gender}
Country: ${country}
Subjects: ${selectedSubjects.length > 0 ? selectedSubjects.join(', ') : 'None'}
Satisfaction: ${satisfaction}/10
    `.trim();

    Alert.alert('Form Submitted!', message);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Student Registration" />
        </Appbar.Header>

        <ScrollView contentContainerStyle={styles.form}>
          {/* Full Name */}
          <TextInput
            label="Full Name *"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            mode="outlined"
          />

          {/* Email */}
          <TextInput
            label="Email *"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            mode="outlined"
          />

          {/* Date of Birth */}
          <Button
            onPress={() => setShowDatePicker(true)}
            mode="outlined"
            style={styles.input}
          >
            {`Date of Birth: ${dob.toDateString()}`}
          </Button>
          {showDatePicker && (
            <DatePicker
              value={dob}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDob(selectedDate);
              }}
            />
          )}

          {/* Gender (Radio Buttons) */}
          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group onValueChange={setGender} value={gender}>
            <View style={styles.radioRow}>
              <Text>Male</Text>
              <RadioButton value="male" />
            </View>
            <View style={styles.radioRow}>
              <Text>Female</Text>
              <RadioButton value="female" />
            </View>
            <View style={styles.radioRow}>
              <Text>Other</Text>
              <RadioButton value="other" />
            </View>
          </RadioButton.Group>

          {/* Country Dropdown */}
          <Text style={styles.label}>Country</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={country}
              onValueChange={(itemValue) => setCountry(itemValue)}
              dropdownIconColor="#000"
              style={styles.picker}
            >
              <Picker.Item label="United States" value="US" />
              <Picker.Item label="Canada" value="CA" />
              <Picker.Item label="United Kingdom" value="UK" />
              <Picker.Item label="Australia" value="AU" />
              <Picker.Item label="India" value="IN" />
            </Picker>
          </View>

          {/* Subjects (Checkboxes) */}
          <Text style={styles.label}>Preferred Subjects</Text>
          {(['math', 'science', 'english', 'history'] as const).map((sub) => (
            <View key={sub} style={styles.checkboxRow}>
              <Checkbox
                uncheckedColor="#ff0000ff"
                status={subjects[sub] ? 'checked' : 'unchecked'}
                color="#18ee00ff"
                onPress={() => toggleSubject(sub)}
              />
              <Text>
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </Text>
            </View>
          ))}

          {/* Satisfaction Slider */}
          <Text style={styles.label}>Satisfaction Level: {satisfaction}/10</Text>
          <Slider
            value={satisfaction}
            onValueChange={setSatisfaction}
            minimumValue={0}
            maximumValue={10}
            step={1}
            style={styles.slider}
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            Submit Registration
          </Button>
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  checkboxRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 4,
},
  slider: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
});

export default App;