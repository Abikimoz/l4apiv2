import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{ title: 'Home Screen' }} // Заголовок для главного экрана
      />
      <Stack.Screen
        name="cart"
        options={{ title: 'Корзина' }} // Заголовок для корзины
      />
    </Stack>
  );
};
