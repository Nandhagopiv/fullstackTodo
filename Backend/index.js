import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import { log } from 'console';

const server = express();
server.use(express.json());
server.use(cors());

const uri = 'mongodb+srv://nandhagopy:12345@clustertodo.fevoqn2.mongodb.net/';

const client = new MongoClient(uri);

server.get('/list', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('todolist');
    const shoppingList = db.collection('shoppinglist');

    const data = await shoppingList.find().toArray();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch shopping list' });
  }
});

server.get('/delete', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('todolist');
    const shoppingList = db.collection('shoppinglist');
    const item = req.query.item;

    const result = await shoppingList.deleteOne({ item: item });
    console.log(result);

    if (result.deletedCount === 1) {
      const data = await shoppingList.find().toArray()
      res.send(data)
    }
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

server.get('/update', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('todolist');
    const shoppingList = db.collection('shoppinglist');
    await shoppingList.updateMany({item: req.query.product},{$set:{item:req.query.item}})
    const data = await shoppingList.find().toArray()
    res.send(data)
    
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
})

server.get('/addlist', async (req, res) => {
  try {
    await client.connect();
    const db = client.db('todolist');
    const shoppingList = db.collection('shoppinglist');

    const newItem = { item: req.query.item, forDel: req.query.forDel };
    await shoppingList.insertOne(newItem);

    res.status(201).json({ message: 'Item added to shopping list' });
  } catch (err) {
    console.error('Error Updating item:', err);
    res.status(500).json({ error: 'Failed to update item to shopping list' });
  }
});

const main = async () => {
  try {
    await client.connect();
    console.log('MongoDB connected successfully');

    server.listen(5000, () => {
      console.log('Local server is running on port 5000');
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
};

main();
