import 'package:flutter/material.dart';

void main() => runApp(const SimpleCalcApp());

class SimpleCalcApp extends StatelessWidget {
  const SimpleCalcApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Minimal Calculator',
      home: CalculatorScreen(),
    );
  }
}

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({super.key});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  // 1. Text Controllers for user input
  final TextEditingController num1Controller = TextEditingController();
  final TextEditingController num2Controller = TextEditingController();
  // 2. State variable to display the result
  String result = "0.0";

  void calculate(String operator) {
    // 3. Get input and safely convert to double (defaulting to 0)
    double num1 = double.tryParse(num1Controller.text) ?? 0;
    double num2 = double.tryParse(num2Controller.text) ?? 0;
    double res = 0;

    // 4. Perform the calculation based on the operator
    switch (operator) {
      case '+': res = num1 + num2; break;
      case '-': res = num1 - num2; break;
      case '×': res = num1 * num2; break;
      case '÷':
        if (num2 != 0) {
          res = num1 / num2;
        } else {
          // Handle division by zero
          setState(() => result = "Error: Div by 0");
          return;
        }
        break;
      default:
        res = 0;
    }

    // 5. Update the UI with the result
    setState(() {
      // Format the result to look clean
      String resString = res.toStringAsFixed(2);
      if (resString.endsWith('.00')) {
        resString = res.toStringAsFixed(0);
      }
      result = resString;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Basic Calculator"),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Input Fields
            TextField(
              controller: num1Controller,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'First Number', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: num2Controller,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Second Number', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 30),

            // Operator Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                _buildButton('+', () => calculate('+')),
                _buildButton('-', () => calculate('-')),
                _buildButton('×', () => calculate('×')),
                _buildButton('÷', () => calculate('÷')),
              ],
            ),
            const SizedBox(height: 40),

            // Result Display
            Text(
              'Result:',
              style: TextStyle(fontSize: 18, color: Colors.grey[700]),
            ),
            Text(
              result,
              style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: Colors.teal),
            ),
          ],
        ),
      ),
    );
  }

  // Helper function to create uniform operator buttons
  Widget _buildButton(String text, VoidCallback onPressed) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 4.0),
        child: ElevatedButton(
          onPressed: onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.teal,
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 20),
            textStyle: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          ),
          child: Text(text),
        ),
      ),
    );
  }
}