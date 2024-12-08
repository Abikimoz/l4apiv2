import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Button, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [db, setDb] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Используем useRouter

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync('store.db');
        setDb(database);

        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            image TEXT,
            price REAL,
            description TEXT
          )
        `);
        console.log("db успешно создана");
        await fetchProducts(); // Получение продуктов после успешной инициализации БД
      } catch (error) {
        console.error("Ошибка при инициализации базы данных на home:", error);
      }
    };

    initDB();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Ошибка при получении продуктов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (product) => {
    if (!db) {
      console.error("База данных еще не инициализирована.");
      return;
    }

    try {
      await db.withTransactionAsync(async () => {
        await db.execAsync(`
          INSERT INTO cart (title, image, price, description) 
          VALUES (?, ?, ?, ?)
        `, [product.title, product.image, product.price, product.description]);
      });
      console.log("Товар успешно добавлен в корзину");
    } catch (error) {
      console.error("Ошибка при добавлении товара в корзину:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Загрузка продуктов...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
            <Text>Цена: ${item.price}</Text>
            <Button title="Добавить в корзину" onPress={() => addToCart(item)} />
          </View>
        )}
      />
      <Button title="Перейти в корзину" onPress={() => {
        router.push("/cart");
      }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
  },
});

export default Home;
