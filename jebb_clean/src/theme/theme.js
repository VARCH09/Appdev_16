import { Platform } from 'react-native';


export const theme = {
colors: {
background: '#3a3a36',
surface: '#2f2f2d',
card: '#3f3e3b',
text: '#e9e4b6',
muted: '#b9b39a',
accent: '#e7d479',
danger: '#ff6b6b',
income: '#60c08f',
expense: '#ff8a80',
},
spacing: (n) => n * 8,
radius: {
sm: 8,
md: 12,
lg: 18,
},
font: {
family: Platform.select({ ios: 'Helvetica', android: 'Roboto', default: 'System' }),
}
};