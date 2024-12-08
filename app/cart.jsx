import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router'; // Импортируем useRouter

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [db, setDb] = useState(null);
  const router = useRouter(); // Используем useRouter

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('store.db');
        setDb(database);

        const result = await database.execAsync("SELECT * FROM cart");
        setCartItems(result.rows._array); // Получаем все товары из корзины
      } catch (error) {
        console.error("Ошибка при инициализации базы данных:", error);
      }
    };

    initDB();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Корзина</Text>
      {cartItems.length === 0 ? (
        <Text>Корзина пуста</Text>
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
      <Button title="Вернуться назад" onPress={() => router.back()} />
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
});

export default Cart;
