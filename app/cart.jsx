import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [db, setDb] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initDB = async () => {
      try {
        // Открываем базу данных
        const database = await SQLite.openDatabaseAsync('store.db');
        setDb(database);

        // Получаем товары из корзины
        fetchCartItems(database);
      } catch (error) {
        console.error("Ошибка при инициализации базы данных на cart:", error);
      }
    };

    const fetchCartItems = async (database) => {
      try {
        const result = await database.getAllAsync("SELECT * FROM cart");
        console.log("Данные получены успешно:", result);
        setCartItems(result); // Успешно получаем все товары из корзины
      } catch (error) {
        console.error("Ошибка при выполнении SQL:", error);
      }
    };

    initDB();
  }, []);

  // Функция для очистки корзины
  const clearCart = async () => {
    try {
      // Выполняем SQL-запрос для очистки корзины
      await db.execAsync("DELETE FROM cart");
      setCartItems([]); // Обновляем состояние, очищая корзину
      Alert.alert("Корзина очищена"); // Показать уведомление
    } catch (error) {
      console.error("Ошибка при очистке корзины:", error);
    }
  };

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.title}>Ваша корзина пуста</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>Цена: ${item.price}</Text>
            </View>
          )}
        />
      )}
      <View style={styles.buttonContainer}>
        <Button title="Очистить корзину" onPress={clearCart} color="red" />
        <Button title="Вернуться назад" onPress={() => router.back()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 20, // Добавляем отступ между кнопками и списком
  },
});

export default Cart;
