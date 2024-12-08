import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button } from 'react-native';
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

        // Функция для получения товаров из корзины
        fetchCartItems(database);
      } catch (error) {
        console.error("Ошибка при инициализации базы данных на cart:", error);
      }
    };

    const fetchCartItems = async (database) => {
      try {
        // Выполняем запрос для получения товаров из корзины
        const result = await new Promise((resolve, reject) => {
          database.transaction(tx => {
            tx.executeSql(
              "SELECT * FROM cart",
              [],
              (_, result) => {
                console.log("Данные получены успешно:", result);
                resolve(result);
              }, // Успех
              (_, error) => {
                console.error("Ошибка при выполнении SQL:", error);
                reject(error); // Ошибка
              }
            );
          });
        });

        if (result && result.rows) {
          setCartItems(result.rows._array); // Успешно получаем все товары из корзины
        } else {
          console.log("Результат запроса пустой или структура неожиданная:", result);
        }
      } catch (error) {
        console.error("Ошибка при fetching товаров из корзины:", error);
      }
    };

    initDB();
  }, []);

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
