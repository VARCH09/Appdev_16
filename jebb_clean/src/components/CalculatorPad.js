import React from 'react';
import styled from 'styled-components/native';

const PadContainer = styled.View`
  margin-top: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const Key = styled.TouchableOpacity`
  flex: 1;
  background-color: #3f3e3b;
  padding: 18px 0;
  margin: 4px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const KeyText = styled.Text`
  color: #e7d479;
  font-size: 24px;
`;

export default function CalculatorPad({ onPressKey }) {

  function press(k) {
    if (onPressKey) onPressKey(k);
  }

  return (
    <PadContainer>

      {/* Row 1 */}
      <Row>
        <Key onPress={() => press('7')}><KeyText>7</KeyText></Key>
        <Key onPress={() => press('8')}><KeyText>8</KeyText></Key>
        <Key onPress={() => press('9')}><KeyText>9</KeyText></Key>
        <Key onPress={() => press('÷')}><KeyText>÷</KeyText></Key>
      </Row>

      {/* Row 2 */}
      <Row>
        <Key onPress={() => press('4')}><KeyText>4</KeyText></Key>
        <Key onPress={() => press('5')}><KeyText>5</KeyText></Key>
        <Key onPress={() => press('6')}><KeyText>6</KeyText></Key>
        <Key onPress={() => press('×')}><KeyText>×</KeyText></Key>
      </Row>

      {/* Row 3 */}
      <Row>
        <Key onPress={() => press('1')}><KeyText>1</KeyText></Key>
        <Key onPress={() => press('2')}><KeyText>2</KeyText></Key>
        <Key onPress={() => press('3')}><KeyText>3</KeyText></Key>
        <Key onPress={() => press('-')}><KeyText>-</KeyText></Key>
      </Row>

      {/* Row 4 */}
      <Row>
        <Key onPress={() => press('0')}><KeyText>0</KeyText></Key>
        <Key onPress={() => press('.')}><KeyText>.</KeyText></Key>
        <Key onPress={() => press('DEL')}><KeyText>⌫</KeyText></Key>
        <Key onPress={() => press('+')}><KeyText>+</KeyText></Key>
      </Row>

      {/* Row 5 */}
      <Row>
        <Key onPress={() => press('C')}>
          <KeyText style={{ color: '#ff8a80' }}>C</KeyText>
        </Key>

        <Key
          onPress={() => press('=')}
          style={{
            flex: 2,
            backgroundColor: '#e7d479',
          }}
        >
          <KeyText style={{ color: '#2f2f2d', fontSize: 24 }}>=</KeyText>
        </Key>
      </Row>

    </PadContainer>
  );
}
